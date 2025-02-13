import { ethers } from "hardhat";

async function main() {

  const crowdFund = await ethers.deployContract("Crowdfunding");

  await crowdFund.waitForDeployment();

  console.log(
    `crowdFundContract contract successfully deployed to: ${crowdFund.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});