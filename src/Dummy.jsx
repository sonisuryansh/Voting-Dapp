import { useContext } from "react";
import Web3Context from "./context/web3Context.jsx";

const Dummy = () => {
  const { web3State } = useContext(Web3Context);
  const { contractInstance, selectedAccount, chainId } = web3State;

  console.log(contractInstance, selectedAccount, chainId);

  return <div>Dummy Component</div>;
};

export default Dummy;
