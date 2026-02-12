import { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { useNavigate } from "react-router-dom";

const GetCandidateList = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [candidateList, setCandidateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!token) {
      navigateTo("/");
    }
  }, [navigateTo, token]);

  useEffect(() => {
    const fetchCandidateList = async () => {
      setLoading(true);
      try {
        const candidates = await contractInstance.getCandidateList();
        setCandidateList(candidates);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    contractInstance && fetchCandidateList();
  }, [contractInstance]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Registered Candidates
        </h1>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          View all candidates registered for the current election cycle.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-label="Loading"></div>
          <p className="text-sm text-muted-foreground">Loading candidate records...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && candidateList.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-card-foreground mb-1">No Candidates Found</h2>
          <p className="text-sm text-muted-foreground">No candidates have been registered yet.</p>
        </div>
      )}

      {/* Candidate Cards Grid */}
      {!loading && candidateList.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidateList.map((candidate, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border border-border overflow-hidden hover:border-ring transition-colors"
              >
                {/* Candidate Photo */}
                <div className="bg-secondary flex items-center justify-center h-40">
                  <img
                    src={`http://localhost:3000/images/CandidateImages/${candidate.candidateAddress}.png`}
                    alt={`Photo of ${candidate.name}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<div class="flex items-center justify-center h-full w-full"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-muted-foreground"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
                    }}
                  />
                </div>

                {/* Candidate Info */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-card-foreground">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {candidate.party}
                  </p>

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">
                      {candidate.candidateAddress
                        ? `${candidate.candidateAddress.slice(0, 6)}...${candidate.candidateAddress.slice(-4)}`
                        : "N/A"}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-md">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      {String(candidate.votes)} votes
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Footer */}
          <div className="mt-6 bg-secondary rounded-md p-4">
            <p className="text-xs text-secondary-foreground">
              Total Registered Candidates: <span className="font-semibold">{candidateList.length}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default GetCandidateList;
