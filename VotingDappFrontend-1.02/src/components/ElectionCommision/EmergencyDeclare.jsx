import { useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const EmergencyDeclare = ({ onActionComplete }) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("idle");
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;

  const emergencyStop = async () => {
    if (!contractInstance) {
      setStatusType("error");
      setStatusMessage("Wallet or contract is not connected.");
      return;
    }

    setLoading(true);
    setStatusType("pending");
    setStatusMessage("Submitting emergencyStopVoting transaction...");

    try {
      const tx = await contractInstance.emergencyStopVoting();
      await tx.wait();

      setStatusType("success");
      setStatusMessage("Voting stopped successfully.");

      if (typeof onActionComplete === "function") {
        onActionComplete();
      }
    } catch (error) {
      const message = error?.reason || error?.shortMessage || error?.message || "Failed to stop voting.";
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
    <div className="bg-card rounded-lg border border-destructive/30 p-6">
      <h3 className="text-base font-semibold text-destructive mb-1">Emergency Stop</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Immediately halt all voting operations. This action can only be done by commissioner.
      </p>

      <button
        onClick={emergencyStop}
        disabled={loading}
        className="w-full bg-destructive text-destructive-foreground font-semibold py-2.5 px-4 rounded-md hover:bg-destructive/90 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 disabled:opacity-50 cursor-pointer text-sm"
      >
        {loading ? "Stopping..." : "Stop Voting Immediately"}
      </button>

      {statusMessage && <p className={`mt-3 text-xs ${statusClass}`}>{statusMessage}</p>}
    </div>
  );
};

export default EmergencyDeclare;
