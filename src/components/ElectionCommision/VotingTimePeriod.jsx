import { useRef, useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { Loader2 } from "lucide-react";

const VotingTimePeriod = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const startRef = useRef(null);
  const endRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVotingTime = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      const startTime = startRef.current.value;
      const endTime = endRef.current.value;

      console.log(startTime, endTime);
      // await contractInstance.setVotingPeriod(startTime, endTime);
      // console.log("Voter Time is set successful");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleVotingTime} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="start-time" className="text-sm font-medium text-card-foreground">
            Start Date
          </label>
          <input
            id="start-time"
            type="date"
            ref={startRef}
            required
            className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="end-time" className="text-sm font-medium text-card-foreground">
            End Date
          </label>
          <input
            id="end-time"
            type="date"
            ref={endRef}
            required
            className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Setting Period...
          </>
        ) : (
          "Set Voting Period"
        )}
      </button>
    </form>
  );
};

export default VotingTimePeriod;
