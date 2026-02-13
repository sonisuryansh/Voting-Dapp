import { useEffect, useMemo, useState } from "react";
import VotingTimePeriod from "../../components/ElectionCommision/VotingTimePeriod";
import AnnounceWinner from "../../components/ElectionCommision/AnnounceWinner";
import EmergencyDeclare from "../../components/ElectionCommision/EmergencyDeclare";
import VotingStatus from "../../components/ElectionCommision/VotingStatus";
import DisplayResult from "../../components/ElectionCommision/DisplayResult";
import { useWeb3Context } from "../../context/useWeb3Context";

const AdminPanel = () => {
  const { web3State, handleWallet } = useWeb3Context();
  const { selectedAccount, contractInstance } = web3State;
  const [commissionAddress, setCommissionAddress] = useState("");
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const resolveCommissionAddress = async () => {
      if (!selectedAccount || !contractInstance) {
        setCommissionAddress("");
        setIsCheckingAccess(false);
        return;
      }

      setIsCheckingAccess(true);
      try {
        const commissioner = await contractInstance.electionCommission();
        setCommissionAddress(commissioner || "");
      } catch (error) {
        console.error(error);
        setCommissionAddress("");
      } finally {
        setIsCheckingAccess(false);
      }
    };

    resolveCommissionAddress();
  }, [contractInstance, selectedAccount]);

  const isAdmin = useMemo(() => {
    if (!selectedAccount || !commissionAddress) return false;
    return selectedAccount.toLowerCase() === commissionAddress.toLowerCase();
  }, [commissionAddress, selectedAccount]);

  const handleActionComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (isCheckingAccess) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 text-sm text-muted-foreground">
        Verifying commissioner access...
      </div>
    );
  }

  if (!selectedAccount) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          Connect your wallet first to access commissioner controls.
        </p>
        <button
          type="button"
          onClick={handleWallet}
          className="bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer text-sm"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-card rounded-lg border border-destructive/30 p-6">
        <h2 className="text-lg font-semibold text-destructive">Unauthorized</h2>
        <p className="text-sm text-muted-foreground mt-2">
          This panel is restricted to the election commissioner account.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Election Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          Restricted controls for election commission only. Public users cannot access these operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VotingTimePeriod onActionComplete={handleActionComplete} />
        <AnnounceWinner onActionComplete={handleActionComplete} />
        <div className="md:col-span-2">
          <EmergencyDeclare onActionComplete={handleActionComplete} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <VotingStatus refreshKey={refreshKey} />
        <DisplayResult refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default AdminPanel;
