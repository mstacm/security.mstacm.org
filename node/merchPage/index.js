/**
 * Main ACM Merch file.
 *
 * Provides the backend support for merch purchases for ACM Security.
 *
 * @file   index.js
 * @author Charles Rawlins.
 */

// Log uncaught errors in production; throw them in development.
process.on("unhandledRejection", process.env.NODE_ENV !== "production" ?
    console.error :
    up => { throw up }
);

const config = require("./merchConfigs/config");
const emailmod = require("./merchEmails");
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
// app.use("/payment", express.static("payment"));  // Host the payment page
app.use(cors());  // Required for REST API with site


/**
 * @typedef {Object} OrderInfo
 * @property {string} customerName
 * @property {string} email
 * @property {number} numBundles Number of merch bundles ordered
 * @property {"S" | "M" | "L" | "XL"} shirtSize
 * @property {?string} discCode Discount code
 * @property {string} transactionToken Unique Stripe payment token
 */

/**
 * POST merch page endpoint
 *
 * POST endpoint for merch page. Stripe payment token will be submitted here.
 * Customer's purchase will then be added to the spreadsheet listed in the
 * config file and emails will be sent to the ACM merch email and the customer.
 * 
 * TODO: Enforce the maximum number of bundles on the server side.
 */
app.post("/merchCharge", async (req, res) => {
    // Set the charge amount on server side for security.
    const bundlePrice = config.chargePrices[0];

    /**
     * @type {OrderInfo}
     */
    const order = req.body;

    // Parse user's data from registration page
    const { customerName, email, numBundles, shirtSize, discCode, transactionToken } = order;

    if (numBundles < 1 || numBundles % 1 !== 0) {
        res.status(400).send({
            trxnSuccess: "Number of bundles must be an integer greater than zero.",
            success: false,
        });
        return;
    }

    // All merch numbers are valid, proceed with purchase
    let totalCharge = bundlePrice * numBundles;

    if (discCode === config?.discCode) {
        totalCharge = (bundlePrice - config.discAmount) * numBundles;
    }

    // Create new Stripe charge with public/private keys
    try {
        await stripe.charges.create({
            amount: totalCharge,
            currency: "usd",
            source: transactionToken,
            description: config.title,
            receipt_email: email,
        });
    } catch (error) {
        // If the charge fails, log the error and let the user know.
        console.error(error);
        res.send({
            trxnSuccess: "Your card was declined!",
            success: false,
        });
        return;
    }

    // Payment was successful; log the order to the spreadsheet and
    // send an email notification to the officers.
    console.log("Payment was successful.");

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
                numBundles,
                shirtSize,
                "NO",  // Fulfilled status. Always initally "NO", then
                       // manually set to "YES" by an officer once the
                       // order is fulfilled.
            ]],
        }
    });

    emailmod.sendMerchEmail(
        customerName,
        email,
        numBundles,
        shirtSize
    );

    // Let the user know that processing was successful
    res.send({
        trxnSuccess: "Your payment was successful!",
        success: true,
    });
});


// Setup port options for starting backend
const port = process.env.PORT || 3002; // Leave as 3002 for merch payment, allowing processes to be taken down
app.listen(port, () => console.log(`Listening on port ${port}!`) );
