// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;
import "hardhat/console.sol";
contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
    }
    
    mapping (uint256 => Campaign) public campaigns;
    uint256 public numbersOfCampaigns = 0;

    event DeadlineCheck(uint256 deadline, uint256 currentBlockTimestamp);

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline)  public payable returns (uint256) {
        Campaign storage campaign = campaigns[numbersOfCampaigns];
        emit DeadlineCheck(_deadline, block.timestamp);
    	require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        numbersOfCampaigns++;

        return numbersOfCampaigns - 1;  
    }

    function donateToCampaign(uint256 _id) public payable  {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
           
        (bool sent,) = payable(campaign.owner).call{value:amount}("");
        require(sent, "Failed to send Ether");
        if(sent){
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }
    function getDonators(uint256 _id) view public returns(address[] memory, uint256[] memory){
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (address[] memory, string[] memory,string[] memory, uint[] memory, uint[] memory,uint[] memory) {
    address[] memory addresses = new address[](numbersOfCampaigns);
    string[] memory titles = new string[](numbersOfCampaigns);
    string[] memory descriptions = new string[](numbersOfCampaigns);
    uint[] memory targets = new uint[](numbersOfCampaigns);
    uint[] memory deadlines = new uint[](numbersOfCampaigns);
    uint[] memory gottenTillNow = new uint[](numbersOfCampaigns);

    for (uint i = 0; i < numbersOfCampaigns; i++) {
        Campaign storage item = campaigns[i];
        addresses[i] = item.owner;
        titles[i] = item.title;
        descriptions[i] = item.description;
        targets[i] = item.target;
        gottenTillNow[i] = item.amountCollected;
        deadlines[i] = item.deadline;
    }

    return (addresses, titles, descriptions, targets, gottenTillNow, deadlines);
}
 
}

