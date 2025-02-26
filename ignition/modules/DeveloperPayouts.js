const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

module.exports = buildModule("developerModule", (m) => {
  const developerPayouts = m.contract("DeveloperPayouts", [
    process.env.FUND_MANAGER_ADDRESS,
    process.env.VALIDATOR_ADDRESS
    ]);
   return { developerPayouts };
  });
