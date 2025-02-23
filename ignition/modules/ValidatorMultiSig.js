const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

module.exports = buildModule("validatorModule", (m) => {
  const validatorMultiSig = m.contract("ValidatorMultiSig", {
    arg1: process.env.FUND_MANAGER_ADDRESS, // Replace with the actual address if needed
    arg2: process.env.VALIDATORS,
    dependencies: [
      require("../../artifacts/@openzeppelin/contracts/utils/ReentrancyGuard.sol/ReentrancyGuard.json")
    ]  
   });

  return { validatorMultiSig };
});
