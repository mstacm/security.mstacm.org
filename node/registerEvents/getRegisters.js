
var Spreadsheet = require('edit-google-spreadsheet');
const fs = require('fs');
var json5 = require('json5');



var eventFile = "./registerConfigs/lockpickexample.json5"
data = fs.readFileSync(eventFile);
var eventInfo= json5.parse(data)
var serverInfo = eventInfo.event.serverInfo;
var sheetInfo = serverInfo.googleSheetsInfo

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

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

// Email for informing of new registration
cdtOfficerEmail = 'gzlfyb@mst.edu';



module.exports = asyncFunction