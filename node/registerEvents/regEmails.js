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
});

// Send email reminder to officer managing merch emails and new registrations
const regEmail = "acmsecmerch@gmail.com";

module.exports = {
    /**
     * sendRegEmail
     *
     * Send a notification to the ACM officers that someone has submitted an
     * event registration form.
     *
     * @param {string}  customerName    Registrant's name.
     * @param {string}  email           Registrant's email.
     * @param {string}  totalCharge     Amount charged for registration.
     * @param {string}  eventName       Name of event.
     * @param {?string} discCode        Discount code used, if any.
     */

    sendRegEmail: function (customerName, email, totalCharge, eventName, discCode) {
        // Officer email body
        const regBodyOfficer = `
            <h2>ACM Security Team</h2>
            <hr>
            <p>
                ${customerName} has paid the registration fee for ${eventName}! <br>
                Customer's email address: ${email} <br>
                Total amount paid: $${totalCharge} <br>
                Discount code used: ${discCode || "None"}
            </p>
            <p>
                <a href="https://docs.google.com/spreadsheets/d/1UaY_AdPptlRSU_bWP5yVYJc8qwieY-EUPYtJhR8wIDQ/edit#gid=0">
                    View all registration payments
                </a>
            </p>
        `;

        // Send a no-reply email to remind the officer
        sendmail({
            from: 'no-reply@acmsec.mst.edu',
            to: regEmail,
            subject: `Received ${eventName} Registration Payment`,
            html: regBodyOfficer,
        }, function (err, reply) {
            if(err){
                console.log("Officer email was not sent successfully!")
            }
        });
    }
};
