// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDonation {
    struct Charity {
        string name;
        address payable wallet;
        uint256 totalDonations;
    }

    Charity[] public charities;
    mapping(address => uint256) public donorBalances;

    event DonationReceived(address indexed donor, uint256 amount, string charityName);

    function addCharity(string memory _name, address payable _wallet) public {
        charities.push(Charity({
            name: _name,
            wallet: _wallet,
            totalDonations: 0
        }));
    }

    function donate(uint256 charityIndex) public payable {
        require(charityIndex < charities.length, "Invalid charity index");
        require(msg.value > 0, "Donation amount must be greater than zero");
        
        Charity storage charity = charities[charityIndex];
        charity.wallet.transfer(msg.value);
        charity.totalDonations += msg.value;
        donorBalances[msg.sender] += msg.value;

        emit DonationReceived(msg.sender, msg.value, charity.name);
    }

    function getCharities() public view returns (Charity[] memory) {
        return charities;
    }
}

// Hardhat deployment script
const hre = require("hardhat");

async function main() {
    const CharityDonation = await hre.ethers.getContractFactory("CharityDonation");
    const charityDonation = await CharityDonation.deploy();

    await charityDonation.deployed();
    console.log("CharityDonation deployed to:", charityDonation.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
