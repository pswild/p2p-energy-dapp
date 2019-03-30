'use strict';

var _Credentials = require('./Credentials');

var _Credentials2 = _interopRequireDefault(_Credentials);

var _didJwt = require('did-jwt');

var _Contract = require('./Contract');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = { Credentials: _Credentials2.default, SimpleSigner: _didJwt.SimpleSigner, ContractFactory: _Contract.ContractFactory };