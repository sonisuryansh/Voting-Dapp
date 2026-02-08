import { useWeb3Context } from "../../context/useWeb3Context";

export default function EmergencyStopVoting(){

    const {contractInstance} = useWeb3Context()

    const emergencyStop = async () =>{
        await contractInstance.EmergencyStopVoting()
    }

    return <div>
        <button onClick={emergencyStop}>Stop Voting</button>
    </div>
}