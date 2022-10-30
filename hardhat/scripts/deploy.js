const { ethers } = require("hardhat");

async function main() {

    const wallet_saver_contract = await ethers.getContractFactory("wallet_saver_queue");
    const wallet_saver_contract_acc = await wallet_saver_contract.deploy(10, "0x6970E49A6E2b9D24C3c4DE5F9435D054Fe27dCEA", "0x1AF92d7ffe4Bb3F673200Dc98CA6880fbFBBEE65");
    console.log(wallet_saver_contract_acc.owner())

    await wallet_saver_contract_acc.deployed();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});