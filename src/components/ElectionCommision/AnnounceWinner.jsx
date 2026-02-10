import { useWeb3Context } from "../../context/useWeb3Context";
import {useEffect, useState} from 'reaxt';

export default function AnnounceWinner(){
    const [winner, setWinner] = useState()
    const {web3State} = useWeb3Context();
    const {contractInstance} = web3State;

    const getWinner = async  () =>{
        const winner = await contractInstance.announceVotingResult()
        console.log(winner);
        setWinner(winner);
    }

    return <div>
        <button onClick={getWinner}>Announce Winner</button>
    </div>
}