const fs = require('fs');
var json5 = require('json5');
var bodyParser = require('body-parser')
const express = require('express')
var cors = require('cors') // Required to make API calls work well

const forceSync = require('sync-rpc')
var emailmod = require('./regEmails')


// SET REGISTRATION EVENT PARAMETERS FROM HJSON FILE HERE
var eventFile = "./registerConfigs/lockpickexample.json5"
data = fs.readFileSync(eventFile);
var eventInfo= json5.parse(data)
var clientInfo = eventInfo.event.clientInfo;
var serverInfo = eventInfo.event.serverInfo;
const app = express();
const syncFunction = forceSync(require.resolve('./getRegisters'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()) // Required for REST API with site

//libraries
const stripe = require("stripe")(serverInfo.stripesk);
var eventSpread = require('google-spreadsheet-append-es5');

//require .dotenv to load the environmental variables
//Tutorial here: https://sendgrid.com/blog/node-environment-variables/

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

app.get("/regCharge", (req, res) =>{
    res.send(JSON.stringify(clientInfo))
    console.log("Sent info!")
});

function getKey(objArray,key){

    for(i in objArray){
        if (Object.keys(objArray[i])[0] === key){
            return Object.values(objArray[i])[0]
        }
    }

}

//Post the charge from stripe Merch page
app.post('/regCharge', function(req, res) {

    //Checks for right coupon code
    let Chargeamount = serverInfo.chargePrice;

    // TODO Add coupon support
    // if (req.body.coupons === process.env.PROMO){
    //     Chargeamount = 2500; }

    //Create stripe charge
    userdata = req.body.data
    token = getKey(userdata,"token")
    email = getKey(userdata,"emails")
    eventname = getKey(userdata,"eventname")
    acm = getKey(userdata,"acm")
    attend = getKey(userdata,"attend")
    major = getKey(userdata,"major")

    var charge = stripe.charges.create({
        amount: Chargeamount,
        currency: "usd",
        source: token,
        description: serverInfo.title + " " + eventname,
        receipt_email:email
    }, function (err, charge){
        //If charge fails
        if(err){
            console.log(err);
            res.send(JSON.stringify({trxnSuccess:"Your card was declined!",success:false}));
        }else{
            // append new row
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

            res.send(JSON.stringify({trxnSuccess:"Your payment was successful!",success:true}));
        };
    });

});

// Setup port options for starting backend
const port = process.env.PORT || 3001; // Leave as 3001 for event registration, allowing partitions to be taken down
app.listen(port,()=> console.log(`Listening on port ${port}!`));