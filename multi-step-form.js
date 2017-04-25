/*------------Validation Function-----------------*/
var count = 0; // To count blank fields.
function validation(event) {
var input_field = document.getElementsByClassName('text_field'); // Fetching all inputs with same class name text_field and an html tag textarea.
var text_area = document.getElementsByTagName('textarea');

// For loop to count blank inputs.
for (var i = input_field.length; i > count; i--) {
	if (input_field[i - 1].value == '' || text_area.value == '') {
		count = count + 1;
	} else {
		count = 0;
	}
}
if (count != 0 || y == 0) {
	alert("*All Fields are mandatory*"); // Notifying validation
	event.preventDefault();
} else {
	return true;
}
}

/*---------------------------------------------------------*/
// Function that executes on click of first next button.
/*function next_step1() {
	document.getElementById("first1").style.display = "none";
	document.getElementById("second1").style.display = "block";
	document.getElementById("active2").style.color = "#a4c34a";
}*/

//create array for name and email
let name_email_array = [];
let e = "";
let n = "";
let name = document.getElementById("name").value;
let email = document.getElementById("email").value;


//insert values into array from user input
function insertValues(){
	name_email_array.push(name);
	name_email_array.push(email);
}

//function append row to spreadsheet
function appendARow() {
  var SPREADSHEET_URL = 'https://drive.google.com/open?id=1fILSIKkMZMK-n2BHLQTgnNaQYaHP2to84vIwlFw9zU4';
  // Name of the specific sheet in the spreadsheet.
  var SHEET_NAME = 'Sheet1';

  var ss = SpreadsheetApp.getActiveSheet().getValues();
  var sheet = ss.getSheetByName("Sheet1");

  // Appends a new row with 2 columns to the bottom of the
  // spreadsheet containing the values in the array.
  sheet.appendRow(name_email_array);
}
/*---------------------------------
functions to handle Stripe payments
-----------------------------------*/

// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:
var token = request.body.stripeToken; // Using Express
var amount = "";

// Charge the user's card:
var charge = stripe.charges.create({
  amount: amount,
  currency: "usd",
  description: "sign up charge",
  source: token,
}, function(err, charge) {
  // asynchronously called
},
)

stripe.coupons.create({
  amount_off: 500,
  duration: 'forever',
  id: 'ACM'
}, function(err, coupon) {
  // asynchronously called
})

stripe.coupons.retrieve(
  "ACM",
  function(err, coupon) {
    // asynchronously called
  }
);


/*---------------------------------
functions to handle data pushed to Google spreadsheet
-----------------------------------*/
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
 
// spreadsheet key is the long id in the sheets URL 
var doc = new GoogleSpreadsheet('1gQ-1MlOeSUH4OiIC-SSIPCICU_yK1rw5erHHHSVk_sc');
var sheet;

