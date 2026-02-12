import { useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const AnnounceWinner = () => {
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;

  const getWinner = async () => {
    setLoading(true);
    try {
      const result = await contractInstance.announceVotingResult();
      console.log(result);
      setWinner(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold text-card-foreground mb-1">
        Announce Winner
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Finalize the election and announce the winning candidate.
      </p>
      <button
        onClick={getWinner}
        disabled={loading}
        className="w-full bg-accent text-accent-foreground font-semibold py-2.5 px-4 rounded-md hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 cursor-pointer text-sm"
      >
        {loading ? "Processing..." : "Announce Winner"}
      </button>
      {winner && (
        <div className="mt-4 bg-success/10 border border-success/20 rounded-md px-4 py-3">
          <p className="text-sm font-medium text-success">
            Winner: {String(winner)}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnnounceWinner;
