const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require('dotenv').config();

module.exports = buildModule("fundManagerModule", (m) => {
  const fundManager = m.contract("FundManager");
  return { fundManager };
});
