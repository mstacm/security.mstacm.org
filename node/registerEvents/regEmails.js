/**
 * Registration email functions file.
 *
 * Provides external functions to registerEvents/index.js for sending emails on new registrations.
 *
 * @file   regEmails.js
 * @author Charles Rawlins & Nate Kean.
 */

/**
 * @typedef  {Object} OrderInfo
 * @property {string} customerName
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} major
 * @property {string} year              Class in college
 * @property {"In-person" | "Online"} attendanceType
 * @property {?string} discCode          Discount code
 * @property {string} transactionToken  Unique Stripe payment token
 */

// Required to send emails without smtp server
const sendmail = require('sendmail')({
    silent: false,
    smtpPort: 25, // Default: 25
    smtpHost: 'localhost'
});
const config = require("./private/config");

// Send email reminder to officer managing merch emails and new registrations
const regEmail = "acmsecmerch@gmail.com";

module.exports = {
    /**
     * sendRegEmail
     *
     * Send a notification to the ACM officers that someone has submitted an
     * event registration form.
     *
     * @param {OrderInfo}  order        Event information object.
     * @param {string}     totalCharge  Amount charged for registration.
     * @param {string}     eventName    Name of event.
     */

    sendRegEmail: function (order, totalCharge, eventName) {
        // Officer email body
        const regBodyOfficer = `
            <h2>ACM Security Team</h2>
            <hr>
            <p>
                Customer <u>${order.customerName}</u> just registered for ${eventName}! <br>
                Customer's email address: ${order.email} <br>
                Customer's phone number: ${order.phoneNumber} <br>
                Total amount paid: $${totalCharge} <br>
                Discount code used: ${order.discCode || "None"}
            </p>
            <p>
                <a href="https://docs.google.com/spreadsheets/d/${config.googleSheetsInfo.spreadsheetID}/edit">
                    View all registrations
                </a>
            </p>
        `;

        // Send a no-reply email to remind the officer
        sendmail({
            from: 'no-reply@acmsec.mst.edu',
            to: regEmail,
            subject: `Received ${eventName} Registration`,
            html: regBodyOfficer,
        }, function (err, reply) {
            if (err) {
                console.error("Officer email was not sent successfully!");
            }
        });
    }
};
