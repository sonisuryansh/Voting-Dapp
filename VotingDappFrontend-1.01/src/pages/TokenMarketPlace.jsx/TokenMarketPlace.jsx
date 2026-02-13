
import { useWeb3Context } from "../../context/useWeb3Context";
import { useEffect,useState } from "react";
import { ethers } from "ethers";

import BuyToken from "../../components/TokenMarketPlace/BuyToken.jsx";
import SellToken from "../../components/TokenMarketPlace/SellToken.jsx";
import TokenBalance from "../../components/TokenMarketPlace/TokenBalance.jsx";
import TokenPrice from "../../components/TokenMarketPlace/TokenPrice.jsx";

import tokenMarketplaceAbi from "../../constant/tokenMarketplaceAbi.json"
import erc20abi from "../../constant/erc20Abi.json"

import {toast} from "react-hot-toast"

//founder - 0x4653CeA34af4B3cF4B27C912A5BBEE015b9E7Fb0
const TokenMarketplace = () => {
    const [tokenMarketplaceInstance,setTokenMarketplaceInstance]=useState(null)
    const [erc20ContractInstance,setErc20ContractInstance]=useState(null)
    const {web3State}=useWeb3Context()
    const {signer,provider}=web3State;
    
    useEffect(()=>{
        const erc20TokenInit = ()=>{
            try{
                const contractAddress = "0x437F2f874d247968F491D3fa3d1A9AD85Ea3Dd93"
                const erc20ContractInstance = new ethers.Contract(contractAddress,erc20abi,provider)
                setErc20ContractInstance(erc20ContractInstance)
            }catch(error){
                toast.error("Error start the vote")
            }
        }
        provider && erc20TokenInit()
    },[provider])
    
    useEffect(()=>{
        const tokenMarketplaceInit= ()=>{
            try{
                const tokenMarketplaceContractAddress = "0x4E05c0B1456e25f6566be393C124E5257a22b9B5";
                const tokenMarketplaceInstance = new ethers.Contract(tokenMarketplaceContractAddress,tokenMarketplaceAbi,signer)
                setTokenMarketplaceInstance(tokenMarketplaceInstance)
            }catch(error){
                toast.error("Error: Token Marketplace")
                console.error(error)
            }
        }
        signer && tokenMarketplaceInit()
    },[signer])

    return (
    <>
     <TokenBalance erc20ContractInstance={erc20ContractInstance}/>
     <br/>
     <TokenPrice contractInstance ={tokenMarketplaceInstance}/>
     <br/>
     <BuyToken contractInstance ={tokenMarketplaceInstance}/>
     <br/>
     <SellToken erc20ContractInstance={erc20ContractInstance} contractInstance ={tokenMarketplaceInstance}/>
     
    </>);
}
 
export default TokenMarketplace;
