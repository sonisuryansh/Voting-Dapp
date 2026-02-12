import { useRef, useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const VotingTimePeriod = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [loading, setLoading] = useState(false);
  const startRef = useRef(null);
  const endRef = useRef(null);

  const handleVotingTime = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const startTime = startRef.current.value;
      const endTime = endRef.current.value;
      console.log(startTime, endTime);
      // await contractInstance.setVotingPeriod(startTime, endTime)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold text-card-foreground mb-1">
        Set Voting Period
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Define the start and end dates for the voting window.
      </p>
      <form onSubmit={handleVotingTime} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="voting-start" className="text-sm font-medium text-card-foreground">
            Start Date
          </label>
          <input
            id="voting-start"
            type="date"
            ref={startRef}
            required
            className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="voting-end" className="text-sm font-medium text-card-foreground">
            End Date
          </label>
          <input
            id="voting-end"
            type="date"
            ref={endRef}
            required
            className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 cursor-pointer text-sm"
        >
          {loading ? "Setting..." : "Set Voting Period"}
        </button>
      </form>
    </div>
  );
};

export default VotingTimePeriod;
