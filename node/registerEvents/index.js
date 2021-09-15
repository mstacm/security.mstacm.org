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
const stripe = require("stripe")(config.stripeSK);
const express = require("express");
const cors = require("cors");
const googleSheets = require("@googleapis/sheets");

const auth = new googleSheets.auth.GoogleAuth({
    keyFilename: config.googleSheetsInfo.keyFilename,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheetsClientPromise = auth.getClient().then( (authClient) => {
    return googleSheets.sheets({
        version: "v4",
        auth: authClient,
    });
});

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());  // Required for REST API with site


// async function getNumRegistrants() {
//     const sheets = await sheetsClientPromise;
//     const { data } = await sheets.spreadsheets.values.get({
//         spreadsheetId: config.googleSheetsInfo.spreadsheetID,
//         range: "A2:A",
//     });

//     let numRegistrants = 0;
//     console.log(data.values || "undefined");
//     for (const row of data.values) {
//         numRegistrants += row[0].length > 0
//     }
//     return numRegistrants;
// }


/**
 * @typedef  {Object}   OrderInfo
 * @property {string}   customerName
 * @property {string}   email
 * @property {?string}  discCode          Discount code
 * @property {string}   transactionToken  Unique Stripe payment token
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

    // Parse user's data from registration page
    const { customerName, email, discCode, transactionToken } = order;

    // let event = config.events[req.params.eventName];
    let event = config.events["wireless-workshop-2021"];

    if (event === undefined) {
        return res.status(400).send("Invalid event name");
    }

    let finalCharge = event.cost;

    for (const discountCode in event.discountCodes) {
        if (discountCode.toUpperCase() === discCode.toUpperCase()) {
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
            source: transactionToken,
            description: event.title + " - ACM Security",
            receipt_email: email,
        });
    } catch (error) {
        // If the charge fails, log the error and let the user know.
        console.error(error);
        return res.status(402).send("Your card was declined!");
    }

    // Let the user know that processing was successful
    console.log("Payment was successful.");
    res.send("Your payment was successful!");

    // TODO: Make it so that you don't have to await this
    const sheets = await sheetsClientPromise;

    // Add a row to the bottom of the spreadsheet.
    await sheets.spreadsheets.values.append({
        spreadsheetId: config.googleSheetsInfo.spreadsheetID,
        range: "A1",
        valueInputOption: "RAW",
        requestBody: {
            majorDimension: "ROWS",

            // Values are placed in the row from left to right.
            values: [[
                (new Date()).toString(),  // Purchase timestamp
                customerName,
                email,
                charge.amount / 100,
                discCode || "",
            ]],
        }
    });

    console.log("Order logged to the spreadsheet.");

    emailmod.sendRegEmail(
        customerName,
        email,
        charge.amount / 100,
        event.title,
        discCode,
    );
});


/**
 * GET Event info
 * 
 * Returns information about the current event.
 */
// app.get("/api/registration/event-info/:eventName", (req, res) => {
app.get("/getRegEvent", async (req, res) => {
    //const eventInfo = {...config.events[req.params.eventName]};
    const eventInfo = {...config.events["wireless-workshop-2021"]};
    if (eventInfo === undefined) {
        return res.status(400).send("Invalid event name");
    }

    // Delete the coupon code data from the response
    delete eventInfo.discountCodes;

    // eventInfo.full = (await getNumRegistrants()) >= eventInfo.maxRegistrants;
    eventInfo.full = false;
    delete eventInfo.maxRegistrants;

    // Add the public key to use in the Stripe payment form
    if (!eventInfo.full) eventInfo.stripePK = config.stripePK;

    res.send(eventInfo);
});


// Setup port options for starting backend
const port = process.env.PORT || 3001; // Leave as 3001 for event registration, allowing processes to be taken down
app.listen(port, () => console.log(`Listening on port ${port}!`) );
