import { ethers } from "ethers";
import abi from "../constant/abi.json";
import axios from "axios";

export const getWeb3State = async () => {
  try {
    // Check if wallet is installed
    if (!window.ethereum) {
      throw new Error("Wallet not installed");
    }

    // Request wallet connection
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const selectedAccount = accounts[0];

    // Get current network (chainId)
    const chainIdHex = await window.ethereum.request({
      method: "eth_chainId",
    });
    const chainId = parseInt(chainIdHex, 16);

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Prepare contract address and login message
    const contractAddress = "0x9d7834C376B2b722c5693af588C3e7a03Ea8e44D";
    const message ="Welcome to Voting Dapp. You accept our terms and condition";

    // ✅ Await wallet signature
    const signature = await signer.signMessage(message);

    // Send signature to backend for JWT
    const res = await axios.post(
      `http://localhost:3000/api/authentication?accountAddress=${selectedAccount}`,
      { signature }
    );

    console.log("JWT Token:", res.data.token);
    localStorage.setItem("token", res.data.token);

    // Create contract instance
    const contractInstance = new ethers.Contract(contractAddress, abi, signer);

    // Return Web3 state
    return {
      contractInstance,
      selectedAccount,
      chainId,
    };
  } catch (error) {
    // Handle errors properly
    console.error("Web3 init/auth error:", error);
    throw error;
  }
};
