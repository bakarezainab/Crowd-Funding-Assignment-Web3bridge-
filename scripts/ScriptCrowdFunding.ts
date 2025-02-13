import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xa329C808C5BF255ce023e48b9FD31189Ba568dc0";

// Helper functions
async function getCrowdFundContract() {
return await ethers.getContractAt("Crowdfunding", CONTRACT_ADDRESS);
}


async function getCurrentTime() {
const block = await ethers.provider.getBlock("latest");
return block.timestamp;
}

async function waitForTransaction() {
console.log(`${description} - Transaction sent, waiting for confirmation...`);
const receipt = await tx.wait();
console.log(`${description} - Transaction confirmed! Hash:`, receipt.hash);
return receipt;
}

async function createcrowdFunding() {
console.log("\n=== Creating crowdFunding ===");
const _crowdFunding = await CrowdFundContract();
const latestTime = await getCurrentTime();
console.log("Creating crowdFunding with parameters:", {
});
const tx = await _crowdFunding.createCrowdFunding(
latestTime + 30,
latestTime + 86400,
ethers.parseUnits("0.00000001", 18),
1,
20
);
const receipt = await waitForTransaction(tx, "Create CrowdFunding");
const crowdFunding = await _crowdFunding.crowdFunding_count();
console.log("Total CrowdFunding count:", crowdFunding.toString());
const _crowdFundingInstance = await _crowdFunding.crowdFundings(2);
console.log("crowdFunding instance details:", _crowdFundingInstance);
return receipt.hash;
}
async function registercrowdFunding() {
console.log("\n=== Registering for crowdFunding ===");
const _crowdFunding = await getCrowdFundContract();
const owner = await ethers.provider.getSigner();
console.log("Signer address:", await owner.getAddress());

const receipt = await waitForTransaction(tx, "Register crowdFunding");
const _hasRegistered = await _crowdFunding.getHasRegistered(1, await owner.getAddress());
console.log("Registration status:", _hasRegistered);
return receipt.hash;
}
async function verifyTicket() {
console.log("\n=== Verifying Ticket ===");
const _crowdFunding = await getcrowdFundingContract();
const owner = await ethers.provider.getSigner();
console.log("Signer address:", await owner.getAddress());
const tx = await _crowdFunding.verifyAttendance(1, 1);
const receipt = await waitForTransaction(tx, "Verify Ticket");
const isVerified = await _crowdFunding.isVerifiedTicket(1, 1);
console.log("Ticket verification status:", isVerified);
return receipt.hash;
}
async function withdrawcrowdFunding() {

console.log("\n=== Withdrawing crowdFunding Funds ===");
const _crowdFunding = await getcrowdFundingContract();
let _balance = await _crowdFunding.crowdFundingBalance(1);
console.log("Initial crowdFunding balance:", ethers.formatEther(_balance), "ETH");
const tx = await _crowdFunding.withdrawForcrowdFunding(1);
const receipt = await waitForTransaction(tx, "Withdraw crowdFunding");
_balance = await _crowdFunding.crowdFundingBalance(1);
console.log("Final crowdFunding balance:", ethers.formatEther(_balance), "ETH");
return receipt.hash;
}
// Main function to execute all operations in sequence
async function main() {
try {
console.log("Starting crowdFunding management sequence...");
const createHash = await createcrowdFunding();

console.log("Create crowdFunding Transaction Hash:", createHash);
await new Promise(resolve => setTimeout(resolve, 5000));
const registerHash = await registercrowdFunding();
console.log("Register crowdFunding Transaction Hash:", registerHash);
await new Promise(resolve => setTimeout(resolve, 5000));
const verifyHash = await verifyTicket();
console.log("Verify Ticket Transaction Hash:", verifyHash);
await new Promise(resolve => setTimeout(resolve, 5000));
const withdrawHash = await withdrawcrowdFunding();
console.log("Withdraw crowdFunding Transaction Hash:", withdrawHash);
console.log("All operations completed successfully!");
} catch (error) {
console.error("Error in execution:", error);
throw error;
}
}

main()
.then(() => process.exit(0))
.catch((error) => {
console.error(error);
process.exit(1);
});