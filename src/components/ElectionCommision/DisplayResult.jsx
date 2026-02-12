import { useState, useEffect } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { Loader2 } from "lucide-react";

const DisplayResult = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [winner, setWinner] = useState("No winner declared");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getWinner = async () => {
      try {
        setIsLoading(true);
        const winningCandidateAddress = await contractInstance.winner();
        if (winningCandidateAddress !== "0x0000000000000000000000000000000000000000") {
          setWinner(winningCandidateAddress);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    contractInstance && getWinner();
  }, [contractInstance]);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading results...
        </div>
      ) : (
        <div className="rounded-lg bg-muted px-4 py-3">
          <p className="text-xs text-muted-foreground mb-1">Current Winner</p>
          <p className="text-sm font-semibold text-card-foreground break-all">
            {winner}
          </p>
        </div>
      )}
    </div>
  );
};

export default DisplayResult;
