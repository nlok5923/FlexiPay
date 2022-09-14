const hre = require("hardhat");

async function main() {
  const FlexiPayContract = await hre.ethers.getContractFactory("FlexiPay");
  const FlexiPayContractDeployed = await FlexiPayContract.deploy();
  await FlexiPayContractDeployed.deployed();
  console.log(
    `Sample contract deployed to ${FlexiPayContractDeployed.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
