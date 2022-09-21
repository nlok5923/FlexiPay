const Framework = require("@superfluid-finance/sdk-core");
const ethers = require("ethers");
require('dotenv').config();

// Ethers.js provider initialization
const url = process.env.QUICK_NODE_URL;
const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
module.exports = { customHttpProvider }
