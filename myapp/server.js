//Install this to update the javascript so you don't have to re-run the console
//npm install nodemon -g

//require .dotenv to load the environmental variables
//Tutorial here: https://sendgrid.com/blog/node-environment-variables/
var dotenv = require('dotenv');
dotenv.load()

//set stripe keys
console.log("server is starting.");
const keyPublishable = process.env.TEST_PUBLISH_KEY;
const keySecret = process.env.TEST_SECRET_KEY;

//libraries
const express = require('express');
const app = express();
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

//set app
app.set('website', __dirname + '/website');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('website'));

//gets
app.get("/", (req, res) =>
  res.render("https://acmsigsec.mst.edu/myapp/website/index.html", {keyPublishable}));

//post the charge from stripe TracerFire page
app.post('/charge', function(req, res) {

  //post to google spreadsheet
  // append new row
spreadsheet.add({
  timestamp: new Date(), 
  name: req.body.name, 
  email: req.body.email}, 
  function(err, res){
    console.log(err);
  });
  console.log("Info added: " + req.body.name + " " + req.body.email);

  //Checks for right coupon code
  let Chargeamount = 500;
  if (req.body.coupons === "ACM" || req.body.coupons === "acm" || req.body.coupons === "Acm"){
    Chargeamount = 1000;
  }

  //create stripe charge
  var token = req.body.stripeToken;
  var charge = stripe.charges.create({
    amount: Chargeamount,
    currency: "usd",
    source: token,

  }, function (err, charge){
    //if charge fails
    if(err){
        console.log("your card was declined");
        res.redirect('https://acmsigsec.mst.edu/myapp/website/declined.html');
    }
    //If charge succeeds
    if (charge){
      console.log("You were charged " + JSON.stringify(Chargeamount));
      console.log("your payment was successful.");
      res.redirect('https://acmsigsec.mst.edu/myapp/website/success.html');
    }
  });
});
app.listen(3000);