/**
 * Main Nodejs API File.
 *
 * Contains api endpoints for the server, such as handling email lists and other functions.
 *
 * @file   index.js
 * @author Charles Rawlins.
 */

// Require API framework tools
const express = require('express')
var cors = require('cors') // Required to make API calls work well
const app = express();
app.use(express.json());
app.use(cors()) // Required for REST API with site

// Import custom functions
var emailTools = require('./emailFuncs')

/**
 * User email listing API endpoint.
 *
 * Sends emails informing users/officers that they will be added to proper email lists.
 *
 * @see  ./emailFuncs.js
 *
 */
app.post('/emaillists',(req, res) =>{

    var successState = true;
    var emailTypes = ["CDT","SEC"] // Update if email lists change

    // Check that email formatting is correct...
    if (!emailTools.validateEmail(req.body.userEmail)){
        successState = false;
    }

    // Check that email list type is within server capabilities...
    if(!emailTypes.includes(req.body.mailType)){
        successState = false;
    }

    // Assuming format and type is correct...
    if (successState){
        successState = emailTools.emailListEntry(req.body.userName,req.body.userEmail,req.body.mailType)
    }

    // Respond with success/error state
    res.send(JSON.stringify({emailSuccess:successState}));

});


/**
 * User registration/merch API endpoint.
 *
 * Process user payments for registration/merch and inform status of payments.
 *
 * @see  ./chargeFuncs.js
 *
 */

//This server uses GoogleAPI to push results to a spreadsheet. The tracer service account email
//will need to be shared with your desired spreadsheet. Here is the link to the dashboard:
//https://console.developers.google.com/iam-admin/serviceaccounts/project?project=astral-subject-166716

//require .dotenv to load the environmental variables
//Tutorial here: https://sendgrid.com/blog/node-environment-variables/
var dotenv = require('dotenv');
dotenv.load()

//Set stripe keys
console.log("server is starting.");
const keyPublishable = process.env.REAL_PUBLISH_KEY;
const keySecret = process.env.REAL_SECRET_KEY;

//libraries
const stripe = require("stripe")(keySecret);
const bodyParser = require('body-parser');
var Spreadsheet = require('google-spreadsheet-append-es5');

//Authentication to spreadsheet for google. Used the npm google-spreadsheet-append-es5
//Documentation here: https://www.npmjs.com/package/google-spreadsheet-append-es5
var spreadsheet = Spreadsheet({
    auth: {
        email: process.env.AUTH_EMAIL,
        keyFile: process.env.KEY_FILE
    },
    fileId: process.env.FEILD_ID
});

// For secondary registration
var spreadsheet2 = Spreadsheet({
    auth: {
        email: process.env.AUTH_EMAIL,
        keyFile: process.env.KEY_FILE
    },
    fileId: process.env.FEILD_ID2
});

//set app
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('website'));
app.set('website', __dirname + '/website');

app.get("/", (req, res) =>
    res.render("https://acmsigsec.mst.edu/merchpayment/website/index.html", {keyPublishable}));

//gets
app.get("./lockpick/", (req, res) =>
    res.render("https://acmsigsec.mst.edu/myapp/website/register2.html", {keyPublishable}));

//Post the charge from stripe Merch page
app.post('/charge', function(req, res) {

    //Checks to see if we are out of available rows in spreadsheet
    //Authentication to spreadsheet to count the rows in the google spreadsheet.
    //Used edit-google-spreadsheet. Documentation here: https://github.com/jpillora/node-edit-google-spreadsheet


    // TODO: Make compatible for merch page and two registration pages
    //Checks for right coupon code
    let Chargeamount = 3000;
    if (req.body.coupons === process.env.PROMO){
        Chargeamount = 2500; }

    //create stripe charge
    var token = req.body.stripeToken;
    console.log("token is: "+ JSON.stringify(req.body.stripeToken));
    var charge = stripe.charges.create({
        amount: Chargeamount,
        currency: "usd",
        description: "Wireless Workshop Fall 2019 - Member Purchase",
        metadata: {email: req.body.email,
            name: req.body.name
        },
        source: token,

    }, function (err, charge){
        //if charge fails
        if(err){
            console.log(err);
            console.log("your card was declined");
            res.redirect('https://acmsigsec.mst.edu/myapp/website/declined.html');
        }
        //If charge succeeds
        else{
            //post to google spreadsheet
            // append new row
            spreadsheet.add({
                    timestamp: new Date(),
                    name: "'" + req.body.name,
                    email: "'" + req.body.email,
                    major: "'" + req.body.major,
                    attendbefore: "'" + req.body.attend,
                    acm: "'" + req.body.acm},
                function(err, res){
                    console.log(err);
                });//end add
            console.log("Info added: " + req.body.name + " " + req.body.email);
            console.log("You were charged " + JSON.stringify(Chargeamount));
            console.log("your payment was successful.");
            res.redirect('https://acmsigsec.mst.edu/myapp/website/success.html');
        };//end else
    });//end function
});//end charge

//post the charge from stripe Lockpicking page page
app.post('/charge2', function(req, res) {

    //Checks to see if we are out of available rows in spreadsheet
    //Authentication to spreadsheet to count the rows in the google spreadsheet.
//Used edit-google-spreadsheet. Documentation here: https://github.com/jpillora/node-edit-google-spreadsheet

    //Checks for right coupon code
    let Chargeamount = 500;


    //create stripe charge
    var token = req.body.stripeToken;
    console.log("token is: "+ JSON.stringify(req.body.stripeToken));
    var charge2 = stripe.charges.create({
        amount: Chargeamount,
        currency: "usd",
        description: "Lockpicking Comp Fall 2018 - Member Purchase",
        metadata: {email: req.body.email,
            name: req.body.name
        },
        source: token,

    }, function (err, charge2){
        //if charge fails
        if(err){
            console.log(err);
            console.log("your card was declined");
            res.redirect('https://acmsigsec.mst.edu/myapp/website/declined.html');
        }
        //If charge succeeds
        else{
            //post to google spreadsheet
            // append new row
            spreadsheet2.add({
                    timestamp: new Date(),
                    name: "'" + req.body.name,
                    email: "'" + req.body.email,
                    major: "'" + req.body.major},
                function(err, res){
                    console.log(err);
                });//end add
            console.log("Info added: " + req.body.name + " " + req.body.email);
            console.log("You were charged " + JSON.stringify(Chargeamount));
            console.log("your payment was successful.");
            res.redirect('https://acmsigsec.mst.edu/myapp/website/success.html');
        };//end else
    });//end function
});//end charge

// Setup port options for starting backend
const port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`Listening on port ${port}!`));