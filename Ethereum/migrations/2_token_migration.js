var Token = artifacts.require("./Token.sol");

module.exports = function(deployer) {
  deployer.deploy(Token, 1000, "MyToken", "RM$", 8);
};
