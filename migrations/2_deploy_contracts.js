const ConvertLib = artifacts.require("ConvertLib");
const AccessControl = artifacts.require("AccessControl");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, AccessControl);
  deployer.deploy(AccessControl);
};
