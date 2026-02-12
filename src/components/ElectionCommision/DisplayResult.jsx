import { useState, useEffect } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const DisplayResult = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [winner, setWinner] = useState("No winner declared");

  useEffect(() => {
    const getWinner = async () => {
      try {
        const winningCandidateAddress = await contractInstance.winner();
        if (winningCandidateAddress !== "0x0000000000000000000000000000000000000000") {
          setWinner(winningCandidateAddress);
        }
      } catch (error) {
        console.error(error);
      }
    };
    contractInstance && getWinner();
  }, [contractInstance]);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold text-card-foreground mb-1">
        Election Result
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        The declared winner of the current election.
      </p>
      <div className="bg-secondary rounded-md px-4 py-3">
        <p className="text-sm text-secondary-foreground">
          <span className="font-medium">Winner:</span>{" "}
          <span className="font-mono">{winner}</span>
        </p>
      </div>
    </div>
  );
};

export default DisplayResult;
