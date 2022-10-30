import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Container, cookieStorageManager, Flex, Heading, HStack, IconButton, Input, NumberInput, NumberInputField, Text, VStack } from "@chakra-ui/react"
import { useAccount } from "@web3modal/react"
import { BigNumber, ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router"
import { useState, useEffect } from 'react';
import wallet_saver from '../../abi/wallet_saver_queue.json'

interface MetaMaskWindow extends Window {
    ethereum: any;
}

declare var window: MetaMaskWindow;

const Comment = () => {

    const router = useRouter()
    const { comment }: any = router.query

    const { account }: any = useAccount();

    const testArray = Array(10).fill({ to: 'Cesar', value: 10, data: 'hello', starts: 200 });

    const [walletSaverContract, setWalletSaverContract] = useState<any>(null);

    const [array, setArray] = useState<any>([]);

    const [to, setTo] = useState(' ');
    const [value, setValue] = useState(0);
    const [data, setData] = useState(' ');

    useEffect(() => {
        console.log(array)
    }, [array])

    useEffect(() => {

        const initialize = async () => {
            if (typeof window.ethereum !== "undefined") {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = await new ethers.Contract(window.location.pathname.replace("/contract/", ""), wallet_saver.abi, signer);

                try {
                    for (var i = 0; i >= 0; i++) {
                        const value = await contract.tx_content_value(i)
                        const formatted = parseFloat(ethers.utils.formatEther(value))
                        if (formatted > 0) {
                            const to = await contract.tx_content_to(i)
                            const data = await contract.tx_content_data(i)
                            const starts = await contract.block_time_starts(i)
                            const parsedStart = parseFloat(ethers.utils.formatEther(starts))
                            setArray((array: any) => [...array, { to, value: formatted, data, starts: parsedStart }])
                        }
                    }
                } catch (e) {
                    console.log(e)
                }

                return contract;
            } else {
                throw new Error("No Web 3.0 Provider Found!")
            }
        }

        initialize().then((contract) => setWalletSaverContract(contract));

    }, [])

    const panic = () => {
        try {
            walletSaverContract.panic();
        } catch (e) {
            console.log(e);
        }
    }

    const allowTransaction = (id: number) => {
        try {
            walletSaverContract.execute_call(id);
        } catch (e) {
            console.log(e);
        }
    }

    const declineTransaction = (id: number) => {
        try {
            walletSaverContract.revert_this_txn(id);
        } catch (e) {
            console.log(e);
        }
    }

    const createTransaction = () => {
        try {
            walletSaverContract.queue(to, value, data);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Flex minH={'100vh'} alignItems={'center'} flexDirection={'column'}>
            {account.isConnected == true && (
                <>
                    <Breadcrumb p={5} pb={20} w={'full'} fontSize={'2xl'}>
                        <BreadcrumbItem>
                            <BreadcrumbLink color={'whiteAlpha.600'}>Contract</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink>
                                {
                                    window.location.pathname.replace("/contract/", "").substring(0, 5) +
                                    '...' +
                                    window.location.pathname.replace("/contract/", "").substring(window.location.pathname.replace("/contract/", "").length - 6, window.location.pathname.replace("/contract/", "").length)
                                }
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Box>
                        <Text fontSize={'xl'} my={2} alignSelf={'left'}>Create Transaction</Text>
                        <HStack>
                            <NumberInput minW={'3xs'} value={value}>
                                <NumberInputField
                                    placeholder={'Value'}
                                    onChange={e => {
                                        const result = isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value);
                                        setValue(result);
                                    }}
                                />
                            </NumberInput>
                            <Input placeholder={'To'} onChange={e => { setTo(e.target.value) }} />
                            <Input placeholder={'Data'} onChange={e => { setData(e.target.value) }} />
                            <Button colorScheme={'blue'} w={'100%'} onClick={createTransaction}>Create Transaction</Button>
                        </HStack>
                    </Box>
                    <Box w={'90%'} my={20}>
                        <VStack>
                            {array.map((item: any, index: number) => (
                                <HStack key={index} borderRadius={'lg'} w={'60%'} bgColor={'#00315c'} p={5} justifyContent={'space-between'}>
                                    <Text>{item.to.substring(0, 5) + '...' + item.to.substring(item.to.length - 3, item.to.length)}</Text>
                                    <Text>{item.value}</Text>
                                    <Text>{item.starts}</Text>
                                    <HStack gap={5}>
                                        <IconButton
                                            aria-label='Allow transaction'
                                            colorScheme={'blue'}
                                            variant={'ghost'}
                                            icon={<CheckIcon />}
                                            onClick={() => allowTransaction(index)}
                                        />
                                        <IconButton
                                            colorScheme='red'
                                            aria-label='Cancel transaction'
                                            variant={'ghost'}
                                            icon={<CloseIcon />}
                                            onClick={() => declineTransaction(index)}
                                        />
                                    </HStack>

                                </HStack>
                            ))}
                            <Box>
                                <Button
                                    my={20} h={'3rem'} textAlign={'center'} fontSize={'xl'} colorScheme={'red'}
                                    onClick={panic}
                                    px={10}
                                >
                                    PANIC!
                                </Button>
                            </Box>
                        </VStack>
                    </Box>
                </>
            )}
        </Flex>
    )

}


export default Comment;