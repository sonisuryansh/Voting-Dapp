import { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";

const GetVoterList = () => {
  const { web3State } = useWeb3Context();
  const { contractInstance } = web3State;
  const [voterList, setVoterList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVoterList = async () => {
      setLoading(true);
      try {
        const voters = await contractInstance.getVoterList();
        console.log(voters);
        setVoterList(voters);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    contractInstance && fetchVoterList();
  }, [contractInstance]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Registered Voters
        </h1>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          View the complete list of voters registered on the blockchain.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-label="Loading"></div>
          <p className="text-sm text-muted-foreground">Loading voter records...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && voterList.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-card-foreground mb-1">No Voters Found</h2>
          <p className="text-sm text-muted-foreground">No voters have been registered yet. Register voters to see them here.</p>
        </div>
      )}

      {/* Voter Table */}
      {!loading && voterList.length > 0 && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase tracking-wider">
                    Voter Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase tracking-wider">
                    Gender
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {voterList.map((voter, index) => (
                  <tr key={index} className="hover:bg-muted transition-colors">
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-card-foreground font-mono">
                      {voter.voterAddress
                        ? `${voter.voterAddress.slice(0, 6)}...${voter.voterAddress.slice(-4)}`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-card-foreground font-medium">
                      {voter.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-card-foreground">
                      {voter.age ? String(voter.age) : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-card-foreground">
                      {voter.gender || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-muted border-t border-border">
            <p className="text-xs text-muted-foreground">
              Total Registered Voters: <span className="font-semibold text-card-foreground">{voterList.length}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetVoterList;
