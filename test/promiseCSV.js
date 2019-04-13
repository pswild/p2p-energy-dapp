var csv = require('fast-csv');
var Promise = require('bluebird');

// Parse CSV. Return promise.
var promiseCSV = Promise.method(function(path, options) {

  return new Promise(function(resolve, reject) {
    var records = [];

    csv
      .fromPath(path, options).on('data', function(record) {
        records.push(record);
      }).on('end', function() {
        resolve(records);
      });
  });
});

// Export module.
module.exports = promiseCSV;