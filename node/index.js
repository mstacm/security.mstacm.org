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

/*
 *  Example code from online tutorial
 */

// app.get('/',(req,res) =>{
//     res.send('Hello World!!!');
// });
//
// app.get('/api/courses',(req,res)=>{
//     res.send([1,2,3]);
// });
//
// // /api/courses/1
// app.get('/api/courses/:id',((req, res) =>{
//     res.send(req.params.id);
// }));
//
// app.post('/api/courses',(req,res) =>{
//     const course = {
//         id:courses.length+1,
//         name:req.body.name,
//     };
//     courses.push(course);
//     res.send(course);
// });
// app.get('/emaillists',(req, res) =>{
//     console.log("Got get request");
//     // console.log(req.body.text())
//     res.send("Hello get!");
// });

/**
 * User email listing API endpoint.
 *
 * Sends emails informing users/officers that they will be added to proper email lists.
 *
 * @see  ./sendMailEntry.js
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

// Setup port options for starting backend
const port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`Listening on port ${port}!`));