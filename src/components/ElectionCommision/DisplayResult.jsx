import React,{useEffect, useState} from 'react';
import { useWeb3Context } from '../../context/useWeb3Context';

const DisplayResult=()=>{
    const {web3State} = useWeb3Context();
    const {contractInstance} = web3State;
    const [winner , setWinner] = useState("No winner Declared");
    useEffect(()=>{
        const getWinner = async()=>{
            try{
                const winnerCandidateAddress = await contractInstance.winner();
                if(winnerCandidateAddress!='0x000000000000000000000000000000'){
                setWinner(winnerCandidate);
                }
            }catch(error){
                console.log(error);
            }
        }
        contractInstance && getWinner()
    },[])
    return(
        <div>
            <h1>Winner: {winner}</h1>
        </div>
    )
}

export default DisplayResult;