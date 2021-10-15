const config = require("./private/config");
const googleSheets = require("@googleapis/sheets");

const auth = new googleSheets.auth.GoogleAuth({
    keyFilename: config.googleSheetsKeyFilename,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheetsClientPromise = auth.getClient().then( (authClient) => {
    return googleSheets.sheets({
        version: "v4",
        auth: authClient,
    });
});


/**
 * Get the value of a single cell in a sheet.
 * 
 * @param {string} spreadsheetID
 * @param {string} coordinate A1 notation location of the cell
 * @returns {Promise<any>} The value of the cell
 */
async function getValue(spreadsheetID, coordinate) {
    const sheets = await sheetsClientPromise;
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetID,
        range: coordinate,
    });
    return response.data.values[0][0];
}


/**
 * Generate a sheet containing formulas that this server will use the values of.
 * (So we can make Google calculate them for us!)
 * 
 * @param {string} spreadsheetID
 * @returns {Promise<void>}
 */
async function createMetadata(spreadsheetID) {
    const sheets = await sheetsClientPromise;

    // Create new sheet tab called "Metadata"
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetID,
        resource: { requests: [{
            addSheet: {
                properties: {
                    title: "Metadata",
                },
            },
        }]},
    });

    // Create the metadata table
    await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetID,
        range: "Metadata!A1:B3",
        valueInputOption: "USER_ENTERED",
        resource: {
            majorDimension: "ROWS",
            values: [
                ["Attendance type", "Number of registrations"],
                ["In-person",'=COUNTIF(Registrations!B2:B, "In-person")'],
                ["Online", '=COUNTIF(Registrations!B2:B, "Online")'],
            ],
        },
    })
}


module.exports = {
    inPersonRegistrations: async function(spreadsheetID) {
        let registrations;
        try {
            registrations = await getValue(spreadsheetID, "Metadata!B2");
        } catch (err) {
            await createMetadata(spreadsheetID);
            registrations = await getValue(spreadsheetID, "Metadata!B2");
        }
        return parseInt(registrations);
    },

    onlineRegistrations: async function(spreadsheetID) {
        let registrations;
        try {
            registrations = await getValue(spreadsheetID, "Metadata!B3");
        } catch (err) {
            await createMetadata(spreadsheetID);
            registrations = await getValue(spreadsheetID, "Metadata!B3");
        }
        return parseInt(registrations);
    },

    addRegistration: async function(spreadsheetID, values) {
        const sheets = await sheetsClientPromise;
        return sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetID,
            range: "Registrations!A1",
            valueInputOption: "RAW",
            requestBody: {
                majorDimension: "ROWS",
                values: [values],
            }
        });
    },
};
