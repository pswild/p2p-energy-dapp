'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContractFactory = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// A derivative work of Nick Dodson's eths-contract https://github.com/ethjs/ethjs-contract/blob/master/src/index.js

var isTransactionObject = function isTransactionObject(txObj) {
  var txObjectProperties = ['from', 'to', 'data', 'value', 'gasPrice', 'gas'];
  if ((typeof txObj === 'undefined' ? 'undefined' : (0, _typeof3.default)(txObj)) !== 'object') return false;
  // Return true for empty object
  if ((0, _keys2.default)(txObj).length === 0) return true;
  // Also return true if the object contains any of the expected txObject properties
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(txObjectProperties), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      if (prop in txObj) return true;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return false;
};

var getCallableMethodsFromABI = function getCallableMethodsFromABI(contractABI) {
  return contractABI.filter(function (json) {
    return (json.type === 'function' || json.type === 'event') && json.name.length > 0;
  });
};

var encodeMethodReadable = function encodeMethodReadable(methodObject, methodArgs) {
  var dataString = methodObject.name + '(';

  for (var i = 0; i < methodObject.inputs.length; i++) {
    var input = methodObject.inputs[i];
    var argString = input.type + ' ';

    if (input.type === 'string') {
      argString += '"' + methodArgs[i] + '"';
    } else if (input.type === ('bytes32' || 'bytes')) {
      // TODO don't assume hex input? or throw error if not hex
      // argString += `0x${new Buffer(methodArgs[i], 'hex')}`
      argString += '' + methodArgs[i];
    } else {
      argString += '' + methodArgs[i];
    }

    dataString += argString;

    if (methodObject.inputs.length - 1 !== i) {
      dataString += ', ';
    }
  }
  return dataString += ')';
};

var ContractFactory = function ContractFactory(extend) {
  return function (contractABI) {
    var output = {};
    output.at = function atContract(address) {

      function Contract() {
        var self = this;
        self.abi = contractABI || [];
        self.address = address || '0x';

        getCallableMethodsFromABI(contractABI).forEach(function (methodObject) {
          self[methodObject.name] = function contractMethod() {

            if (methodObject.constant === true) {
              throw new Error('A call does not return the txobject, no transaction necessary.');
            }

            if (methodObject.type === 'event') {
              throw new Error('An event does not return the txobject, events not supported');
            }

            var providedTxObject = {};
            var methodArgs = [].slice.call(arguments);
            var nArgs = methodObject.inputs.length;

            if (methodObject.type === 'function') {
              // Remove transaction object if provided
              if (isTransactionObject(methodArgs[nArgs])) {
                providedTxObject = methodArgs.splice(nArgs, 1)[0];
              }

              var methodTxObject = (0, _extends3.default)({}, providedTxObject, {
                to: self.address,
                function: encodeMethodReadable(methodObject, methodArgs)
              });

              if (!extend) return methodTxObject;

              var extendArgs = methodArgs.slice(nArgs);
              return extend.apply(undefined, [methodTxObject].concat((0, _toConsumableArray3.default)(extendArgs)));
            }
          };
        });
      }

      return new Contract();
    };

    return output;
  };
};

exports.ContractFactory = ContractFactory;