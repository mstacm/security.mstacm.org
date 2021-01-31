// Client for providing content for learning, event, contact and archive pages, runs separate from other processes
/**
 * Website content provider
 *
 * Provides the backend support generating content for the learning, event, contact, and archive pages.
 * This script runs on its own process to allow for content to be generated while other processes can be taken down.
 *
 * @file   index.js
 * @author Charles Rawlins.
 */

const fs = require('fs');
var json5 = require('json5');
var bodyParser = require('body-parser')
const express = require('express')
// Required to make API calls work well
var cors = require('cors')
const app = express();

// Setup configs for the server app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()) // Required for REST API with site

// Load resources for all pages
var learningRsc = json5.parse(fs.readFileSync('./content/learningResources.json5'));
var mstCourses = json5.parse(fs.readFileSync('./content/secClasses.json5'));
var acmOfficers = json5.parse(fs.readFileSync('./content/officerProfiles.json5'));

currOfficers = acmOfficers.shift();
officerHistory = acmOfficers; // Remove current officers

// Learning page resources (mst courses and learning links)
app.get("/learningGen", (req, res) =>{
    pageContent = {'learningResources':learningRsc,'mstCourses':mstCourses};
    res.send(pageContent)
    console.log("Sent learning data!")
});

//TODO Event info (current/archive)
// app.get("/eventGen", (req, res) =>{
//     pageContent = {'learningResources':learningRsc,'mstCourses':mstcourses};
//     res.send(pageContent)
//     console.log("Sent learning data!")
// });

// Current officer data for contact page
app.get("/currentOfficers", (req, res) =>{
    // Get most recent officers for contact page
    pageContent = {'currOfficers':currOfficers};
    res.send(pageContent)
    console.log("Sent current officer data!")
});

// Officer history for archive page
app.get("/officerHistory", (req, res) =>{
    //Get all past officers, not current ones for archive page
    pageContent = {'officerHistory':officerHistory};
    res.send(pageContent)
    console.log("Sent officer history data!")
});

const port = process.env.PORT || 3003; // Leave as 3003 for misc content gen, allowing for portions of site to be
                                        // enabled/disabled
app.listen(port,()=> console.log(`Listening on port ${port}!`));