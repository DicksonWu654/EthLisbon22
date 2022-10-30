const { ethers } = require("hardhat");

async function main() {

    const owner_to_wallet_saver_contract = await ethers.getContractFactory("owner_to_wallet_saver");
    const owner_to_wallet_saver_contract_acc = await owner_to_wallet_saver_contract.deploy();

    await owner_to_wallet_saver_contract_acc.deployed();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});