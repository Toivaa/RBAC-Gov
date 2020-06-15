import Web3 from "web3";
import accessControl from "../../build/contracts/AccessControl.json";

const App = {
  web3: null,
  account: null,
  aC: null,
  accessControl: null,

  start: async function() {
    const { web3 } = this;
    try {
      const networkId = 10;
      const deployedNetwork = accessControl.networks[networkId];
      this.aC = web3.eth.contract(
        accessControl.abi).at(deployedNetwork.address);
      web3.eth.defaultAccount = web3.eth.accounts[0];
      this.account = web3.eth.accounts[0];
      await this.aC.checkUserLevel.call(function (error, result){
          if (result == "supervisor") {
            var div1 = document.getElementById("no");
            var div2 = document.getElementById("yes");
            div1.style.visibility = 'hidden';
            div2.style.visibility = 'visible';
          }
          else {
            var div1 = document.getElementById("no");
            var div2 = document.getElementById("yes");
            div1.style.visibility = 'visible';
            div2.style.visibility = 'hidden';
          }
      });
    } catch (error) {
      console.log(error);
      console.error("Could not connect to contract or chain.");
    }
  },

  modifyUser: async function() {
    var address = document.getElementById("address").value;
    var userLevel = document.getElementById("userLevel").value;
    var role = document.getElementById("role").value;
    var organization = document.getElementById("organizationForUser").value;

    await this.aC.modifyUser.sendTransaction(address, userLevel, role, organization, {gasPrice: 0, gas: 100000}, function (error, result){
    });
  },

  deleteUser: async function() {
    var address = document.getElementById("address").value;

    await this.aC.removeUser.sendTransaction(address, {gasPrice: 0}, function (error, result){
    });
  },

  addUser: async function() {
    var address = document.getElementById("address").value;
    var userLevel = document.getElementById("userLevel").value;
    var role = document.getElementById("role").value;
    var organization = document.getElementById("organizationForUser").value;

    await this.aC.addUser.sendTransaction(address, userLevel, role, organization, {gasPrice: 0}, function (error, result){
    });
  },

  checkUser: async function() {
    var user = document.getElementById("check").value;

    await this.aC.checkUser.call(user, function (error, result){
        console.log(result);
        document.getElementById("userCheckedRole").innerHTML = "exists:" + result[0].toString() + ", user level: " +
        result[1].toString() + ", role: " + result[2].toString() + ",  organization: " + result[3];
    });
  },

  addOrganization: async function() {
    var organization = document.getElementById("organizationName").value;
    var url = document.getElementById("urlForAdd").value;

    await this.aC.addOrganization.sendTransaction(organization, url, {gasPrice: 0}, function (error, result){
    });
  },

  removeOrganization: async function() {
    var organization = document.getElementById("organizationName").value;

    await this.aC.removeOrganization.sendTransaction(organization, {gasPrice: 0}, function (error, result){
    });
  },

  changeUrl: async function() {
    var organization = document.getElementById("organizationForUrlChange").value;
    var url = document.getElementById("urlChange").value;

    await this.aC.changeUrlOrganization.sendTransaction(organization, url, {gasPrice: 0}, function (error, result){

    });
  },

  checkOrganization: async function() {
    var organization = document.getElementById("organizationForCheck").value;

    await this.aC.checkOrganization.call(organization, function (error, result){
        document.getElementById("checkedOrganizationUrl").innerHTML ="Exists: " +
        result[0].toString() + ", url: " + result[1].toString();
    });
  },

  checkAccessRight: async function() {
    var organizationForCheck = document.getElementById("organizationForCheckARCheck").value
    var organizationForAR = document.getElementById("organizationForAccessRight").value;
    var role = document.getElementById("roleForCheck").value;

    await this.aC.checkAccessRightOfRoleSupervisors.call(organizationForCheck, organizationForAR, role, function (error, result){
        document.getElementById("accessRightStatus").innerHTML = result;
    });
  },

  checkQueryDetails: async function() {
    var address = document.getElementById("contractAddress").value
    var contract = web3.eth.contract(
      abi_Query).at(address);

      await contract.checkQueryDetails.call(function (error, result){
        document.getElementById("queryInformation").innerHTML ="Organization: " +
         result[0] + ", User: " + result[1] + ", Query: " + result[2];
      });
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use aCMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    window.alert("No web3 detected");
  }

  App.start();
});

