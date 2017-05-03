<?php
 require_once('./stripe-php-1.17.1/lib/Stripe.php');
$stripe = array(
  "secret_key"      => "sk_test_BQokikJOvBiI2HlWgH4olfQ2",
  "publishable_key" => "pk_test_6pRNASCoBOKtIshFeQd4XMUh"
);
Stripe::setApiKey($stripe['secret_key']);
  
  var_dump($_POST);
  $state = $_POST['shippingState'];
  
  if ( !strcmp("GA", $state) ) {
    // the shipping address is in Georgia, so go ahead
    
    $token  = $_POST['stripeToken'];
    $email  = $_POST['emailAddress'];
    echo "$token and $email";
    $customer = Stripe_Customer::create(array(
        'email' => $email,
        'card'  => $token
    ));
    $charge = Stripe_Charge::create(array(
        'customer' => $customer->id,
        'amount'   => 1500,
        'currency' => 'usd',
        'description' => 'Widget, Qty 1'
    ));
    echo '<h1>Successfully charged $15.00!</h1>';
  } else {
    echo "Sorry, we can only ship to addresses in GA.";
    echo "Hit the back button and try again with 'GA' in the state field.";
  }
?>



<!--//Install this to update the javascript so you don't have to re-run the console
//npm install nodemon -g

console.log("server is starting.");
const keyPublishable = "pk_test_6pRNASCoBOKtIshFeQd4XMUh";
const keySecret = "sk_test_BQokikJOvBiI2HlWgH4olfQ2";

//libraries
const express = require('express');
const app = express();
const stripe = require("stripe")(keySecret);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//link to static folder webpage
app.use(express.static('/myapp/website'));

app.get("/", (req, res) =>
  res.render("https://acmsigsec.mst.edu/myapp/website/index2.html", {keyPublishable}));

app.get('/success', function(req, res){
    res.render('https://acmsigsec.mst.edu/myapp/website/success.html',{
    });

app.get('/success', function(req, res){
    res.render('success.html',{
    });
});

app.post('/charge', function(req, res) {
    var token = req.body.stripeToken;
    var real_amount = 1000;


    charge = stripe.charges.create({
        amount: real_amount,
        currency: 'usd',
        description: 'charge for submission',
        token: token,
    },
    function(err, charge) {
        if (err) {
            res.send(500, err);
        } else {
            res.send(204);
        }
    });
    console.log("your payment passed");
    console.log("your amount was"+JSON.stringify(real_amount));
    res.redirect('/success');
});


// const server = app.listen(3000, listening);
// function listening(){
//     console.log("listening....");
// }-->