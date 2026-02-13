import { useState, useEffect } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const STATUS_LABELS = {
  0: "Not Started",
  1: "In Progress",
  2: "Ended",
};

const VotingStatus = ({ refreshKey = 0 }) => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [votingStatus, setVotingStatus] = useState("Loading...");

  useEffect(() => {
    const getVotingStatus = async () => {
      try {
        const currentVotingStatus = await contractInstance.getVotingStatus();
        const index = Number(currentVotingStatus);
        setVotingStatus(STATUS_LABELS[index] || `Unknown (${String(currentVotingStatus)})`);
      } catch (error) {
        console.error(error);
        setVotingStatus("Unable to fetch status");
      }
    };

    if (contractInstance) {
      getVotingStatus();
    }
  }, [contractInstance, refreshKey]);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold text-card-foreground mb-1">Current Status</h3>
      <p className="text-xs text-muted-foreground mb-4">Real-time status of the current election.</p>
      <div className="flex items-center gap-3 bg-secondary rounded-md px-4 py-3">
        <div className="w-3 h-3 rounded-full bg-accent animate-pulse" aria-hidden="true"></div>
        <span className="text-sm font-medium text-secondary-foreground">{votingStatus || "No status available"}</span>
      </div>
    </div>
  );
};

export default VotingStatus;
