var csv = require('fast-csv');
var Promise = require('bluebird');

var promiseCSV = Promise.method(function(path, options) {
  return new Promise(function(resolve, reject) {
    var records = [];

    csv
      .fromPath(path, options).on('data', function(record) {
        records.push(record);
      }).on('end', function() {
        resolve(records);
      });
    };
  });

module.exports = promiseCSV;