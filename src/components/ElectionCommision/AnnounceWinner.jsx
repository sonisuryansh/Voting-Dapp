import { useWeb3Context } from "../../context/useWeb3Context";
import {useEffect, useState} from 'reaxt';

export default function AnnounceWinner(){
    const [winner, setWinner] = useState()
    const {contractInstance} = useWeb3Context()
    const getWinner = async  () =>{
        const winner = await contractInstance.announceVotingResult()
        console.log(winner);
        setWinner(winner);
    }

    return <div>
        <button onClick={getWinner}>Announce Winner</button>
    </div>
}