var debug = require('debug')('spreadsheet');
var googleAuth = require('google-oauth-jwt');
var js2xmlparser = require("js2xmlparser");
var request = require('request');

// token cache
var tokens = {};

function Spreadsheet (options) {
  if (!(this instanceof Spreadsheet)) {
    return new Spreadsheet(options);
  }
  
  if (!options.auth || !options.auth.email) throw new Error("auth.email is required");
  if (!(options.auth.keyFile || options.auth.key)) throw new Error("auth.keyFile or auth.key are required");
  
  this.auth = options.auth;
    
  if (!options.fileId) throw new Error("fileId is required");
  this.fileId = options.fileId;
  
  this.sheetId = options.sheetId || "od6";
}

Spreadsheet.prototype.login = function(options, cb) {
  options = options || {};
  if (!options.email) throw new Error('auth.email is required');
  if (!(options.keyFile || options.key)) throw new Error("private key (auth.key or auth.keyFile) required");
  if (!Array.isArray(options.scopes)) {
    options.scopes = [
      'https://spreadsheets.google.com/feeds/',
      'https://docs.google.com/feeds/'
    ];
  }
  googleAuth.authenticate(options, cb);
}

Spreadsheet.prototype.add = function(row, cb) {
  // create entry xml for row
  var data = {
    "@": {
      "xmlns": "http://www.w3.org/2005/Atom",
      "xmlns:gsx": "http://schemas.google.com/spreadsheets/2006/extended"
    }
  };
  
  // add row col/val
  Object.keys(row).forEach(function(key) {
    data["gsx:"+key] = row[key];
  });
  
  // create xml, we don't need declaration
  var xml = js2xmlparser("entry", data, {
    declaration: {
      include: false
    }
  });

  var url = "https://spreadsheets.google.com/feeds/list/" + this.fileId + "/" + this.sheetId + "/private/full?alt=json";
  
  function doIt(err, token){
    post(url, {
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/atom+xml",
      },
      body: xml
    }, cb);
  }

  // get token
  var token;
  if (this.auth.email in tokens) {
    doIt(tokens[this.auth.email]);
  } else {
    this.login(this.auth, doIt);
  }
}


function post (url, options, fn) {
  debug('POST', url, options);
  request.post(url, options, function (err, res, body) {
    if (err) {
      fn(err);
    } else if (res.statusCode < 200 || res.statusCode >= 300) {
      debug('POST error', url, options, err, res.statusCode, body);
      fn(new Error(body));
    } else {
      fn();
    };
  });
}

module.exports = Spreadsheet;
