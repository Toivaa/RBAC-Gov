import Web3 from "web3";
import accessControl from "../../build/contracts/AccessControl.json";

const App = {
  web3: null,
  account: null,
  aC: null,

  start: async function() {
    const { web3 } = this;
    try {
      const networkId = 10;
      const deployedNetwork = accessControl.networks[networkId];
      this.aC = web3.eth.contract(
        accessControl.abi).at(deployedNetwork.address);
      web3.eth.defaultAccount = web3.eth.accounts[0];
      this.account = web3.eth.accounts[0];
      console.log(this.account);
    } catch (error) {
      console.log(error);
      console.error("Could not connect to contract or chain.");
    }
  },

  logIn: async function() {
    await this.aC.checkUserLevel.call(function (error, result){
        console.log(result);
        if (result.toString() == "Supervisor") {
          window.location.replace("/pageSupervisor.html");
        }
        else if (result.toString() == "Organization Master") {
          window.location.replace("/pageOrganizationMaster.html");
        }
        else if (result.toString() == "User") {
          window.location.replace("/pageUser.html");
        }
        else {
          window.alert("no access");
        }
    });
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use aCMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
  }

  App.start();
});
