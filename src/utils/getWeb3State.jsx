import { ethers } from "ethers";
import abi from "../constant/abi.json";

export const getWeb3State = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Wallet not installed");
    }

    // Request accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const selectedAccount = accounts[0];

    // Get chainId
    const chainIdHex = await window.ethereum.request({
      method: "eth_chainId",
    });
    const chainId = parseInt(chainIdHex, 16);

    // Provider & signer (ethers v6)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Contract
    const contractAddress = "0x9d7834C376B2b722c5693af588C3e7a03Ea8e44D";
    const contractInstance = new ethers.Contract(
      contractAddress,
      abi,
      signer
    );

    return {
      contractInstance,
      selectedAccount,
      chainId,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
