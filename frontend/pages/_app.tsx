import type { AppProps } from 'next/app'
import { chains, providers } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../styles/theme'
import Navbar from '../components/Navbar'

const config: {projectId: string, theme: 'dark', accentColor: any, ethereum: any} = {
  projectId: '6395ac3ec192d9e310fdd75538b8b33a',
  theme: "dark",
  accentColor: "default",
  ethereum: {
    appName: 'web3Modal',
    autoConnect: true,
    chains: [
      chains.goerli
    ],
    providers: [providers.walletConnectProvider({ projectId: '6395ac3ec192d9e310fdd75538b8b33a' })]
  },
};

const Layout = ({children}: any) => {
  return (
    <>
      <Navbar/>
      {children}
    </>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Web3Modal config={config}/>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default MyApp
