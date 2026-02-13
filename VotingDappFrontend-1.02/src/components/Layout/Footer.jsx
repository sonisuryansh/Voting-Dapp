import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground/70 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground">
              National E-Voting Portal
            </span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-xs">
              Powered by Ethereum Blockchain Technology
            </p>
            <p className="text-xs">
              {'All votes are immutable, transparent, and verifiable on-chain.'}
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-primary-foreground/10 text-center">
          <p className="text-xs text-primary-foreground/50">
            {'Disclaimer: This is a demonstration e-voting portal. Not affiliated with any government entity.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
