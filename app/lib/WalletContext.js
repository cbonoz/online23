// Create wallet context

// Path: app/lib/WalletContext.js

import React, { useState, useEffect, useContext, createContext } from "react";
import { ethers } from "ethers";

// Connect to the network
import { getNetwork } from "../util/network";
import { getProvider } from "../util/wallet";

// Create a context for the wallet
const WalletContext = createContext();

// https://docs.safe.global/safe-core-aa-sdk/auth-kit/web3auth
// Create a provider wrapper for the wallet context
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState();
  const [provider, setProvider] = useState();
  const [network, setNetwork] = useState();
  const [safeSDK, setSafeSDK] = useState();

  // Connect to the network
  useEffect(() => {
    const init = async () => {
      const network = await getNetwork();
      setNetwork(network);
      const provider = await getProvider(network);
      setProvider(provider);
      const account = (await provider.listAccounts())[0];
      setAccount(account);
    };
    init();
  }, []);

  

  return (
    <WalletContext.Provider value={{ account, provider, network }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook for child components to get the wallet object
export const useWallet = () => {
  const wallet = useContext(WalletContext);
  return wallet;
};
