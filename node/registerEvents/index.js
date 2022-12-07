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

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());  // Required for REST API with site


/**
 * @typedef  {Object} Order
 * @property {string} slug - Event identifier
 * @property {string} customerName
 * @property {string} email
 * @property {string} major
 * @property {?string} year - Class in college
 * @property {"In-person" | "Online"} attendanceType
 * @property {Object.<string, string>} [extra] - Extra information
 * @property {?string} discCode - Discount code
 * @property {string} transactionToken - Unique Stripe payment token
 */

/**
 * POST Submit Purchase
 *
 * Endpoint for submitting a payment to register for an event.
 * The purchase's Stripe payment token is submitted to Stripe,
 * the customer's purchase is added to the order log spreadsheet,
 * and a notification of the purchase is sent to the ACM Security officers.
 */
app.post("/regCharge", async (req, res) => {
    /**
     * @type {Order}
     */
    const order = req.body;
    console.log("Order received:", order);

    const event = config.events[order.slug];

    if (event === undefined) {
        return res.status(400).send("Invalid event name");
    }

    order.extra = order.extra || {};

    // Determine the cost based on attendance type
    let finalCharge;
    if (order.attendanceType === "In-person") {
        finalCharge = event.cost.inPerson;
    } else {
        finalCharge = event.cost.online;
    }

    // Check for and apply a discount code
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
        (new Date()).toString(),  // Payment timestamp
        order.attendanceType,
        order.customerName,
        order.email,
        order.major,
        order.year,
        charge.amount / 100,
        ...Object.values(order.extra),  // Slap all the extra info onto the end
    ]);
    console.log("Order logged to the spreadsheet.");

    emailmod.sendRegEmail(event, order, charge.amount / 100);
    console.log("Order notification sent to officers.");
});


/**
 * GET Event info
 * 
 * Returns information about the current event.
 */
app.get("/getRegEvent", async (req, res) => {
    const event = {...config.events[req.query.slug]};
    if (event === undefined) {
        return res.status(400).send("Invalid event identifier");
    }

    const inPersonFull = (await sheets.inPersonRegistrations(event.spreadsheetID))
        >= event.maxRegistrants.inPerson;
    const onlineFull = (await sheets.onlineRegistrations(event.spreadsheetID))
        >= event.maxRegistrants.online;

    res.send({
        title: event.title,
        cost: event.cost,

        // Don't expose the current number of registrations; just tell the user
        // whether the event is full or not.
        full: {
            inPerson: inPersonFull,
            online: onlineFull,
        },

        // Add the public key to use in the Stripe payment form
        // (but only if the event is open for registration)
        stripePK: (!inPersonFull || !onlineFull) ?
            config.stripePK :
            null,
    });
});


// Setup port options for starting backend
const port = process.env.PORT || 3001; // Leave as 3001 for event registration, allowing processes to be taken down
app.listen(port, () => console.log(`Listening on port ${port}!`) );
