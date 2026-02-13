import { useEffect, useState } from "react";
import { Web3Context } from "./web3Context";
import { getWeb3State, restoreWeb3State } from "../utils/getWeb3State";

const Web3Provider = ({ children }) => {
  const [web3State, setWeb3State] = useState({
    contractInstance: null,
    selectedAccount: null,
    chainId: null,
  });

  const handleWallet = async () => {
    try {
      const nextState = await getWeb3State();
      if (nextState) {
        setWeb3State(nextState);
      }
      return nextState;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const syncWalletState = async () => {
      try {
        const nextState = await restoreWeb3State();
        if (nextState) {
          setWeb3State(nextState);
        } else {
          setWeb3State({ contractInstance: null, selectedAccount: null, chainId: null });
        }
      } catch (error) {
        console.error(error);
      }
    };

    syncWalletState();

    const onAccountsChanged = async () => {
      await syncWalletState();
    };

    const onChainChanged = async () => {
      await syncWalletState();
    };

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener("chainChanged", onChainChanged);
    };
  }, []);

  return <Web3Context.Provider value={{ web3State, handleWallet }}>{children}</Web3Context.Provider>;
};

export default Web3Provider;
