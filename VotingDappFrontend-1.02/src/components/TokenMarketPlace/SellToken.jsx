import { ethers } from "ethers";
import { useRef } from "react";
const SellToken = ({contractInstance,erc20ContractInstance}) => {
    const sellTokenAmountRef = useRef()
    const approveTokenAmountRef = useRef()
    const sellToken = async(e)=>{
      try{
       e.preventDefault()
       const tokenValueEth = sellTokenAmountRef.current.value;
       const tokenValueWei = ethers.parseEther(tokenValueEth,18);
       const tx = await contractInstance.sellGLDToken(tokenValueWei)
       const reciept = tx.wait()
       console.log("Transaction Successful")
      }catch(error){
        alert("Error: Selling Token")
        console.error(error)
      }
    }
    const approveToken = async(e)=>{
      try{
        e.preventDefault()
        const tokenValueEth = approveTokenAmountRef.current.value;
        const tokenValueWei = ethers.parseEther(tokenValueEth,18);
        const tokenMarketPlace = "0x4E05c0B1456e25f6566be393C124E5257a22b9B5"
        const tx = await erc20ContractInstance.approve(tokenMarketPlace,tokenValueWei)
        const reciept = tx.wait()
        console.log("Transaction Successful")
      }catch(error){
        console.error(error)
      }
     }
    return ( <>
    <form onSubmit={sellToken}>
      <label>Token Amount To Sell(In Eth):</label>
      <input type="text" ref={sellTokenAmountRef}></input>
      <button type="submit">Sell Token</button>
    </form>
    <form onSubmit={approveToken}>
      <label>Token Amount To Approve(In Eth):</label>
      <input type="text" ref={approveTokenAmountRef}></input>
      <button type="submit">Approve Token</button>
    </form>
    </>);
}
 
export default SellToken;
