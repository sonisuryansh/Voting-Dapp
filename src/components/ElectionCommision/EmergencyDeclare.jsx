import { useWeb3Context } from "../../context/useWeb3Context";

export default function EmergencyStopVoting(){
    const {web3State} = useWeb3Context();
    const {contractInstance} = web3State;

    const emergencyStop = async () =>{
        await contractInstance.EmergencyStopVoting()
    }
    
    return <div>
        <button onClick={emergencyStop}>Stop Voting</button>
    </div>
}