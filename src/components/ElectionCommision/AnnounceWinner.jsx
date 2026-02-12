import { useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { Loader2, Trophy } from "lucide-react";

const AnnounceWinner = () => {
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;

  const getWinner = async () => {
    setIsLoading(true);
    try {
      const result = await contractInstance.announceVotingResult();
      console.log(result);
      setWinner(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={getWinner}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Trophy className="h-4 w-4" />
            Announce Winner
          </>
        )}
      </button>
      {winner && (
        <div className="rounded-lg bg-accent/10 border border-accent/20 px-4 py-3">
          <p className="text-sm font-medium text-accent">
            Winner: {String(winner)}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnnounceWinner;
