import Web3 from "web3";
import accessControl from "../../build/contracts/AccessControl.json";

const App = {
  web3: null,
  account: null,
  meta: null,

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
        if (result == "User") {
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


  Connect: async function() {
    var organization = document.getElementById("organizationWhereConnecting").value;

    await this.aC.getUrl.call(organization, function (error, result){
      console.log(result);
      if (result.toString() == "") {
        window.alert("No such organization");
      }
      else {
        window.location.replace(result.toString());
      }
    });
  },


};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    window.alert("No web3 detected");
  }

  App.start();
});
