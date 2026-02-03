import { useState } from "react";
import Web3Context from "./web3Context.jsx";
import { getWeb3State } from "../utils/getWeb3State.jsx";

// 
const Web3Provider = ({ children }) => {
  const [web3State, setWeb3State] = useState({
    contractInstance: null,
    selectedAccount: null,
    chainId: null
  });

 // 
  const handleWallet = async()=>{
    try{
        const {contractInstance, selectedAccount, chainId } = await getWeb3State();
        setWeb3State({contractInstance, selectedAccount, chainId});
    }catch(error){
        console.log(error);
    }  
  }


  return (
    <Web3Context.Provider value={{ web3State, setWeb3State }}>
      {children}
      <button onClick={handleWallet}>Connect Wallet</button>
    </Web3Context.Provider>
  );

  
};

export default Web3Provider;
