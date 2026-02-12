import { Link, useLocation } from "react-router-dom";
import { useWeb3Context } from "../../context/useWeb3Context";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/register-candidate", label: "Register Candidate" },
  { to: "/register-voter", label: "Register Voter" },
  { to: "/candidate-list", label: "Candidates" },
  { to: "/voter-list", label: "Voters" },
  { to: "/election-commision", label: "Commission" },
];

const Header = () => {
  const { web3State } = useWeb3Context();
  const { selectedAccount } = web3State;
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className="border-b border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          <p className="text-xs text-primary-foreground/70 tracking-wide">
            Government of India | Blockchain-Secured Electronic Voting System
          </p>
          {selectedAccount && (
            <div className="hidden md:flex items-center gap-2 text-xs text-primary-foreground/70">
              <span className="inline-block h-2 w-2 rounded-full bg-success" />
              <span>{truncateAddress(selectedAccount)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
            <Shield className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-primary-foreground">
              National E-Voting Portal
            </h1>
            <p className="text-xs text-primary-foreground/60 font-medium">
              Secure. Transparent. Decentralized.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {selectedAccount && (
          <nav className="hidden lg:block" aria-label="Main navigation">
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`
                        px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline
                        ${isActive
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Mobile Menu Button */}
        {selectedAccount && (
          <button
            className="lg:hidden p-2 rounded-md text-primary-foreground/70 hover:bg-primary-foreground/10 bg-transparent border-none cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      {selectedAccount && mobileMenuOpen && (
        <nav className="lg:hidden border-t border-primary-foreground/10" aria-label="Mobile navigation">
          <ul className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1 list-none m-0">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block px-3 py-2.5 rounded-md text-sm font-medium no-underline transition-colors
                      ${isActive
                        ? "bg-primary-foreground/15 text-primary-foreground"
                        : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
