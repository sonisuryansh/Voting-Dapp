import React,{useState} from 'react';
import  {useWeb3Context} from "../../../context/web3Provider.jsx";

const VotingStatus = ()=>{
    const {web3State} = useWeb3Context();
    const {contractInstance} = web3State;
    const [VotingStatus, setVotingStatus] = useState("")

    useEffect(()=>{
        const getVotingStatus = async()=>{
            try{
                const currentVotingStatus = await contractInstance.getVotingStatus();
                setVotingStatus(currentVotingStatus);
            }catch(error){
                console.log(error);
            }
        }
        contractInstance && getVotingStatus()
    },[]);
    return(
        <div>
            <h1>Status :{VotingStatus}</h1>
        </div>
    )
}