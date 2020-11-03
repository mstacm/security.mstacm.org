/**
 * Registration checker.
 *
 * Provides external functions to registerEvents/index.js for finding the number of current registrations.
 *
 * @file   getRegisters.js
 * @author Charles Rawlins.
 */

// Change for different events
var eventFile = "./registerConfigs/lockpickexample.json5"

// Get required libraries
var Spreadsheet = require('edit-google-spreadsheet');
const fs = require('fs');
var json5 = require('json5');

// Parse event info
data = fs.readFileSync(eventFile);
var eventInfo= json5.parse(data)
var serverInfo = eventInfo.event.serverInfo;
var sheetInfo = serverInfo.googleSheetsInfo

/**
 * Object.size
 *
 * Finds the size of the given object by the number of key-value entries
 *
 * @param {Object}    obj           Object with unknown length
 */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 * Synchronous spreadsheet loading.
 *
 * Loads the event registration synchronously for quick verification of number of current registration users.
 *
 * @returns {int}   getVal  Number of rows in the spreadsheet-1 (number of current users.
 */
function asyncFunction() {
    return (getVal) => {
        Spreadsheet.load({
            debug: true,
            spreadsheetId: sheetInfo.sheetsFileID,
            worksheetName: 'Sheet1',
            oauth : {
                email: sheetInfo.authEmail,
                keyFile: sheetInfo.keyFile
            }

        }, function sheetReady(err, spreadsheet) {

            if (err) {
                throw err;
            }
            spreadsheet.receive(function(err, rows, info) {
                if (err) {
                    throw err;
                }
                getVal = Object.size(rows)
            });

        });

        return delay(2000).then(() => {
            return {
                numRegisters: getVal,
            }
        })
    }
}

// Simulate a async promise delay
function delay(t, v) {
    return new Promise((resolve) => {
        setTimeout(resolve.bind(null, v), t)
    })
}

// Export sync function for use in index.js
module.exports = asyncFunction