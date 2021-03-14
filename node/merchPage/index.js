/**
 * Main ACM Merch file.
 *
 * Provides the backend support for merch purchases for ACM Security.
 * Config *.json5 files can be found in ./merchConfigs
 *
 * @file   index.js
 * @author Charles Rawlins.
 */

// Change to select new configuration file for the front/back end
var eventFile = "./merchConfigs/merchexample.json5"

const fs = require('fs');
var json5 = require('json5');
var bodyParser = require('body-parser')
const express = require('express')
// Required to make API calls work well
var cors = require('cors')
const forceSync = require('sync-rpc')
// Custom email functions for letting officers know about new registration
var emailmod = require('./merchEmails')
var eventSpread = require('google-spreadsheet-append-es5');

// Load config file and parse data for front and back end
data = fs.readFileSync(eventFile);

var merchInfo= json5.parse(data)
var serverInfo = merchInfo.merch.serverInfo;
const app = express();

// Setup stripe keys
const stripe = require("stripe")(serverInfo.stripesk);

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

function checkValid(valArray){

    for(var i = 0; i < valArray.length; i++){
        intVal = Math.trunc(valArray[i]) // Check for floating point numbers
        if (intVal < 0){ // Check for negatives
            return true
        }

    }
    return false

}

/**
* GET merch page endpoint
*
* GET endpoint for redirecting users to merch page. Will redirect to paymentPages/index.html
*/
app.get('/merchPayPage', (req, res) => {
    res.redirect('./paymentPages/index.html');
});

/**
 * POST merch page endpoint
 *
 * POST endpoint for merch page. Stripe payment token will be submitted here.
 * User registration will then be added to desired spreadsheet from config file and emails
 * will be sent to officer email and new recipient.
 */
app.post('/merchCharge', function(req, res) {

    // Set the charge amount on server side for security.
    let Chargeamounts = serverInfo.chargePrices;
    bundlePrice = Chargeamounts[0]

    //Parse incoming data from registration page
    userdata = req.body.data
    merchName = userdata.merchName
    email = userdata.email
    numBundles = userdata.numBundles
    shirtSize = userdata.shirtSize
    discCode = userdata.discCode
    token = userdata.token

    if(checkValid([numBundles])){
        res.send(JSON.stringify({trxnSuccess:"Invalid entry!",success:false}));
    }

    // All merch numbers are valid, proceed with purchase
    let totalCharge = bundlePrice * numBundles;

    if (discCode === serverInfo.discCode){
        totalCharge = (bundlePrice - serverInfo.discAmount) * numBundles;
    }

    //Create new Stripe charge with public/private keys
    var charge = stripe.charges.create({
        amount: totalCharge,
        currency: "usd",
        source: token,
        description: serverInfo.title,
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
                name:merchName,
                email:email,
                bundles:numBundles,
                shirtsize: shirtSize,
                fulfilled:'NO'
                },
                function(err, res){
                    console.log(err)
                });

            console.log("Payment was successful.");

            // Send the new user an email and let the officers know
            emailmod.sendMerchEmail(merchName,email,[numBundles],shirtSize)

            // Let the user know that processing was successful
            res.send(JSON.stringify({trxnSuccess:"Your payment was successful!",success:true}));
        };
    });

});

// Setup port options for starting backend
const port = process.env.PORT || 3002; // Leave as 3001 for event registration, allowing processes to be taken down
app.listen(port,()=> console.log(`Listening on port ${port}!`));