const abi_Query = [
    {
        "constant": true,
        "inputs": [],
        "name": "checkQueryDetails",
        "outputs": [
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_organization",
                "type": "string"
            },
            {
                "name": "_query",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
]

const bytecode = {
    "linkReferences": {},
    "object": "608060405234801561001057600080fd5b506040516106cb3803806106cb8339810180604052604081101561003357600080fd5b81019080805164010000000081111561004b57600080fd5b8281019050602081018481111561006157600080fd5b815185600182028301116401000000008211171561007e57600080fd5b5050929190602001805164010000000081111561009a57600080fd5b828101905060208101848111156100b057600080fd5b81518560018202830111640100000000821117156100cd57600080fd5b505092919050505080600090805190602001906100eb9291906102bb565b5033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600190805190602001906101439291906102bb565b506001600360007386d1baf7c16dba6178aed253af669e4421d6133f73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555060016003600073fdb5ec36d7245581e094e1053dd91e72a336072973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001819055506001600360007346579a23307005b9e1e61d42064f93ba5c2f568373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000181905550600160036000737b90d9854fc1d06448cb9ee899a2d2d5790a235f73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001819055505050610360565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106102fc57805160ff191683800117855561032a565b8280016001018555821561032a579182015b8281111561032957825182559160200191906001019061030e565b5b509050610337919061033b565b5090565b61035d91905b80821115610359576000816000905550600101610341565b5090565b90565b61035c8061036f6000396000f3fe608060405234801561001057600080fd5b5060043610610048576000357c0100000000000000000000000000000000000000000000000000000000900480638ab97ea61461004d575b600080fd5b61005561016f565b60405180806020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001838103835286818151815260200191508051906020019080838360005b838110156100cb5780820151818401526020810190506100b0565b50505050905090810190601f1680156100f85780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b83811015610131578082015181840152602081019050610116565b50505050905090810190601f16801561015e5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b6060600060606001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001541415156101c657600080fd5b6001600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102825780601f1061025757610100808354040283529160200191610282565b820191906000526020600020905b81548152906001019060200180831161026557829003601f168201915b50505050509250808054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561031e5780601f106102f35761010080835404028352916020019161031e565b820191906000526020600020905b81548152906001019060200180831161030157829003601f168201915b5050505050905092509250925090919256fea165627a7a723058203edc253540311381131bfb0679eb14216ca95ceb802bb54294e0647fdc80c07e0029",
    "opcodes": "PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD PUSH2 0x6CB CODESIZE SUB DUP1 PUSH2 0x6CB DUP4 CODECOPY DUP2 ADD DUP1 PUSH1 0x40 MSTORE PUSH1 0x40 DUP2 LT ISZERO PUSH2 0x33 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 MLOAD PUSH5 0x100000000 DUP2 GT ISZERO PUSH2 0x4B JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP3 DUP2 ADD SWAP1 POP PUSH1 0x20 DUP2 ADD DUP5 DUP2 GT ISZERO PUSH2 0x61 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 MLOAD DUP6 PUSH1 0x1 DUP3 MUL DUP4 ADD GT PUSH5 0x100000000 DUP3 GT OR ISZERO PUSH2 0x7E JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP POP SWAP3 SWAP2 SWAP1 PUSH1 0x20 ADD DUP1 MLOAD PUSH5 0x100000000 DUP2 GT ISZERO PUSH2 0x9A JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP3 DUP2 ADD SWAP1 POP PUSH1 0x20 DUP2 ADD DUP5 DUP2 GT ISZERO PUSH2 0xB0 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 MLOAD DUP6 PUSH1 0x1 DUP3 MUL DUP4 ADD GT PUSH5 0x100000000 DUP3 GT OR ISZERO PUSH2 0xCD JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP POP SWAP3 SWAP2 SWAP1 POP POP POP DUP1 PUSH1 0x0 SWAP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 PUSH2 0xEB SWAP3 SWAP2 SWAP1 PUSH2 0x2BB JUMP JUMPDEST POP CALLER PUSH1 0x2 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP DUP2 PUSH1 0x1 SWAP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 PUSH2 0x143 SWAP3 SWAP2 SWAP1 PUSH2 0x2BB JUMP JUMPDEST POP PUSH1 0x1 PUSH1 0x3 PUSH1 0x0 PUSH20 0x86D1BAF7C16DBA6178AED253AF669E4421D6133F PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 ADD DUP2 SWAP1 SSTORE POP PUSH1 0x1 PUSH1 0x3 PUSH1 0x0 PUSH20 0xFDB5EC36D7245581E094E1053DD91E72A3360729 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 ADD DUP2 SWAP1 SSTORE POP PUSH1 0x1 PUSH1 0x3 PUSH1 0x0 PUSH20 0x46579A23307005B9E1E61D42064F93BA5C2F5683 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 ADD DUP2 SWAP1 SSTORE POP PUSH1 0x1 PUSH1 0x3 PUSH1 0x0 PUSH20 0x7B90D9854FC1D06448CB9EE899A2D2D5790A235F PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 ADD DUP2 SWAP1 SSTORE POP POP POP PUSH2 0x360 JUMP JUMPDEST DUP3 DUP1 SLOAD PUSH1 0x1 DUP2 PUSH1 0x1 AND ISZERO PUSH2 0x100 MUL SUB AND PUSH1 0x2 SWAP1 DIV SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 SWAP1 PUSH1 0x1F ADD PUSH1 0x20 SWAP1 DIV DUP2 ADD SWAP3 DUP3 PUSH1 0x1F LT PUSH2 0x2FC JUMPI DUP1 MLOAD PUSH1 0xFF NOT AND DUP4 DUP1 ADD OR DUP6 SSTORE PUSH2 0x32A JUMP JUMPDEST DUP3 DUP1 ADD PUSH1 0x1 ADD DUP6 SSTORE DUP3 ISZERO PUSH2 0x32A JUMPI SWAP2 DUP3 ADD JUMPDEST DUP3 DUP2 GT ISZERO PUSH2 0x329 JUMPI DUP3 MLOAD DUP3 SSTORE SWAP2 PUSH1 0x20 ADD SWAP2 SWAP1 PUSH1 0x1 ADD SWAP1 PUSH2 0x30E JUMP JUMPDEST JUMPDEST POP SWAP1 POP PUSH2 0x337 SWAP2 SWAP1 PUSH2 0x33B JUMP JUMPDEST POP SWAP1 JUMP JUMPDEST PUSH2 0x35D SWAP2 SWAP1 JUMPDEST DUP1 DUP3 GT ISZERO PUSH2 0x359 JUMPI PUSH1 0x0 DUP2 PUSH1 0x0 SWAP1 SSTORE POP PUSH1 0x1 ADD PUSH2 0x341 JUMP JUMPDEST POP SWAP1 JUMP JUMPDEST SWAP1 JUMP JUMPDEST PUSH2 0x35C DUP1 PUSH2 0x36F PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH2 0x48 JUMPI PUSH1 0x0 CALLDATALOAD PUSH29 0x100000000000000000000000000000000000000000000000000000000 SWAP1 DIV DUP1 PUSH4 0x8AB97EA6 EQ PUSH2 0x4D JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH2 0x55 PUSH2 0x16F JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP1 PUSH1 0x20 ADD DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH1 0x20 ADD DUP4 DUP2 SUB DUP4 MSTORE DUP7 DUP2 DUP2 MLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 DUP1 DUP4 DUP4 PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0xCB JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0xB0 JUMP JUMPDEST POP POP POP POP SWAP1 POP SWAP1 DUP2 ADD SWAP1 PUSH1 0x1F AND DUP1 ISZERO PUSH2 0xF8 JUMPI DUP1 DUP3 SUB DUP1 MLOAD PUSH1 0x1 DUP4 PUSH1 0x20 SUB PUSH2 0x100 EXP SUB NOT AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP JUMPDEST POP DUP4 DUP2 SUB DUP3 MSTORE DUP5 DUP2 DUP2 MLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 DUP1 DUP4 DUP4 PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x131 JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x116 JUMP JUMPDEST POP POP POP POP SWAP1 POP SWAP1 DUP2 ADD SWAP1 PUSH1 0x1F AND DUP1 ISZERO PUSH2 0x15E JUMPI DUP1 DUP3 SUB DUP1 MLOAD PUSH1 0x1 DUP4 PUSH1 0x20 SUB PUSH2 0x100 EXP SUB NOT AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP JUMPDEST POP SWAP6 POP POP POP POP POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH1 0x60 PUSH1 0x0 PUSH1 0x60 PUSH1 0x1 PUSH1 0x3 PUSH1 0x0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 ADD SLOAD EQ ISZERO ISZERO PUSH2 0x1C6 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x1 PUSH1 0x2 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 DUP3 DUP1 SLOAD PUSH1 0x1 DUP2 PUSH1 0x1 AND ISZERO PUSH2 0x100 MUL SUB AND PUSH1 0x2 SWAP1 DIV DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP1 SLOAD PUSH1 0x1 DUP2 PUSH1 0x1 AND ISZERO PUSH2 0x100 MUL SUB AND PUSH1 0x2 SWAP1 DIV DUP1 ISZERO PUSH2 0x282 JUMPI DUP1 PUSH1 0x1F LT PUSH2 0x257 JUMPI PUSH2 0x100 DUP1 DUP4 SLOAD DIV MUL DUP4 MSTORE SWAP2 PUSH1 0x20 ADD SWAP2 PUSH2 0x282 JUMP JUMPDEST DUP3 ADD SWAP2 SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 SWAP1 JUMPDEST DUP2 SLOAD DUP2 MSTORE SWAP1 PUSH1 0x1 ADD SWAP1 PUSH1 0x20 ADD DUP1 DUP4 GT PUSH2 0x265 JUMPI DUP3 SWAP1 SUB PUSH1 0x1F AND DUP3 ADD SWAP2 JUMPDEST POP POP POP POP POP SWAP3 POP DUP1 DUP1 SLOAD PUSH1 0x1 DUP2 PUSH1 0x1 AND ISZERO PUSH2 0x100 MUL SUB AND PUSH1 0x2 SWAP1 DIV DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP1 SLOAD PUSH1 0x1 DUP2 PUSH1 0x1 AND ISZERO PUSH2 0x100 MUL SUB AND PUSH1 0x2 SWAP1 DIV DUP1 ISZERO PUSH2 0x31E JUMPI DUP1 PUSH1 0x1F LT PUSH2 0x2F3 JUMPI PUSH2 0x100 DUP1 DUP4 SLOAD DIV MUL DUP4 MSTORE SWAP2 PUSH1 0x20 ADD SWAP2 PUSH2 0x31E JUMP JUMPDEST DUP3 ADD SWAP2 SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 SWAP1 JUMPDEST DUP2 SLOAD DUP2 MSTORE SWAP1 PUSH1 0x1 ADD SWAP1 PUSH1 0x20 ADD DUP1 DUP4 GT PUSH2 0x301 JUMPI DUP3 SWAP1 SUB PUSH1 0x1F AND DUP3 ADD SWAP2 JUMPDEST POP POP POP POP POP SWAP1 POP SWAP3 POP SWAP3 POP SWAP3 POP SWAP1 SWAP2 SWAP3 JUMP INVALID LOG1 PUSH6 0x627A7A723058 KECCAK256 RETURNDATACOPY 0xdc 0x25 CALLDATALOAD BLOCKHASH BALANCE SGT DUP2 SGT SHL 0xfb MOD PUSH26 0xEB14216CA95CEB802BB54294E0647FDC80C07E00290000000000 ",
    "sourceMap": "158:1339:0:-;;;416:528;8:9:-1;5:2;;;30:1;27;20:12;5:2;416:528:0;;;;;;;;;;;;;;;13:2:-1;8:3;5:11;2:2;;;29:1;26;19:12;2:2;416:528:0;;;;;;19:11:-1;14:3;11:20;8:2;;;44:1;41;34:12;8:2;71:11;66:3;62:21;55:28;;123:4;118:3;114:14;159:9;141:16;138:31;135:2;;;182:1;179;172:12;135:2;219:3;213:10;330:9;325:1;311:12;307:20;289:16;285:43;282:58;261:11;247:12;244:29;233:115;230:2;;;361:1;358;351:12;230:2;0:372;;416:528:0;;;;;;;19:11:-1;14:3;11:20;8:2;;;44:1;41;34:12;8:2;71:11;66:3;62:21;55:28;;123:4;118:3;114:14;159:9;141:16;138:31;135:2;;;182:1;179;172:12;135:2;219:3;213:10;330:9;325:1;311:12;307:20;289:16;285:43;282:58;261:11;247:12;244:29;233:115;230:2;;;361:1;358;351:12;230:2;0:372;;416:528:0;;;;;;505:6;497:5;:14;;;;;;;;;;;;:::i;:::-;;539:10;522:14;;:27;;;;;;;;;;;;;;;;;;575:13;560:12;:28;;;;;;;;;;;;:::i;:::-;;695:1;627:11;:55;639:42;627:55;;;;;;;;;;;;;;;:65;;:69;;;;775:1;707:11;:55;719:42;707:55;;;;;;;;;;;;;;;:65;;:69;;;;855:1;787:11;:55;799:42;787:55;;;;;;;;;;;;;;;:65;;:69;;;;935:1;867:11;:55;879:42;867:55;;;;;;;;;;;;;;;:65;;:69;;;;416:528;;158:1339;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;"
}
