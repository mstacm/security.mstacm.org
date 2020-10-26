
// SET REGISTRATION EVENT PARAMETERS FROM JSON FILE HERE
var eventFile = "./registerConfigs/lockpickexample.json"


// Require API framework tools
const express = require('express')
var cors = require('cors') // Required to make API calls work well
const app = express();
const fs = require('fs');
app.use(express.json());
app.use(cors()) // Required for REST API with site

//This server uses GoogleAPI to push results to a spreadsheet. The tracer service account email
//will need to be shared with your desired spreadsheet. Here is the link to the dashboard:
//https://console.developers.google.com/iam-admin/serviceaccounts/project?project=astral-subject-166716

//Set stripe keys
const keyPublishable = process.env.REAL_PUBLISH_KEY;
const keySecret = process.env.REAL_SECRET_KEY;

//libraries
const stripe = require("stripe")(keySecret);
const bodyParser = require('body-parser');
var Spreadsheet = require('google-spreadsheet-append-es5');

//require .dotenv to load the environmental variables
//Tutorial here: https://sendgrid.com/blog/node-environment-variables/
var dotenv = require('dotenv');
dotenv.config();

//Authentication to spreadsheet for google. Used the npm google-spreadsheet-append-es5
//Documentation here: https://www.npmjs.com/package/google-spreadsheet-append-es5
var spreadsheet = Spreadsheet({
    auth: {
        email: process.env.AUTH_EMAIL,
        keyFile: process.env.KEY_FILE
    },
    fileId: process.env.FEILD_ID
});

// TEST!
spreadsheet.add({timestamp: new Date(), email: "a@a.com"}, function(err, res){});

// For secondary registration
// var spreadsheet2 = Spreadsheet({
//     auth: {
//         email: process.env.AUTH_EMAIL,
//         keyFile: process.env.KEY_FILE
//     },
//     fileId: process.env.FEILD_ID2
// });

//set app
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// app.use(express.static('website'));
// app.set('website', __dirname + '/website');

app.get("/getregevent", (req, res) =>
    res.render("https://acmsigsec.mst.edu/node/registerEvents/paymentPages/index.html", {keyPublishable}));
//
// //gets
// app.get("./lockpick/", (req, res) =>
//     res.render("https://acmsigsec.mst.edu/myapp/website/register2.html", {keyPublishable}));
//

app.get("/regCharge", (req, res) =>{
    // TODO Pass form info for autogeneration from json files
    let eventInfo = JSON.parse(fs.readFileSync(eventFile))
    // let serverInfo = eventInfo.event.serverinfo;
    res.send(JSON.stringify(eventInfo.event.clientInfo))
    console.log("Sent info!")
});


//Post the charge from stripe Merch page
app.post('/regCharge', function(req, res) {

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
//
// //post the charge from stripe Lockpicking page page
// app.post('/charge2', function(req, res) {
//
//     //Checks to see if we are out of available rows in spreadsheet
//     //Authentication to spreadsheet to count the rows in the google spreadsheet.
// //Used edit-google-spreadsheet. Documentation here: https://github.com/jpillora/node-edit-google-spreadsheet
//
//     //Checks for right coupon code
//     let Chargeamount = 500;
//
//
//     //create stripe charge
//     var token = req.body.stripeToken;
//     console.log("token is: "+ JSON.stringify(req.body.stripeToken));
//     var charge2 = stripe.charges.create({
//         amount: Chargeamount,
//         currency: "usd",
//         description: "Lockpicking Comp Fall 2018 - Member Purchase",
//         metadata: {email: req.body.email,
//             name: req.body.name
//         },
//         source: token,
//
//     }, function (err, charge2){
//         //if charge fails
//         if(err){
//             console.log(err);
//             console.log("your card was declined");
//             res.redirect('https://acmsigsec.mst.edu/myapp/website/declined.html');
//         }
//         //If charge succeeds
//         else{
//             //post to google spreadsheet
//             // append new row
//             spreadsheet2.add({
//                     timestamp: new Date(),
//                     name: "'" + req.body.name,
//                     email: "'" + req.body.email,
//                     major: "'" + req.body.major},
//                 function(err, res){
//                     console.log(err);
//                 });//end add
//             console.log("Info added: " + req.body.name + " " + req.body.email);
//             console.log("You were charged " + JSON.stringify(Chargeamount));
//             console.log("your payment was successful.");
//             res.redirect('https://acmsigsec.mst.edu/myapp/website/success.html');
//         };//end else
//     });//end function
// });//end charge

// Setup port options for starting backend
const port = process.env.PORT || 3001; // Leave as 3001 for event registration, allowing partitions to be taken down
app.listen(port,()=> console.log(`Listening on port ${port}!`));