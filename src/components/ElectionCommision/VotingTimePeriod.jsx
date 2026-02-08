import {useRef} from "react";
import {useWeb3Context} from "../../context/useWeb3Context";

const VotingTimePeriod =() =>{
    const {contractInstance} = useWeb3Context();
    const stratRef = useRef(null);
    const endRef = useRef(null);
    const handleVotingTime = async(e)=>{
        try{
            e.preventDefault();
            const stratTime = stratRef.current.value;
            const endTime = endRef.current.value;
            console.log(stratTime, endTime);
        }
        catch(error){
            console.log(error);
        }
    }
    return (<>
       <form onSubmit={handleVotingTime}>
            <label>Start Time:
                <input type="date" ref={startRef}></input>
            </label>
            <label>End Time:
                <input type="date" ref={endRef}></input>
            </label>

            <button type="submit">Register</button>
       </form>
       </>
    )
}

export default VotingTimePeriod;