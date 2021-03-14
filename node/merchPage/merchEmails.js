/**
 * Registration email functions file.
 *
 * Provides external functions to merchPage/index.js for sending emails on new registrations.
 *
 * @file   merchEmails.js
 * @author Charles Rawlins.
 */

// Required to send emails without smtp server
const sendmail = require('sendmail')({
    silent: false,
    smtpPort: 25, // Default: 25
    smtpHost: 'localhost'
})

// Send email reminder to officer managing merch emails and new registrations
const regEmail = "acmsecmerch@gmail.com"

module.exports = {

    /**
     * sendMerchEmail
     *
     * Sends a success email to a new registration user and a reminder email to
     * an ACM officer.
     *
     * @param {String}    username       Username for new registration user.
     * @param {String}    email          Email for the new registration user.
     * @param {String}    eventname      Name of current registration event to remind user.
     */

    sendMerchEmail: function (username,email,purchases,shirtSize){
        var numBundles = purchases[0]

        // TODO update with shirt sizes and spacing
        // User email body
        var merchBodyUser = '<h3>ACM Security Team</h3>' + '<hr> <par>'+username+', thank you for your purchase! ' +
            'Our officers have been notified and will contact you shortly!' +
            '</par>' +
            '<par>For your reference, here is what you purchased:' +
            '<ul>' +
            '<li># of bundles: '+numBundles+'</li>'+
            '<li>Shirt sizes: '+shirtSize+'</li>'+
            '</ul></par>'

        // Officer email body
        var merchBodyOfficer = '<h3>ACM Security Team</h3>' + '<hr> <par>' + username + ' has made a merch purchase, ' +
            'please check the google spreadsheet. ' +
            '</par>' +
            '<par>' +
            'Here is what they purchased:'+
            '<ul>' +
            '<li># of bundles: '+numBundles+'</li>'+
            '<li>Shirt sizes: '+shirtSize+'</li>'+
            '</ul>'+
            '</par>'

        // Send a no-reply email about the merch purchase to the customer
        sendmail({
            from: 'no-reply@acm.com',
            to: email,
            subject: 'ACM Security Merch Purchase',
            html: merchBodyUser,
        }, function(err, reply) {
            if(err){
                console.log("User email was not sent successfully!")
            }
        });

        // Send a no-reply email to remind the officer of the purchase
        sendmail({
            from: 'no-reply@acm.com',
            to: regEmail,
            subject: 'New Merch Purchase',
            html: merchBodyOfficer,
        }, function(err, reply) {
            if(err){
                console.log("Officer email was not sent successfully!")
            }
        });

    }

}