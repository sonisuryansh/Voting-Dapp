import {useRef} from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const casteVote = ()=>{
    const {web3State} = useWeb3Context();
    const {contractInstance} = web3State;
    const voterIdRef = useRef(null);
    const candidateIdRef = useRef(null);

    const castVote = async(e)=>{
        try{
            e.preventDefault();
            const voterId = voterIdRef.current.value;
            const candidateId = candidateIdRef.current.value;

            console.log(voterId, candidateId);

            //await candidateInstance.castVote(voter,candidate)
            // console.log("Voted Successfull")
        }catch(error){
        console.log(error);
        }
    }
    return (
        <>
        <form onSubmit={voteCandidate}>
            <label >Voter Id:
                <input type="date" ref = {voterIdRef} />
            </label>
            <label >Candidate Id:
                <input type="date" ref ={candidateIdRef}/>
            </label>
            <button type="submit">Cast Vote</button>
        </form>
        </>
    )
}