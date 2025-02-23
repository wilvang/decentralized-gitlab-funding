const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require('dotenv').config();
const { artifacts } = require("hardhat");

module.exports = buildModule("gitlabFundingModule", (m) => {
  const fundManager = m.contract("FundManager");
  const validatorMultiSig = m.contract("ValidatorMultiSig", {
    arg1: fundManager.address,
    arg2: process.env.VALIDATORS,
  });
  const developerPayouts = m.contract("DeveloperPayouts", {
    arg1: fundManager.address,
    arg2: validatorMultiSig.address,
  });

  return { fundManager, validatorMultiSig, developerPayouts };
});
