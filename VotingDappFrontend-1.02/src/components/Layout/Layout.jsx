import { Link, useLocation } from "react-router-dom";
import { useWeb3Context } from "../../context/useWeb3Context";
import { useEffect, useMemo, useState } from "react";
import VideoBackground from "./VideoBackground";

const baseNavLinks = [
  { to: "/", label: "Home" },
  { to: "/register-candidate", label: "Register Candidate" },
  { to: "/register-voter", label: "Register Voter" },
  { to: "/candidate-list", label: "Candidates" },
  { to: "/voter-list", label: "Voters" },
  { to: "/election-commision", label: "Election Info" },
  { to: "/token-marketplace", label: "Token Marketplace" },
];

const THEME_STORAGE_KEY = "voting_dapp_theme";

const resolveInitialDarkMode = () => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "dark") return true;
  if (storedTheme === "light") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const { web3State } = useWeb3Context();
  const { selectedAccount, contractInstance } = web3State;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [commissionAddress, setCommissionAddress] = useState("");

  useEffect(() => {
    const initialDarkMode = resolveInitialDarkMode();
    setIsDarkMode(initialDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const resolveCommissionAddress = async () => {
      if (!selectedAccount || !contractInstance) {
        setCommissionAddress("");
        return;
      }

      try {
        const commissioner = await contractInstance.electionCommission();
        setCommissionAddress(commissioner || "");
      } catch (error) {
        console.error(error);
        setCommissionAddress("");
      }
    };

    resolveCommissionAddress();
  }, [contractInstance, selectedAccount]);

  const isAdmin = useMemo(() => {
    if (!selectedAccount || !commissionAddress) return false;
    return selectedAccount.toLowerCase() === commissionAddress.toLowerCase();
  }, [commissionAddress, selectedAccount]);

  const navLinks = useMemo(() => {
    if (!isAdmin) return baseNavLinks;
    return [...baseNavLinks, { to: "/admin-panel", label: "Admin Panel" }];
  }, [isAdmin]);

  const toggleTheme = () => {
    setIsDarkMode((prevState) => !prevState);
  };

  const truncatedAccount = selectedAccount
    ? `${selectedAccount.slice(0, 6)}...${selectedAccount.slice(-4)}`
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <VideoBackground />
      {/* Header */}
      <header className="bg-primary text-primary-foreground border-b-4 border-accent frosted">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2L2 7V10H22V7L12 2Z" fill="currentColor" />
                <rect x="4" y="11" width="3" height="8" fill="currentColor" />
                <rect x="10.5" y="11" width="3" height="8" fill="currentColor" />
                <rect x="17" y="11" width="3" height="8" fill="currentColor" />
                <rect x="2" y="20" width="20" height="2" fill="currentColor" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight block leading-tight">
                National E-Voting Portal
              </span>
              <span className="text-xs text-primary-foreground/70 tracking-wide uppercase">
                Blockchain Secured
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground rounded-md px-3 py-1.5 text-xs md:text-sm font-medium border border-primary-foreground/20 transition-colors cursor-pointer"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span aria-hidden="true">{isDarkMode ? "☀" : "🌙"}</span>
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>

            {truncatedAccount && (
              <div className="hidden md:flex items-center gap-2 bg-primary-foreground/10 rounded-md px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-success" aria-hidden="true"></div>
                <span className="text-sm font-mono text-primary-foreground/90">
                  {truncatedAccount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-primary/90 border-t border-primary-foreground/10" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-1 overflow-x-auto py-1 -mb-px">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`block px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors rounded-t-md ${
                        isActive
                          ? "bg-background text-foreground"
                          : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 frosted">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground/70 border-t-4 border-accent mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-primary-foreground">
                National E-Voting Portal
              </p>
              <p className="text-xs mt-1">
                Powered by Ethereum Blockchain Technology
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <span>Transparent</span>
              <span className="text-primary-foreground/30" aria-hidden="true">|</span>
              <span>Immutable</span>
              <span className="text-primary-foreground/30" aria-hidden="true">|</span>
              <span>Decentralized</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
