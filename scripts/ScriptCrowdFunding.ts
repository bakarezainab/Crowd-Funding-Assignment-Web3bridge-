import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x94c3A18e443D428C327C103c1b9CBf409eA64E9f";

// Helper functions
async function getCrowdFundContract() {
return await ethers.getContractAt("Crowdfunding", CONTRACT_ADDRESS);
}


async function getCurrentTime() {
const block = await ethers.provider.getBlock("latest");
return block.timestamp;
}

async function waitForTransaction(tx, description) {
console.log(`${description} - Transaction sent, waiting for confirmation...`);
const receipt = await tx.wait();
console.log(`${description} - Transaction confirmed! Hash:`, receipt.hash);
return receipt;
}

async function createEvent() {
console.log("\n=== Creating Event ===");
const _event = await CrowdFundContract();
const latestTime = await getCurrentTime();
console.log("Creating event with parameters:", {
});
const tx = await _event.createCrowdFunding(
latestTime + 30,
latestTime + 86400,
ethers.parseUnits("0.00000001", 18),
1,
20
);
const receipt = await waitForTransaction(tx, "Create CrowdFunding");
const crowdFunding = await _event.event_count();
console.log("Total CrowdFunding count:", crowdFunding.toString());
const _eventInstance = await _event.events(2);
console.log("Event instance details:", _eventInstance);
return receipt.hash;
}
async function registerEvent() {
console.log("\n=== Registering for Event ===");
const _event = await getCrowdFundContract();
const owner = await ethers.provider.getSigner();
console.log("Signer address:", await owner.getAddress());

const receipt = await waitForTransaction(tx, "Register Event");
const _hasRegistered = await _event.getHasRegistered(1, await owner.getAddress());
console.log("Registration status:", _hasRegistered);
return receipt.hash;
}
async function verifyTicket() {
console.log("\n=== Verifying Ticket ===");
const _event = await getEventContract();
const owner = await ethers.provider.getSigner();
console.log("Signer address:", await owner.getAddress());
const tx = await _event.verifyAttendance(1, 1);
const receipt = await waitForTransaction(tx, "Verify Ticket");
const isVerified = await _event.isVerifiedTicket(1, 1);
console.log("Ticket verification status:", isVerified);
return receipt.hash;
}
async function withdrawEvent() {

console.log("\n=== Withdrawing Event Funds ===");
const _event = await getEventContract();
let _balance = await _event.eventBalance(1);
console.log("Initial event balance:", ethers.formatEther(_balance), "ETH");
const tx = await _event.withdrawForEvent(1);
const receipt = await waitForTransaction(tx, "Withdraw Event");
_balance = await _event.eventBalance(1);
console.log("Final event balance:", ethers.formatEther(_balance), "ETH");
return receipt.hash;
}
// Main function to execute all operations in sequence
async function main() {
try {
console.log("Starting event management sequence...");
const createHash = await createEvent();

console.log("Create Event Transaction Hash:", createHash);
await new Promise(resolve => setTimeout(resolve, 5000));
const registerHash = await registerEvent();
console.log("Register Event Transaction Hash:", registerHash);
await new Promise(resolve => setTimeout(resolve, 5000));
const verifyHash = await verifyTicket();
console.log("Verify Ticket Transaction Hash:", verifyHash);
await new Promise(resolve => setTimeout(resolve, 5000));
const withdrawHash = await withdrawEvent();
console.log("Withdraw Event Transaction Hash:", withdrawHash);
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