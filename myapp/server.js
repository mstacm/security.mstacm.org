//Install this to update the javascript so you don't have to re-run the console
//npm install nodemon -g

//This server uses GoogleAPI to push results to a spreadsheet. The tracer service account email
//will need to be shared with your desired spreadsheet. Here is the link to the dashboard:
//https://console.developers.google.com/iam-admin/serviceaccounts/project?project=astral-subject-166716

//require .dotenv to load the environmental variables
//Tutorial here: https://sendgrid.com/blog/node-environment-variables/
var dotenv = require('dotenv');
dotenv.load()

//set stripe keys
console.log("server is starting.");
const keyPublishable = process.env.TEST_PUBLISH_KEY;
const keySecret = process.env.TEST_SECRET_KEY;
const testPub = "pk_test_6mBUzKTw5gUD99Nf3EwID98W";
const testSec = "sk_test_9ZGlktvPFLh1mq4KTxcwDSBV";

//libraries
const express = require('express');
const app = express();
const stripe = require("stripe")(testSec);
const bodyParser = require('body-parser');
var Spreadsheet = require('google-spreadsheet-append-es5');
//var RowsCheck = require('edit-google-spreadsheet');

//Authentication to spreadsheet for google. Used the npm google-spreadsheet-append-es5
//Documentation here: https://www.npmjs.com/package/google-spreadsheet-append-es5
var spreadsheet = Spreadsheet({
	auth: {
		email: process.env.AUTH_EMAIL,
		keyFile: process.env.KEY_FILE
	},
	fileId: process.env.FEILD_ID
});

var spreadsheet2 = Spreadsheet({
	auth: {
		email: process.env.AUTH_EMAIL,
		keyFile: process.env.KEY_FILE
	},
	fileId: "1HnHfvkYYdlcDBCKyq9SV32WkKkeo_BvgPWCxpo-Tolg" //process.env.FEILD_ID2
});

//set app
app.set('website', __dirname + '/website');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('website'));

//gets
app.get("/wifi", (req, res) =>
  res.render("https://acmsigsec.mst.edu/myapp/website/index.html", {testPub}));

//gets
app.get("/cybercamp", (req, res) =>
  res.render("https://acmsigsec.mst.edu/myapp/website/register2.html", {testPub}));

//post the charge from stripe Wireless Workshop page
app.post('/charge', function(req, res) {

  //Checks to see if we are out of available rows in spreadsheet
  //Authentication to spreadsheet to count the rows in the google spreadsheet.
//Used edit-google-spreadsheet. Documentation here: https://github.com/jpillora/node-edit-google-spreadsheet

  //Checks for right coupon code
  let Chargeamount = 3500;
  if (req.body.coupons === process.env.PROMO){
    Chargeamount = 3000;
  }

  //create stripe charge
  var token = req.body.stripeToken;
  console.log("token is: "+ JSON.stringify(req.body.stripeToken));
  var charge = stripe.charges.create({
    amount: Chargeamount,
    currency: "usd",
    description: "Wireless Workshop Fall 2017 - Member Purchase",
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
          attendedbefore: "'" + req.body.attend,
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


//post the charge from stripe Wireless Workshop page
app.post('/charge2', function(req, res) {

  //Checks to see if we are out of available rows in spreadsheet
  //Authentication to spreadsheet to count the rows in the google spreadsheet.
//Used edit-google-spreadsheet. Documentation here: https://github.com/jpillora/node-edit-google-spreadsheet

  //Checks for right coupon code
  let Chargeamount = 3500;
  if (req.body.coupons === process.env.PROMO2){
    Chargeamount = 3000;
  }

  //create stripe charge
  var token = req.body.stripeToken;
  console.log("token is: "+ JSON.stringify(req.body.stripeToken));
  var charge = stripe.charges.create({
    amount: Chargeamount,
    currency: "usd",
    description: "Cyber Boot Camp Spring 2018 - Member Purchase",
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
        spreadsheet2.add({
          timestamp: new Date(), 
          name: "'" + req.body.name, 
          email: "'" + req.body.email,
          major: "'" + req.body.major,
          attendedbefore: "'" + req.body.attend,
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
  

app.listen(3000, function(){
  console.log("listening on port 3000");
});