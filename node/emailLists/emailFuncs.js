/**
 * Sever Email Functions.
 *
 * Contains functions for sending emails on the server and updating email lists.
 *
 * @file   emailFuncs.js
 * @author Charles Rawlins.
 */

// Required to send emails without smtp server
const sendmail = require('sendmail')({
    silent: false,
    smtpPort: 25, // Default: 25
    smtpHost: 'localhost'
})

// Officer/General emails to add new users to the email lists.
cdtOfficerEmail = 'gzlfyb@mst.edu';
ssOfficerEmail = 'gzlfyb@mst.edu';

// Export modules for use in index.js
module.exports = {

    /**
     * emailListEntry.
     *
     * Sends a success email to a new email subscription recipient and a reminder email to
     * an ACM officer to add the new user to the proper emailing list.
     *
     * @param {String}    name           Username for new email recipient.
     * @param {String}    email          Email to use for new email recipient.
     * @param {String}    type           Type of email subscription for recipient.
     */

    emailListEntry: function (name,email,type){
        var emailSuccess = true;

        if (type == "CDT"){

            var cdtBody = '<h3>ACM Security Team</h3>' + '<hr> <par>Thank you for signing up for the ' +
                'CDT Email List! One of our officers will add your email address to the mailing list ' +
                'shortly. <br> Good luck and never stop learning!</par>'

            sendmail({
                from: 'no-reply@acm.com',
                to: email,
                subject: 'CDT Email Subscription',
                html: cdtBody,
            }, function(err, reply) {
                emailSuccess = false
            });

            sendmail({
                from: 'no-reply@acm.com',
                to: cdtOfficerEmail,
                subject: 'New CDT Email Subscription',
                html: '<h3>ACM Security</h3>' +
                    '<hr>' +
                    '<par>' + name + ' would like to join the CDT email list, their email is: ' + email + '</par>',
            }, function(err, reply) {
                emailSuccess = false
            });

        } else if (type == "SEC"){

            var secBody = '<h3>ACM Security Team</h3>' + '<hr> <par>Thank you for signing up for the ' +
                'General Security Email List! One of our officers will add your email to the mailing list ' +
                'shortly. Good luck and never stop learning!</par>'

            sendmail({
                from: 'no-reply@acm.com',
                to: email,
                subject: 'SEC Email Subscription',
                html: secBody,
            }, function(err, reply) {
                emailSuccess = false
            });

            sendmail({
                from: 'no-reply@acm.com',
                to: ssOfficerEmail,
                subject: 'New SS Email Subscription',
                html: name + ' would like to join the SS email list, their email is: ' + email,
            }, function(err, reply) {
                emailSuccess = false
            });

        }

        return emailSuccess
    },

    /**
     * validateEmail.
     *
     * Checks formatting for a given email address. Taken form stackoverflow:
     * https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
     *
     * @param {String}    email           Email string to check.
     */

    validateEmail: function(email){
        const re = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        return re.test(String(email).toLowerCase());
    }

}