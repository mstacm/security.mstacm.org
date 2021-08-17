/**
 * Registration email functions file.
 *
 * Provides external functions to merchPage/index.js for sending emails on new
 * registrations.
 *
 * @file   merchEmails.js
 * @author Charles Rawlins.
 */

 const config = require("./merchConfigs/config");

 // Required to send emails without smtp server
 const sendmail = require('sendmail')({
     silent: false,
     smtpPort: 25, // Default: 25
     smtpHost: config.smtpHost,
 });
 
 // Send email reminder to officer managing merch emails and new registrations
 const regEmail = "acmsecmerch@gmail.com";
 
 module.exports = {
 
     /**
      * sendMerchEmail
      *
      * Send a success email to the ACM officers that a new purchase has been
      * made.
      *
      * @param {string} username  Customer's name.
      * @param {number} numBundles Number of merch bundles the customer purchased.
      * @param {string} shirtSize Shirt size.
      */
 
     sendMerchEmail: function (username, numBundles, shirtSize) {
         // Officer email body
         const merchBodyOfficer = `<h3>ACM Security Team</h3>
             <hr>
             <p>
                 ${username} has made a merch purchase! Please check the Google Spreadsheet: <a href="https://docs.google.com/spreadsheets/d/1b6y8t9aTqSK60bHThASNjyPMj1fMc6c87pYXl3WnosU/edit#gid=0">https://docs.google.com/spreadsheets/d/1b6y8t9aTqSK60bHThASNjyPMj1fMc6c87pYXl3WnosU/edit#gid=0</a>.
             </p>
             <p>
                 Here is what they purchased:
                 <ul>
                     <li>Merch bundle</li>
                     <li>Shirt size: ${shirtSize}</li>
                 </ul>
             </p>`;
 
         // Send a no-reply email to remind the officer of the purchase
         sendmail({
             from: 'no-reply@acm.com',
             to: regEmail,
             subject: 'New Merch Purchase',
             html: merchBodyOfficer,
         }, function (err, reply) {
             if (err)  {
                 console.error("Officer email was not sent successfully!", err);
             }
         });
     },
 };
