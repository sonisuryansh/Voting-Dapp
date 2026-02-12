import VotingTimePeriod from "../../components/ElectionCommision/VotingTimePeriod";
import VotingStatus from "../../components/ElectionCommision/VotingStatus";
import AnnounceWinner from "../../components/ElectionCommision/AnnounceWinner";
import EmergencyDeclare from "../../components/ElectionCommision/EmergencyDeclare";
import DisplayResult from "../../components/ElectionCommision/DisplayResult";

const ElectionCommision = () => {
  return (
    <div>
      {/* Page Header */}
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
            Election Commission Dashboard
          </h1>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Administrative controls for managing the election lifecycle. Only authorized commissioners can execute these actions.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VotingTimePeriod />
        <VotingStatus />
        <AnnounceWinner />
        <DisplayResult />
        <div className="md:col-span-2">
          <EmergencyDeclare />
        </div>
      </div>

      {/* Admin Notice */}
      <div className="mt-8 bg-secondary rounded-md p-4 border-l-4 border-accent">
        <p className="text-xs text-secondary-foreground leading-relaxed">
          <strong>Commissioner Notice:</strong> All actions performed on this dashboard are recorded on the blockchain and are publicly auditable. Exercise caution when executing administrative operations.
        </p>
      </div>
    </div>
  );
};

export default ElectionCommision;
