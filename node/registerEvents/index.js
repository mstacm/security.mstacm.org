/**
 * ACM Security event registration server
 *
 * Provides the backend support for registration submissions for ACM Security
 * events.
 *
 * @file   index.js
 * @author Charles Rawlins & Nate Kean.
 */

// Log uncaught errors in production; throw them in development.
process.on("unhandledRejection", process.env.NODE_ENV !== "production" ?
    console.error :
    up => { throw up }
);

const config = require("./private/config");
const emailmod = require("./regEmails");
const sheets = require("./sheets");
const stripe = require("stripe")(config.stripeSK);
const express = require("express");
const cors = require("cors");

const app = express();

const eventSlug = "cyber-boot-camp-2022";

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());  // Required for REST API with site


/**
 * @typedef  {Object} OrderInfo
 * @property {string} customerName
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} major
 * @property {string} year              Class in college
 * @property {"In-person" | "Online"} attendanceType
 * @property {?string} discCode         Discount code
 * @property {string} transactionToken  Unique Stripe payment token
 */

/**
 * POST Submit Purchase
 *
 * Endpoint for submitting a payment to register for an event.
 * The purchase's Stripe payment token is submitted to Stripe,
 * the customer's purchase is added to the order log spreadsheet,
 * and a notification of the purchase is sent to the ACM Security officers.
 */
// app.post("/api/registration/submit-purchase/:eventName", async (req, res) => {
app.post("/regCharge", async (req, res) => {
    /**
     * @type {OrderInfo}
     */
    const order = req.body;
    console.log("Order received:", order);

    // let event = config.events[req.params.eventName];
    let event = config.events[eventSlug];

    if (event === undefined) {
        return res.status(400).send("Invalid event name");
    }

    let finalCharge;
    if (order.attendanceType === "In-person") {
        finalCharge = event.cost.inPerson;
    } else {
        finalCharge = event.cost.online;
    }

    for (const discountCode in event.discountCodes) {
        if (discountCode.toUpperCase() === order.discCode.toUpperCase()) {
            finalCharge -= event.discountCodes[discountCode];
            break;  // DESIGN DECISION: Only apply the first code in the list
        }
    }

    // Create new Stripe charge with public/private keys
    let charge;
    try {
        charge = await stripe.charges.create({
            amount: finalCharge * 100,  // Stripe expects cents
            currency: "usd",
            source: order.transactionToken,
            description: event.title + " - ACM Security",
            receipt_email: order.email,
        });
    } catch (error) {
        // If the charge fails, log the error and let the user know.
        console.error(error);
        return res.status(402).send("Your card was declined!");
    }

    // Let the user know that processing was successful
    console.log("Payment was successful.");
    res.send("Your payment was successful!");

    // Add a row to the bottom of the spreadsheet.
    await sheets.addRegistration(event.spreadsheetID, [
        (new Date()).toString(),  // Purchase timestamp
        order.attendanceType,
        order.customerName,
        order.email,
        order.phoneNumber,
        charge.amount / 100,
        order.discCode || "",
        order.major,
        order.year,
    ]);

    console.log("Order logged to the spreadsheet.");

    emailmod.sendRegEmail(
        order,
        charge.amount / 100,
        event.title,
    );
});


/**
 * GET Event info
 * 
 * Returns information about the current event.
 */
// app.get("/api/registration/event-info/:eventName", (req, res) => {
app.get("/getRegEvent", async (_, res) => {
    //const eventInfo = {...config.events[req.params.eventName]};
    const eventInfo = {...config.events[eventSlug]};
    if (eventInfo === undefined) {
        return res.status(400).send("Invalid event name");
    }

    // Delete the coupon code data from the response
    delete eventInfo.discountCodes;

    // Don't expose the current number of registrants; just tell the user
    // whether the event is full or not.
    eventInfo.full = {
        inPerson: (await getNumInPersonRegistrants()) >= eventInfo.maxRegistrants.inPerson,
        online: (await getNumOnlineRegistrants()) >= eventInfo.maxRegistrants.online,
    };
    
    delete eventInfo.maxRegistrants;

    // Add the public key to use in the Stripe payment form
    if (!eventInfo.full.inPerson || !eventInfo.full.online) {
        eventInfo.stripePK = config.stripePK;
    }

    res.send(eventInfo);
});


// Setup port options for starting backend
const port = process.env.PORT || 3001; // Leave as 3001 for event registration, allowing processes to be taken down
app.listen(port, () => console.log(`Listening on port ${port}!`) );
