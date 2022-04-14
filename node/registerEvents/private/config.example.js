/**
 * @typedef {Object} MaxRegistrants
 * Set either value to null to allow no registrations of that type.
 * Set either value to "Infinity" to allow unlimited registrations of that type.
 * @property {?number} inPerson
 * @property {?number} online
 */

/**
 * @typedef {Object} Cost
 * Set either value to 0 to make that attendee type free.
 * Set a value to null when its max registrants is 0.
 * @property {?number} inPerson
 * @property {?number} online
 */

/**
 * @typedef {Object} Event
 * @property {string} title - Human-readable name of the event
 * @property {MaxRegistrants} maxRegistrants - Maximum number of registrants allowed per attendance type
 * @property {Cost} cost - Cost of the event per attendance type
 * @property {Object.<string, number>} discountCodes - Listing of valid discount codes for this event
 * @property {string} spreadsheetID - ID of Google Sheet to log registrations to
 */

/**
 * @typedef {Object} Config
 * @property {string} stripeSK - stripe secret key
 * @property {string} stripePK - stripe public key
 * @property {Object.<string, Event>} events - listing of events with active registration
 * @property {string} googleSheetsKeyFilename - path to Google Sheets API key file
 * @property {string} smtpHost - lol idk i just make it localhost and the email sender works
 */

/**
 * @type {Config}
 */
 module.exports = {
    // Production Stripe keys -- only these will work on real credit cards
    stripeSK: "STRIPE LIVE SECRET KEY HERE",
    stripePK: "STRIPE LIVE PUBLIC KEY HERE",

    // Development Stripe keys -- these can't charge money
    // stripeSK: "STRIPE TEST SECRET KEY HERE",
    // stripePK: "STRIPE TEST PUBLIC KEY HERE",

    events: {
        "example-event": {
            title: "Example Event 2022",
            maxRegistrants: {
                inPerson: 30,
                online: 10,
            },
            cost: {
                inPerson: 15,
                online: 0,
            },
            discountCodes: {
                "ILOVEWPA2": 2  // Two dollars off
            },
            spreadsheetID: "GOOGLE SPREADSHEET ID HERE: like https://docs.google.com/spreadsheets/d/[this part of the link to a sheet]",
        },
    },

    googleSheetsKeyFilename: "private/GOOGLE BOT TOKEN FILE HERE.json",
    smtpHost: "localhost",
};
