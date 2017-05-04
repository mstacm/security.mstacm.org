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

//set app
app.set('website', __dirname + '/website');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('website'));

//gets
app.get("/", (req, res) =>
  res.render("/index.html", {keyPublishable}));

app.post('https://acmsigsec.mst.edu/myapp/server', function(req, res) {
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
    res.redirect('/success.html');
});
app.listen(3000);
// const server = app.listen(3000, listening);
// function listening(){
//     console.log("listening....");
// }