'use strict';

var _Contract = require('../Contract');

var buildRequestURI = function buildRequestURI(txObject) {
  return 'me.uport:' + txObject.to + '?function=' + txObject.function;
};
var Contract = (0, _Contract.ContractFactory)(buildRequestURI);

var address = '0x41566e3a081f5032bdcad470adb797635ddfe1f0';
var abiToken = [{
  "constant": true,
  "inputs": [],
  "name": "name",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_spender",
    "type": "address"
  }, {
    "name": "_value",
    "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{
    "name": "success",
    "type": "bool"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_from",
    "type": "address"
  }, {
    "name": "_to",
    "type": "address"
  }, {
    "name": "_value",
    "type": "uint256"
  }],
  "name": "transferFrom",
  "outputs": [{
    "name": "success",
    "type": "bool"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "name": "",
    "type": "uint8"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "version",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "_owner",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "name": "balance",
    "type": "uint256"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_to",
    "type": "address"
  }, {
    "name": "_value",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
    "name": "success",
    "type": "bool"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_spender",
    "type": "address"
  }, {
    "name": "_value",
    "type": "uint256"
  }, {
    "name": "_extraData",
    "type": "bytes"
  }],
  "name": "approveAndCall",
  "outputs": [{
    "name": "success",
    "type": "bool"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "_owner",
    "type": "address"
  }, {
    "name": "_spender",
    "type": "address"
  }],
  "name": "allowance",
  "outputs": [{
    "name": "remaining",
    "type": "uint256"
  }],
  "payable": false,
  "type": "function"
}, {
  "inputs": [{
    "name": "_initialAmount",
    "type": "uint256"
  }, {
    "name": "_tokenName",
    "type": "string"
  }, {
    "name": "_decimalUnits",
    "type": "uint8"
  }, {
    "name": "_tokenSymbol",
    "type": "string"
  }],
  "type": "constructor"
}, {
  "payable": false,
  "type": "fallback"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "_from",
    "type": "address"
  }, {
    "indexed": true,
    "name": "_to",
    "type": "address"
  }, {
    "indexed": false,
    "name": "_value",
    "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "_owner",
    "type": "address"
  }, {
    "indexed": true,
    "name": "_spender",
    "type": "address"
  }, {
    "indexed": false,
    "name": "_value",
    "type": "uint256"
  }],
  "name": "Approval",
  "type": "event"
}];

describe('Contract', function () {

  var tokenContract = void 0;

  beforeAll(function () {
    tokenContract = Contract(abiToken).at(address);
  });

  it('initializes given a contractABI and address', function () {
    expect(tokenContract).toEqual(jasmine.any(Object));
  });

  it('returns a function given a contractABI', function () {
    expect(Contract(abiToken)).toEqual(jasmine.any(Object));
  });

  it('returns a contract object with the given contract functions available', function () {
    expect(tokenContract.transferFrom).toBeDefined();
    expect(tokenContract.transfer).toBeDefined();
    expect(tokenContract.approveAndCall).toBeDefined();
  });

  it('returns a contract object with the given contract event names available', function () {
    expect(tokenContract.Transfer).toBeDefined();
    expect(tokenContract.Approval).toBeDefined();
  });

  it('returns a contract object with the given contract constant names available', function () {
    expect(tokenContract.totalSupply).toBeDefined();
    expect(tokenContract.balanceOf).toBeDefined();
  });

  it('throws an error if an event is called', function () {
    expect(tokenContract.Transfer).toThrowError(Error);
  });

  it('throws an error if a constant is called', function () {
    expect(tokenContract.totalSupply).toThrowError(Error);
  });

  it('returns a well formed uri on contract function calls', function () {
    var uri = tokenContract.transfer('0x41566e3a081f5032bdcad470adb797635ddfe1f0', 10);
    expect(uri).toEqual("me.uport:0x41566e3a081f5032bdcad470adb797635ddfe1f0?function=transfer(address 0x41566e3a081f5032bdcad470adb797635ddfe1f0, uint256 10)");
  });
});

describe('ContractFactory', function () {

  describe('By default', function () {
    var txObject = void 0;

    beforeAll(function () {
      var tokenContract = (0, _Contract.ContractFactory)()(abiToken).at(address);
      txObject = tokenContract.transfer('0x41566e3a081f5032bdcad470adb797635ddfe1f0', 10);
    });

    it('returns a well formed txObject on contract function calls', function () {
      expect(txObject.function).toBeDefined();
      expect(txObject.to).toEqual(address);
    });

    it('returns a txObject with a human readable function and params', function () {
      expect(txObject.function).toEqual('transfer(address 0x41566e3a081f5032bdcad470adb797635ddfe1f0, uint256 10)');
    });
  });

  describe('With an extend function', function () {
    it('allows the Contract object functions to be extended if given a function', function () {
      var extend = function extend(txObject) {
        return 'hello';
      };
      var Contract = (0, _Contract.ContractFactory)(extend);
      var tokenContract = Contract(abiToken).at(address);
      // expect(tokenContract.transfer('0x41566e3a081f5032bdcad470adb797635ddfe1f0', 10)).toEqual('hello')
    });

    it('passes additional args on Contract object function calls to the extend function', function () {
      var str = 'ether';
      var extend = function extend(txObject, str) {
        return str;
      };
      var Contract = (0, _Contract.ContractFactory)(extend);
      var tokenContract = Contract(abiToken).at(address);
      expect(tokenContract.transfer('0x41566e3a081f5032bdcad470adb797635ddfe1f0', 10, str)).toEqual(str);
    });

    it('passes additional args beyond a transaction object to the extend function', function () {
      var extend = function extend(txObj, id, sendOpts) {
        return { txObj: txObj, id: id, sendOpts: sendOpts };
      };
      var Contract = (0, _Contract.ContractFactory)(extend);
      var tokenContract = Contract(abiToken).at(address);

      var txObj = { gas: '10000000' };
      var id = 'WOOP';
      var sendOpts = { woop: 'woop' };

      var result = tokenContract.transfer('0xdeadbeef', 10, txObj, id, sendOpts);

      expect(result.txObj).toMatchObject(txObj);
      expect(result.id).toEqual(id);
      expect(result.sendOpts).toEqual(sendOpts);
    });
  });
});