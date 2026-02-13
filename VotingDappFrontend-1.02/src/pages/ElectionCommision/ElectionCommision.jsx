import VotingStatus from "../../components/ElectionCommision/VotingStatus";
import DisplayResult from "../../components/ElectionCommision/DisplayResult";

const ElectionCommision = () => {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-foreground" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Election Status & Result
          </h1>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Public dashboard with the current election status and declared result.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VotingStatus />
        <DisplayResult />
      </div>

      <div className="mt-8 bg-secondary rounded-md p-4 border-l-4 border-accent">
        <p className="text-xs text-secondary-foreground leading-relaxed">
          <strong>Public Notice:</strong> Administrative actions like setting voting period or emergency stop are available only in the restricted Admin Panel.
        </p>
      </div>
    </div>
  );
};

export default ElectionCommision;
