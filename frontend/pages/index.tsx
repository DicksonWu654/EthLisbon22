import { Button, Container, Heading, HStack, Input, NumberInput, NumberInputField, Text, VStack } from '@chakra-ui/react'
import { Web3Button,
  useAccount, 
  useBalance, 
  useToken, 
  useContract 
} from '@web3modal/react';
import { ContractFactory, ethers } from 'ethers';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import styles from '../styles/Home.module.css'
import wallet_saver from '../abi/wallet_saver_queue.json'
import { useRouter } from 'next/router'

interface MetaMaskWindow extends Window {
  ethereum: any;
}

declare var window: MetaMaskWindow;

const Home: NextPage = () => {
  const { account }: any = useAccount();

  const router = useRouter()

  const [timeDelay, setTimeDelay] = useState(0);
  const [owner, setOwner] = useState(' ');
  const [panicAddress, setPanicAddress] = useState(' ');

  const { data, error, isLoading, refetch } = useBalance({
    addressOrName: account.address
  })

  const createWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const wallet_saver_contract = new ContractFactory(wallet_saver.abi, wallet_saver.bytecode, signer);
        const wallet_saver_contract_acc = await wallet_saver_contract.deploy(timeDelay, panicAddress, owner);
        router.push('/contract/' + wallet_saver_contract_acc.address)
      } catch(e) {
        console.log(e);
      }
    }
  }

  return (
    <Container centerContent minH={'80vh'} justifyContent={'center'} gap={16}>
      <Heading color={'blue.300'} fontSize={'8xl'}>SnapSecure</Heading>
      <Text fontSize={'2xl'} fontWeight={'bold'} textAlign={'center'}>Stop and secure unwanted transactions from hackers in one <Text as='s'>click</Text> Snap.</Text>
    </Container>
  )
}

export default Home
