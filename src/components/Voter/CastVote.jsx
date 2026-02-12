import { useRef, useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { Vote, Loader2 } from "lucide-react";

const CastVote = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const voterIdRef = useRef(null);
  const candidateIdRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const voteCandidate = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      const voterId = voterIdRef.current.value;
      const candidateId = candidateIdRef.current.value;

      console.log(voterId, candidateId);
      // await contractInstance.castVote(voter, candidate);
      // console.log("Voted successful");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Vote className="h-5 w-5 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-card-foreground">Cast Your Vote</h3>
      </div>
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
            className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
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
            className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Casting Vote...
            </>
          ) : (
            "Cast Vote"
          )}
        </button>
      </form>
    </div>
  );
};

export default CastVote;
