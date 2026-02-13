import { useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const VotingTimePeriod = ({ onActionComplete }) => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;

  const [startDelayMinutes, setStartDelayMinutes] = useState("0");
  const [durationMinutes, setDurationMinutes] = useState("120");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("idle");

  const handleVotingTime = async (event) => {
    event.preventDefault();

    if (!contractInstance) {
      setStatusType("error");
      setStatusMessage("Wallet or contract is not connected.");
      return;
    }

    const startMinutes = Number(startDelayMinutes);
    const durationMins = Number(durationMinutes);

    if (!Number.isFinite(startMinutes) || startMinutes < 0) {
      setStatusType("error");
      setStatusMessage("Start delay must be 0 or greater.");
      return;
    }

    if (!Number.isFinite(durationMins) || durationMins <= 0) {
      setStatusType("error");
      setStatusMessage("Duration must be greater than 0.");
      return;
    }

    const startDelaySeconds = Math.floor(startMinutes * 60);
    const durationSeconds = Math.floor(durationMins * 60);

    if (durationSeconds <= 3600) {
      setStatusType("error");
      setStatusMessage("Contract requires voting duration greater than 60 minutes.");
      return;
    }

    setLoading(true);
    setStatusType("pending");
    setStatusMessage("Submitting setVotingPeriod transaction...");

    try {
      const tx = await contractInstance.setVotingPeriod(startDelaySeconds, durationSeconds);
      await tx.wait();

      setStatusType("success");
      setStatusMessage("Voting period updated successfully.");

      if (typeof onActionComplete === "function") {
        onActionComplete();
      }
    } catch (error) {
      const message = error?.reason || error?.shortMessage || error?.message || "Failed to set voting period.";
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
      <h3 className="text-base font-semibold text-card-foreground mb-1">Set Voting Period</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Configure contract durations (in minutes). These values are passed to setVotingPeriod.
      </p>

      <form onSubmit={handleVotingTime} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="start-delay" className="text-sm font-medium text-card-foreground">
            Start Delay (minutes)
          </label>
          <input
            id="start-delay"
            type="number"
            min="0"
            step="1"
            value={startDelayMinutes}
            onChange={(event) => setStartDelayMinutes(event.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="duration" className="text-sm font-medium text-card-foreground">
            Voting Duration (minutes)
          </label>
          <input
            id="duration"
            type="number"
            min="61"
            step="1"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <span className="text-xs text-muted-foreground">Must be greater than 60 minutes as per contract rule.</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 cursor-pointer text-sm"
        >
          {loading ? "Setting..." : "Set Voting Period"}
        </button>
      </form>

      {statusMessage && <p className={`mt-3 text-xs ${statusClass}`}>{statusMessage}</p>}
    </div>
  );
};

export default VotingTimePeriod;
