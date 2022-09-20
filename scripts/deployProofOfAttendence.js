const hre = require("hardhat");

async function main() {
  const POAContract = await hre.ethers.getContractFactory("ProofOfAttendence");
  const POAContractDeployed = await POAContract.deploy();
  await POAContractDeployed.deployed();
  console.log(
    `Sample contract deployed to ${POAContractDeployed.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
