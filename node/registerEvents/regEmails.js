/**
 * Registration email functions file.
 *
 * Provides external functions to registerEvents/index.js for sending emails on new registrations.
 *
 * @file   regEmails.js
 * @author Charles Rawlins & Nate Kean.
 */

/**
 * @typedef  {Object} Order
 * @property {string} customerName
 * @property {string} email
 * @property {string} major
 * @property {string} year  Class in college
 * @property {"In-person" | "Online"} attendanceType
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
     * @param {Event}  event        Event information object.
     * @param {Order}  order        Order information object.
     * @param {string} totalCharge  Amount charged for registration.
     */

    sendRegEmail: function (event, order, totalCharge) {
        // Officer email body
        const regBodyOfficer = `
            <h2>ACM Security Team</h2>
            <hr>
            <p>
                Customer <u>${order.customerName}</u> just registered for ${event.title}! <br>
                <table style="border-collapse: collapse">
                    <thead style="text-align: left">
                        <tr style="padding: 3px 3px 3px 0.5rem">
                            <th>Details</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody style="border-top: 2px solid #897e6f; border-bottom: 2px solid #897e6f">
                        <tr style="padding: 3px 3px 3px 0.5rem">
                            <td>Attending</td>
                            <td>${order.attendanceType}</td>
                        </tr>
                        <tr style="padding: 3px 3px 3px 0.5rem">
                            <td>Email address</td>
                            <td>${order.email}</td>
                        </tr>
                        <tr style="padding: 3px 3px 3px 0.5rem">
                            <td>Major</td>
                            <td>${order.major}</td>
                        </tr>
                        <tr style="padding: 3px 3px 3px 0.5rem">
                            <td>Year</td>
                            <td>${order.year}</td>
                        </tr>
                        <tr style="padding: 3px 3px 3px 0.5rem">
                            <td>Total amount paid</td>
                            <td>$${totalCharge}</td>
                        </tr>
                    </tbody>
                </table>
            </p>
            <p>
                <a href="https://docs.google.com/spreadsheets/d/${event.spreadsheetID}/edit">
                    View all registrations
                </a>
            </p>
        `;

        // Send a no-reply email to remind the officer
        sendmail({
            from: 'no-reply@acmsec.mst.edu',
            to: regEmail,
            subject: `Received ${event.title} Registration`,
            html: regBodyOfficer,
        }, function (err, reply) {
            if (err) {
                console.error("Officer email was not sent successfully!");
            }
        });
    }
};
