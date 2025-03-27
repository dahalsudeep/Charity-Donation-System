
// React Frontend (frontend/src/App.js)
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CharityDonation from "../artifacts/contracts/CharityDonation.sol/CharityDonation.json";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function App() {
    const [charities, setCharities] = useState([]);
    const [donationAmount, setDonationAmount] = useState("");
    const [selectedCharity, setSelectedCharity] = useState(null);

    useEffect(() => {
        loadCharities();
    }, []);

    async function loadCharities() {
        if (!window.ethereum) return;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CharityDonation.abi, provider);
        const data = await contract.getCharities();
        setCharities(data);
    }

    async function donate() {
        if (!window.ethereum || selectedCharity === null || donationAmount <= 0) return;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CharityDonation.abi, signer);
        const tx = await contract.donate(selectedCharity, { value: ethers.utils.parseEther(donationAmount) });
        await tx.wait();
        alert("Donation Successful!");
        loadCharities();
    }

    return (
        <div>
            <h1>Blockchain Charity Donation</h1>
            <ul>
                {charities.map((charity, index) => (
                    <li key={index}>
                        {charity.name} - Total Donations: {ethers.utils.formatEther(charity.totalDonations)} ETH
                        <button onClick={() => setSelectedCharity(index)}>Select</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Amount in ETH"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
            />
            <button onClick={donate}>Donate</button>
        </div>
    );
}

export default App;
