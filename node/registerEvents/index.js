/**
 * Main ACM Registration file.
 *
 * Provides the backend support for event registration for ACM Security.
 * Config 3.json5 files can be found in ./registerConfigs
 *
 * @file   index.js
 * @author Charles Rawlins.
 */

// Change to select new configuration file for the front/back end
var eventFile = "./registerConfigs/lockpickexample.json5"

const fs = require('fs');
var json5 = require('json5');
var bodyParser = require('body-parser')
const express = require('express')
// Required to make API calls work well
var cors = require('cors')
const forceSync = require('sync-rpc')
// Custom email functions for letting officers know about new registration
var emailmod = require('./regEmails')
var eventSpread = require('google-spreadsheet-append-es5');

// Load config file and parse data for front and back end
data = fs.readFileSync(eventFile);
var eventInfo= json5.parse(data)
var clientInfo = eventInfo.event.clientInfo;
var serverInfo = eventInfo.event.serverInfo;
const app = express();

// Setup stripe keys
const stripe = require("stripe")(serverInfo.stripesk);

// Google Sheets API for getting sheet data is async, made a forced sync function
const syncFunction = forceSync(require.resolve('./getRegisters'))

// Setup configs for the server app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()) // Required for REST API with site

//Authentication to spreadsheet for google. Used the npm google-spreadsheet-append-es5
//Documentation here: https://www.npmjs.com/package/google-spreadsheet-append-es5
var sheetInfo = serverInfo.googleSheetsInfo
var spreadsheet = eventSpread({
    auth: {
        email: sheetInfo.authEmail,
        keyFile: sheetInfo.keyFile
    },
    fileId: sheetInfo.sheetsFileID
});

/**
 * Event registration API endpoint
 *
 * Endpoint for redirecting users to the payment page for registration, checks to see if
 * there are enough spots availible first.
 *
 */
app.get("/getRegEvent", (req, res) =>{
    // Get number of spreadsheet rows synchronously
    const getVal = 0
    const returnSync = syncFunction(getVal)
    if ((returnSync.numRegisters-1) > serverInfo.maxRegisters){
        // Not enough space!
        res.send({dataLink:"#",canRegister:true})
    }else{
        // Have enough space, let person register!
        // Send link for client
        res.send({dataLink:"https://acmsec.mst.edu/node/registerEvents/paymentPages/",canRegister:true})
    }

});

/**
 * Registration page API endpoint.
 *
 * Endpoint for GETting data to autogenerate data for the user form for registration
 *
 */
app.get("/regCharge", (req, res) =>{
    res.send(JSON.stringify(clientInfo))
    console.log("Sent info!")
});

/**
 * Unsorted Object array key getter.
 *
 * Searches an unorganized object array for a key and returns the value
 *
 * @param {Object}  objArray    Object array to search.
 * @param {String}  key         Key value to search for.
 * @returns {Object} value      Value of desired key.
 */
function getKey(objArray,key){

    for(i in objArray){
        if (Object.keys(objArray[i])[0] === key){
            return Object.values(objArray[i])[0]
        }
    }

}

/**
 * POST registration page endpoint
 *
 * POST endpoint for registration page. Stripe payment token will be submitted here.
 * User registration will then be added to desired spreadsheet from config file and emails
 * will be sent to officer email and new recipient.
 *
 */
app.post('/regCharge', function(req, res) {

    // Set the charge amount on server side for security.
    let Chargeamount = serverInfo.chargePrice;

    // TODO Add coupon support
    // if (req.body.coupons === process.env.PROMO){
    //     Chargeamount = 2500; }

    //Parse incoming data from registration page
    userdata = req.body.data
    token = getKey(userdata,"token")
    email = getKey(userdata,"emails")
    eventname = getKey(userdata,"eventname")
    acm = getKey(userdata,"acm")
    attend = getKey(userdata,"attend")
    major = getKey(userdata,"major")

    //Create new Stripe charge with public/private keys
    var charge = stripe.charges.create({
        amount: Chargeamount,
        currency: "usd",
        source: token,
        description: serverInfo.title + " " + eventname,
        receipt_email:email
    }, function (err, charge){
        //If charge fails, log error and let user know.
        if(err){
            console.log(err);
            res.send(JSON.stringify({trxnSuccess:"Your card was declined!",success:false}));
        }else{
            // Charge succeeds! Log the registration in the google spreadsheet and email user/officer
            spreadsheet.add({
                timestamp: new Date(),
                name:eventname,
                email:email,
                major:major,
                attendbefore:attend,
                acmmember:acm
                },
                function(err, res){
                    console.log(err)
                });

            console.log("Payment was successful.");

            // Send the new user an email and let the officers know
            emailmod.sendRegEmail(eventname,email,serverInfo.title)

            // Let the user know that processing was successful
            res.send(JSON.stringify({trxnSuccess:"Your payment was successful!",success:true}));
        };
    });

});

// Setup port options for starting backend
const port = process.env.PORT || 3001; // Leave as 3001 for event registration, allowing processes to be taken down
app.listen(port,()=> console.log(`Listening on port ${port}!`));