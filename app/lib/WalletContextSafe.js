// // Create wallet context

// // Path: app/lib/WalletContext.js

// import React, { useState, useEffect, useContext, createContext } from "react";
// import { ethers } from "ethers";

// import { Web3AuthModalPack, Web3AuthConfig } from '@safe-global/auth-kit'
// import { Web3AuthOptions } from '@web3auth/modal'
// import { OpenloginAdapter } from '@web3auth/openlogin-adapter'


// // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
// const options: Web3AuthOptions = {
//   clientId: 'YOUR_WEB3_AUTH_CLIENT_ID', // https://dashboard.web3auth.io/
//   web3AuthNetwork: 'testnet',
//   chainConfig: {
//     chainNamespace: CHAIN_NAMESPACES.EIP155,
//     chainId: '0x5',
//     // https://chainlist.org/
//     rpcTarget: 'https://rpc.ankr.com/eth_goerli'
//   },
//   uiConfig: {
//     theme: 'dark',
//     loginMethodsOrder: ['google', 'facebook']
//   }
// }

// // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
// const modalConfig = {
//   [WALLET_ADAPTERS.METAMASK]: {
//     label: 'metamask',
//     showOnDesktop: true,
//     showOnMobile: true
//   }
// }

// // https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
// const openloginAdapter = new OpenloginAdapter({
//   loginSettings: {
//     mfaLevel: 'mandatory'
//   },
//   adapterSettings: {
//     uxMode: 'popup',
//     whiteLabel: {
//       name: 'Safe'
//     }
//   }
// })

// const web3AuthConfig = {
//   txServiceUrl: 'https://safe-transaction-goerli.safe.global'
// }

// // Instantiate and initialize the pack
// const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig)
// await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig })

// // Create a context for the wallet
// const WalletContext = createContext();

// // https://docs.safe.global/safe-core-aa-sdk/auth-kit/web3auth
// // Create a provider wrapper for the wallet context
// export const WalletProvider = ({ children }) => {
//   const [account, setAccount] = useState();
//   const [provider, setProvider] = useState();
//   const [network, setNetwork] = useState();
//   const [safeSDK, setSafeSDK] = useState();

//   // Connect to the network
//   useEffect(() => {
//     const init = async () => {
//       const network = await getNetwork();
//       setNetwork(network);
//       const provider = await getProvider(network);
//       setProvider(provider);
//       const account = (await provider.listAccounts())[0];
//       setAccount(account);
//     };
//     init();
//   }, []);


// const login = async () => {
//     const authKitSignData = await web3AuthModalPack.signIn()
// }

//   return (
//     <WalletContext.Provider value={{ account, provider, login, logout, network }}>
//       {children}
//     </WalletContext.Provider>
//   );
// };

// // Hook for child components to get the wallet object
// export const useWallet = () => {
//   const wallet = useContext(WalletContext);
//   return wallet;
// };
