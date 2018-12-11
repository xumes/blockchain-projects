var EthereumFinchainCourse = artifacts.require("./EthereumFinchainCourse.sol");

module.exports = function (deployer) {
    deployer.deploy(EthereumFinchainCourse, "Ethereum Finchain Course", "ETHFC", 8, 10000);
};