//Install this to update the javascript so you don't have to re-run the console
//npm install nodemon -g

console.log("server is starting.");
const keyPublishable = "pk_test_6pRNASCoBOKtIshFeQd4XMUh";
const keySecret = "sk_test_BQokikJOvBiI2HlWgH4olfQ2";

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
		email: "tracer@astral-subject-166716.iam.gserviceaccount.com",
		keyFile: "key-final.pem"
	},
	fileId: '1h05kF6CiH_UBITneLEsItsc1jbyf7zDGnpMSE9jSgRk'
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

  //create stripe charge
  let Chargeamount = 500;
  var token = req.body.stripeToken;
  var charge = stripe.charges.create({
    amount: Chargeamount,
    currency: "usd",
    source: token,

  }, function (err, charge){
    if(err){
        console.log("your card was declined");
    }
  });
  console.log("your payment was successful.");
    res.redirect('https://acmsigsec.mst.edu/myapp/website/success.html');
});
app.listen(3000);