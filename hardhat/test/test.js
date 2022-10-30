const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("@nomicfoundation/hardhat-chai-matchers");
const { inputToConfig } = require("@ethereum-waffle/compiler");

let utf8Encode = new TextEncoder();


describe("lol testing it... Not much more of a descriptive name :P", function () {

    let deployer;
    let user2;
    let user3;
    let moneyGrabContract;

    before(async function () {
        [deployer, user2, user3] = await ethers.getSigners();
        console.log("hi1")

        const wallet_saver = await ethers.getContractFactory("wallet_saver_queue");
        wallet_saverContract = await wallet_saver.deploy(100, deployer.address, deployer.address);
        console.log("hi2")

        const test_token = await ethers.getContractFactory("test_token");
        test_tokenContract = await test_token.deploy();
        console.log("hi3")

    });

    describe("testing all basic functions", function () {

        it("testing panic", async function () {
            console.log("fjioajfiojsiodsj")
            // console.log(await wallet_saverContract.block_time_startes())
            await deployer.sendTransaction({
                to: wallet_saverContract.address,
                value: ethers.utils.parseEther("1") // 1 ether
            });
            console.log("joe")
            let balance_user_before = await ethers.provider.getBalance(deployer.address);
            // console.log(ethers.provider.getBalance(wallet_saverContract.address));
            let tx1 = await wallet_saverContract.panic();
            let balance_user_after = await ethers.provider.getBalance(deployer.address);
            // console.log(tx1);
            // console.log(balance_user_before, balance_user_after);
            expect((balance_user_after.gt(balance_user_before))).to.equal(true);
        });

        it("testing panic with token", async function () {
            await deployer.sendTransaction({
                to: wallet_saverContract.address,
                value: ethers.utils.parseEther("1") // 1 ether
            });
            let balance_user_before = await test_tokenContract.balanceOf(deployer.address);
            // console.log("bob")
            await wallet_saverContract.add_tokens([test_tokenContract.address]);
            // console.log("joe")
            await test_tokenContract.mint(wallet_saverContract.address, 100000);
            let tx1 = await wallet_saverContract.panic();
            let balance_user_after = await test_tokenContract.balanceOf(deployer.address);
            // console.log(tx1);
            // console.log(balance_user_before, balance_user_after);
            expect(balance_user_after).to.be.greaterThan(balance_user_before);
        });

        it("testing trying to execute before time", async function () {
            await deployer.sendTransaction({
                to: wallet_saverContract.address,
                value: ethers.utils.parseEther("1") // 1 ether
            });

            await wallet_saverContract.queue(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"));

            await ethers.provider.send("evm_increaseTime", [50])
            await ethers.provider.send("evm_mine")
            let balance_user_before = await ethers.provider.getBalance(user2.address);
            // await wallet_saverContract.execute_call(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"))
            await expect(wallet_saverContract.execute_call(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"))).to.be.revertedWith('You can only execute after the time delay');
            // let balance_user_after = await ethers.provider.getBalance(user2.address);
            // console.log(balance_user_before, balance_user_after);
            // expect(true).to.equal(true)
        });

        it("testing trying to execute after time", async function () {
            await deployer.sendTransaction({
                to: wallet_saverContract.address,
                value: ethers.utils.parseEther("10") // 1 ether
            });
            let balance_user_before = await ethers.provider.getBalance(user2.address);
            await wallet_saverContract.queue(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"));

            await ethers.provider.send("evm_increaseTime", [101])
            await ethers.provider.send("evm_mine")

            await wallet_saverContract.execute_call(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"))
            let balance_user_after = await ethers.provider.getBalance(user2.address);

            // console.log(balance_user_after, balance_user_before)
            expect((balance_user_after.gt(balance_user_before))).to.equal(true);
        });

        it("testing trying to execute with incorrect data", async function () {
            await deployer.sendTransaction({
                to: wallet_saverContract.address,
                value: ethers.utils.parseEther("10") // 1 ether
            });
            await wallet_saverContract.queue(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"));

            await ethers.provider.send("evm_increaseTime", [101])
            await ethers.provider.send("evm_mine")

            await expect(wallet_saverContract.execute_call(user2.address, ethers.utils.parseEther("10"), utf8Encode.encode("0x"))).to.be.revertedWith('contents of the transaction changed');
        });

        it("testing repelling the transaction", async function () {
            await deployer.sendTransaction({
                to: wallet_saverContract.address,
                value: ethers.utils.parseEther("10") // 1 ether
            });
            await wallet_saverContract.queue(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"));

            await ethers.provider.send("evm_increaseTime", [50])
            await ethers.provider.send("evm_mine")

            await wallet_saverContract.revert_all_txns();

            await ethers.provider.send("evm_increaseTime", [55])
            await ethers.provider.send("evm_mine")

            await expect(wallet_saverContract.execute_call(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"))).to.be.reverted;
        });

        it("testing repelling this transaction", async function () {
            await deployer.sendTransaction({
                to: wallet_saverContract.address,
                value: ethers.utils.parseEther("10") // 1 ether
            });
            await wallet_saverContract.queue(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"));

            await ethers.provider.send("evm_increaseTime", [50])
            await ethers.provider.send("evm_mine")

            await wallet_saverContract.revert_this_txn(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"));

            await ethers.provider.send("evm_increaseTime", [55])
            await ethers.provider.send("evm_mine")

            await expect(wallet_saverContract.execute_call(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"))).to.be.reverted;
        });

        it("testing is_owner", async function () {

            await expect(wallet_saverContract.connect(user2).queue(user2.address, ethers.utils.parseEther("1"), utf8Encode.encode("0x"))).to.be.reverted;
        });
    })

})