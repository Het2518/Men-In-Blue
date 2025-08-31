// filepath: c:\Users\Meet\Desktop\Team_DAU_Backend\scripts\deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Get the first two accounts from the Hardhat node
  const [deployer, oracle] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);
  console.log("Using account for Oracle Signer:", oracle.address);

  // The ERC2771Context constructor requires a trusted forwarder address.
  // For local testing, we can use a placeholder address. Here, we'll use the deployer's address.
  const trustedForwarderAddress = deployer.address;

  // Get the contract factory
  const GreenHydrogenCredit = await ethers.getContractFactory("GreenHydrogenCredit");

  // Deploy the contract, passing the constructor arguments
  console.log("Deploying GreenHydrogenCredit contract...");
  const contract = await GreenHydrogenCredit.deploy(trustedForwarderAddress, oracle.address);

  // Wait for the deployment transaction to be mined
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ GreenHydrogenCredit contract deployed successfully!");
  console.log("   Contract Address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });