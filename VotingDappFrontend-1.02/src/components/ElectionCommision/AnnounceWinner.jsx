import { useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const AnnounceWinner = ({ onActionComplete }) => {
  const [winner, setWinner] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("idle");
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;

  const getWinner = async () => {
    if (!contractInstance) {
      setStatusType("error");
      setStatusMessage("Wallet or contract is not connected.");
      return;
    }

    setLoading(true);
    setStatusType("pending");
    setStatusMessage("Submitting announceVotingResult transaction...");

    try {
      const tx = await contractInstance.announceVotingResult();
      await tx.wait();

      const announcedWinner = await contractInstance.winner();
      setWinner(announcedWinner);

      setStatusType("success");
      setStatusMessage("Winner announced successfully.");

      if (typeof onActionComplete === "function") {
        onActionComplete();
      }
    } catch (error) {
      const message = error?.reason || error?.shortMessage || error?.message || "Failed to announce winner.";
      setStatusType("error");
      setStatusMessage(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusClass =
    statusType === "success"
      ? "text-success"
      : statusType === "error"
        ? "text-destructive"
        : "text-accent";

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold text-card-foreground mb-1">Announce Winner</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Finalize the election and store winner address in the contract.
      </p>

      <button
        onClick={getWinner}
        disabled={loading}
        className="w-full bg-accent text-accent-foreground font-semibold py-2.5 px-4 rounded-md hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 cursor-pointer text-sm"
      >
        {loading ? "Processing..." : "Announce Winner"}
      </button>

      {statusMessage && <p className={`mt-3 text-xs ${statusClass}`}>{statusMessage}</p>}

      {winner && (
        <div className="mt-4 bg-success/10 border border-success/20 rounded-md px-4 py-3">
          <p className="text-sm font-medium text-success break-all">Winner: {winner}</p>
        </div>
      )}
    </div>
  );
};

export default AnnounceWinner;
