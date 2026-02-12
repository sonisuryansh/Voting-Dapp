import { useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const EmergencyDeclare = () => {
  const [loading, setLoading] = useState(false);
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;

  const emergencyStop = async () => {
    setLoading(true);
    try {
      await contractInstance.emergencyStopVoting();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-destructive/30 p-6">
      <h3 className="text-base font-semibold text-destructive mb-1">
        Emergency Stop
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Immediately halt all voting operations. This action cannot be undone.
      </p>
      <button
        onClick={emergencyStop}
        disabled={loading}
        className="w-full bg-destructive text-destructive-foreground font-semibold py-2.5 px-4 rounded-md hover:bg-destructive/90 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 disabled:opacity-50 cursor-pointer text-sm"
      >
        {loading ? "Stopping..." : "Stop Voting Immediately"}
      </button>
    </div>
  );
};

export default EmergencyDeclare;
