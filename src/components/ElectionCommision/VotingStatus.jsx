import { useState, useEffect } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { Loader2 } from "lucide-react";

const VotingStatus = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [votingStatus, setVotingStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getVotingStatus = async () => {
      try {
        setIsLoading(true);
        const currentVotingStatus = await contractInstance.getVotingStatus();
        setVotingStatus(currentVotingStatus);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    contractInstance && getVotingStatus();
  }, [contractInstance]);

  const getStatusColor = (status) => {
    const lower = String(status).toLowerCase();
    if (lower.includes("active") || lower.includes("open")) return "bg-success text-success-foreground";
    if (lower.includes("ended") || lower.includes("closed")) return "bg-destructive text-destructive-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="flex items-center gap-3">
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking status...
        </div>
      ) : (
        <>
          <span className="text-sm text-muted-foreground">Current Status:</span>
          {votingStatus ? (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(votingStatus)}`}>
              {String(votingStatus)}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Not Available
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default VotingStatus;
