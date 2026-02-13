import { useRef, useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const CastVote = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [loading, setLoading] = useState(false);
  const voterIdRef = useRef(null);
  const candidateIdRef = useRef(null);

  const voteCandidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const voterId = voterIdRef.current.value;
      const candidateId = candidateIdRef.current.value;
      console.log(voterId, candidateId);
      // await contractInstance.castVote(voter, candidate)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-base font-semibold text-card-foreground mb-1">
        Cast Your Vote
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Enter your voter ID and the candidate ID to cast your vote.
      </p>
      <form onSubmit={voteCandidate} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="voter-id" className="text-sm font-medium text-card-foreground">
            Voter ID
          </label>
          <input
            id="voter-id"
            type="text"
            ref={voterIdRef}
            required
            placeholder="Enter your voter ID"
            className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="candidate-id" className="text-sm font-medium text-card-foreground">
            Candidate ID
          </label>
          <input
            id="candidate-id"
            type="text"
            ref={candidateIdRef}
            required
            placeholder="Enter candidate ID"
            className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 cursor-pointer text-sm"
        >
          {loading ? "Submitting..." : "Cast Vote"}
        </button>
      </form>
    </div>
  );
};

export default CastVote;
