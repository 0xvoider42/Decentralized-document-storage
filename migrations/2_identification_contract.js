const DocMinter = artifacts.require('./Identification.sol');

module.exports = function(deployer) {
  deployer.deploy(DocMinter);
};
