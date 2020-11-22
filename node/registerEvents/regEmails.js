/**
 * Registration email functions file.
 *
 * Provides external functions to registerEvents/index.js for sending emails on new registrations.
 *
 * @file   regEmails.js
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
     * sendRegEmail
     *
     * Sends a success email to a new registration user and a reminder email to
     * an ACM officer.
     *
     * @param {String}    username       Username for new registration user.
     * @param {String}    email          Email for the new registration user.
     * @param {String}    eventname      Name of current registration event to remind user.
     */

    sendRegEmail: function (username,email,eventname){

        // User email body

        var regBodyUser = '<h3>ACM Security Team</h3>' + '<hr> <par>'+username+', thank you for registering for \''
            + eventname + '\'! Our officers have been notified of your registration. We look forward to seeing you!' +
            '</par>'

        // Officer email body
        var regBodyOfficer = '<h3>ACM Security Team</h3>' + '<hr> <par>' + username + ' has registered and paid for '+
            eventname+'.</par>'

        // Send a no-reply email to the new registration user

        sendmail({
            from: 'no-reply@acm.com',
            to: email,
            subject: 'ACM Security ' +eventname+ ' Registration',
            html: regBodyUser,
        }, function(err, reply) {
            if(err){
                console.log("User email was not sent successfully!")
            }
        });

        // Send a no-reply email to remind the officer

        sendmail({
            from: 'no-reply@acm.com',
            to: regEmail,
            subject: eventname + ' New Registration',
            html: regBodyOfficer,
        }, function(err, reply) {
            if(err){
                console.log("Officer email was not sent successfully!")
            }
        });

    }

}