import { ethers } from "ethers";
import abi from "../constant/abi.json";
import axios from "axios";

const CONTRACT_ADDRESS =
  import.meta.env.VITE_VOTING_CONTRACT_ADDRESS || "0x83A8cB9f282DD6763bca9c4bcf7977a4f5C77aB5";

const buildWeb3StateForAccount = async (selectedAccount) => {
  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
  const chainId = parseInt(chainIdHex, 16);

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner(selectedAccount);
  const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

  return { contractInstance, selectedAccount, chainId };
};

export const restoreWeb3State = async () => {
  if (!window.ethereum) return null;

  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  const selectedAccount = accounts?.[0];

  if (!selectedAccount) return null;

  return buildWeb3StateForAccount(selectedAccount);
};

export const getWeb3State = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const selectedAccount = accounts?.[0];

    if (!selectedAccount) {
      throw new Error("No wallet account selected");
    }

    const state = await buildWeb3StateForAccount(selectedAccount);

    const message = "Welcome to Voting Dapp. You accept our terms and condition";
    const signature = await state.contractInstance.runner.signMessage(message);

    const authResponse = await axios.post(
      `http://localhost:3000/api/authentication?accountAddress=${selectedAccount}`,
      { signature }
    );

    if (authResponse?.data?.token) {
      localStorage.setItem("token", authResponse.data.token);
    }

    return state;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
