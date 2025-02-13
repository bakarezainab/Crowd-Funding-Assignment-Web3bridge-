import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { Signer } from "ethers";

describe("Crowdfunding", function () {
  let crowdfunding: any;
  let token: any;
  let owner: Signer, addr1: Signer;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("MockToken", "MTK", ethers.utils.parseEther("10000"));

    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = await Crowdfunding.deploy();
  });

  it("Should create a new campaign", async function () {
    await expect(crowdfunding.createCampaign(token.address, ethers.utils.parseEther("10"), 3600))
      .to.emit(crowdfunding, "CampaignCreated");
  });

  it("Should allow funding of a campaign", async function () {
    await crowdfunding.createCampaign(token.address, ethers.utils.parseEther("10"), 3600);
    await token.transfer(await addr1.getAddress(), ethers.utils.parseEther("10"));
    await token.connect(addr1).approve(crowdfunding.address, ethers.utils.parseEther("10"));
    
    await expect(crowdfunding.connect(addr1).fundCampaign(1, ethers.utils.parseEther("5")))
      .to.emit(crowdfunding, "Funded");
  });

  it("Should allow the creator to claim funds when the goal is met", async function () {
    await crowdfunding.createCampaign(token.address, ethers.utils.parseEther("10"), 3600);
    await token.transfer(await addr1.getAddress(), ethers.utils.parseEther("10"));
    await token.connect(addr1).approve(crowdfunding.address, ethers.utils.parseEther("10"));
    await crowdfunding.connect(addr1).fundCampaign(1, ethers.utils.parseEther("10"));

    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine", []);

    await expect(crowdfunding.claimFunds(1))
      .to.emit(crowdfunding, "FundsClaimed");
  });
});
