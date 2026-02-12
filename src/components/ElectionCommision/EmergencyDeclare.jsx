import { useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { Loader2, AlertOctagon } from "lucide-react";

const EmergencyDeclare = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emergencyStop = async () => {
    setIsSubmitting(true);
    try {
      await contractInstance.emergencyStopVoting();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground leading-relaxed">
        This action will immediately halt all voting activities. Use only in case of a critical emergency. This action is irreversible.
      </p>
      <button
        onClick={emergencyStop}
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-lg bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground shadow-sm transition-all hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Stopping...
          </>
        ) : (
          <>
            <AlertOctagon className="h-4 w-4" />
            Emergency Stop Voting
          </>
        )}
      </button>
    </div>
  );
};

export default EmergencyDeclare;
