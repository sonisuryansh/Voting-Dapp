import { useEffect } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import { useNavigate } from "react-router-dom";

const Wallet = () => {
  const { handleWallet, web3State } = useWeb3Context();
  const { selectedAccount } = web3State;
  const navigateTo = useNavigate();

  useEffect(() => {
    if (selectedAccount) {
      navigateTo("/register-candidate");
    }
  }, [selectedAccount]);

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="w-full max-w-lg">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 2L2 7V10H22V7L12 2Z" fill="#d97706" />
              <rect x="4" y="11" width="3" height="8" fill="#ffffff" />
              <rect x="10.5" y="11" width="3" height="8" fill="#ffffff" />
              <rect x="17" y="11" width="3" height="8" fill="#ffffff" />
              <rect x="2" y="20" width="20" height="2" fill="#ffffff" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight text-balance">
            National E-Voting Portal
          </h1>
          <p className="mt-2 text-muted-foreground text-base leading-relaxed">
            Secure, transparent, and decentralized elections powered by blockchain technology.
          </p>
        </div>

        {/* Connect Card */}
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">
            Authenticate Your Identity
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Connect your MetaMask wallet to verify your identity and access the voting portal.
          </p>

          <button
            onClick={handleWallet}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
          >
            Connect MetaMask Wallet
          </button>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Blockchain Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-secondary rounded-md p-4 text-center">
          <p className="text-xs text-secondary-foreground leading-relaxed">
            Ensure MetaMask is installed and connected to the correct network before proceeding.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
