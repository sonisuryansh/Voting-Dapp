import { Landmark, Clock, Trophy, AlertOctagon, BarChart3, Activity } from "lucide-react";
import VotingTimePeriod from "../../components/ElectionCommision/VotingTimePeriod";
import AnnounceWinner from "../../components/ElectionCommision/AnnounceWinner";
import EmergencyDeclare from "../../components/ElectionCommision/EmergencyDeclare";
import DisplayResult from "../../components/ElectionCommision/DisplayResult";
import VotingStatus from "../../components/ElectionCommision/VotingStatus";

const ElectionCommision = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Landmark className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Election Commission Dashboard
          </h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Administrative controls for managing the election. Only the election commissioner wallet can execute these actions.
        </p>
      </div>

      {/* Status Bar */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-card-foreground">Election Status</h3>
        </div>
        <VotingStatus />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Set Voting Period */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-card-foreground">Voting Period</h3>
              <p className="text-xs text-muted-foreground">Set start and end times for voting</p>
            </div>
          </div>
          <VotingTimePeriod />
        </div>

        {/* Announce Winner */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <Trophy className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-card-foreground">Announce Winner</h3>
              <p className="text-xs text-muted-foreground">Declare the election results</p>
            </div>
          </div>
          <AnnounceWinner />
        </div>

        {/* Display Results */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
              <BarChart3 className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-card-foreground">Election Results</h3>
              <p className="text-xs text-muted-foreground">View the current winner</p>
            </div>
          </div>
          <DisplayResult />
        </div>

        {/* Emergency Stop */}
        <div className="rounded-xl border border-destructive/30 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
              <AlertOctagon className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-card-foreground">Emergency Controls</h3>
              <p className="text-xs text-muted-foreground">Halt voting in case of emergency</p>
            </div>
          </div>
          <EmergencyDeclare />
        </div>
      </div>
    </div>
  );
};

export default ElectionCommision;
