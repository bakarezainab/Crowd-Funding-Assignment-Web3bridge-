// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Crowdfunding is Ownable {
    
    constructor() Ownable(msg.sender) {}

    struct Campaign {
        address creator;
        address token;
        uint256 goal;
        uint256 deadline;
        uint256 fundsRaised;
        bool fundsClaimed;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    uint256 public campaignCount;

    event CampaignCreated(uint256 campaignId, address indexed creator, uint256 goal, uint256 deadline);
    event Funded(uint256 campaignId, address indexed backer, uint256 amount);
    event FundsClaimed(uint256 campaignId);
    event Refunded(uint256 campaignId, address indexed backer, uint256 amount);

    function createCampaign(address _token, uint256 _goal, uint256 _duration) external {
        if (_goal <= 0) {
            revert("Goal must be greater than 0");
        }
        if (_duration <= 0) {
            revert("Duration must be greater than 0");
        }

        campaignCount++;
        campaigns[campaignCount] = Campaign({
            creator: msg.sender,
            token: _token,
            goal: _goal,
            deadline: block.timestamp + _duration,
            fundsRaised: 0,
            fundsClaimed: false
        });

        emit CampaignCreated(campaignCount, msg.sender, _goal, block.timestamp + _duration);
    }

    function fundCampaign(uint256 _campaignId, uint256 _amount) external {
        Campaign storage campaign = campaigns[_campaignId];
        if (block.timestamp >= campaign.deadline) {
            revert("Campaign has ended");
        }
        if (_amount <= 0) {
            revert("Contribution must be greater than 0");
        }
        
        IERC20 token = IERC20(campaign.token);
        if (!token.transferFrom(msg.sender, address(this), _amount)) {
            revert("Transfer failed");
        }
        
        campaign.fundsRaised += _amount;
        contributions[_campaignId][msg.sender] += _amount;
        emit Funded(_campaignId, msg.sender, _amount);
    }
//....................................Claim Funds..............................................
    function claimFunds(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        if (msg.sender != campaign.creator) {
            revert("Only creator can claim funds");
        }
        if (block.timestamp < campaign.deadline) {
            revert("Campaign is still active");
        }
        if (campaign.fundsRaised < campaign.goal) {
            revert("Funding goal not reached");
        }
        if (campaign.fundsClaimed) {
            revert("Funds already claimed");
        }
        
        campaign.fundsClaimed = true;
        IERC20(campaign.token).transfer(campaign.creator, campaign.fundsRaised);
        emit FundsClaimed(_campaignId);
    }
//....................................Refunds..............................................
    function refund(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        if (block.timestamp < campaign.deadline) {
            revert("Campaign is still active");
        }
        if (campaign.fundsRaised >= campaign.goal) {
            revert("Funding goal reached");
        }
        
        uint256 amount = contributions[_campaignId][msg.sender];
        if (amount <= 0) {
            revert("No contributions found");
        }
        contributions[_campaignId][msg.sender] = 0;
        
        IERC20(campaign.token).transfer(msg.sender, amount);
        emit Refunded(_campaignId, msg.sender, amount);
    }
}
