import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

// Глобальное объявление для TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useMetamask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setErrorMessage("MetaMask is not installed. Please install MetaMask and try again.");
        return;
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      setProvider(web3Provider);

      // Запрос разрешений на доступ к аккаунтам (показывает окно выбора аккаунта)
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }]
      });

      // Теперь получаем аккаунты
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setErrorMessage("No accounts found.");
      }

      const net = await web3Provider.getNetwork();
      setNetwork(net.name);
    } catch (error) {
      setErrorMessage("Failed to connect to MetaMask.");
      console.error("Error connecting to MetaMask:", error);
    }
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
        setErrorMessage("Please connect to MetaMask.");
      }
    };

    const handleChainChanged = async () => {
      if (provider) {
        const net = await provider.getNetwork();
        setNetwork(net.name);
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [provider]);

  return { account, provider, network, errorMessage, connectWallet, setAccount, setProvider, setNetwork, setErrorMessage };
};
