import { useEffect, useState } from "react";
import { useWeb3Context } from "../../context/useWeb3Context";
import axios from "axios";

const Home = () => {
  const { web3State, handleWallet } = useWeb3Context();
  const { selectedAccount } = web3State || {};
  const [ethPrice, setEthPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        setEthPrice(res.data.ethereum.usd);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrice();
  }, []);

  const onConnect = async () => {
    setLoading(true);
    try {
      await handleWallet?.();
    } catch (err) {
      console.error(err);
      alert("Could not connect wallet: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Welcome to the National E‑Voting Portal</h2>
        <p className="text-sm text-muted-foreground">Overview and live info.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-semibold mb-2">Blockchain Market</h3>
          <p className="text-sm text-muted-foreground">Live ETH price (USD):</p>
          <p className="text-xl font-mono mt-2">{ethPrice ? `$${ethPrice}` : "Loading..."}</p>
        </section>

        <section className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-semibold mb-2">Blockchain Current News</h3>
          <ul className="text-sm text-muted-foreground list-disc pl-5">
            <li>Live news not configured — add API key to fetch real feeds.</li>
            <li>Tip: use NewsAPI or other RSS feeds for latest articles.</li>
          </ul>
        </section>

        <section className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-semibold mb-2">Current Government Details</h3>
          <p className="text-sm text-muted-foreground">Prime Minister: (placeholder)</p>
          <p className="text-sm text-muted-foreground">Ruling term ends: (placeholder)</p>
        </section>

        <section className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-semibold mb-2">Upcoming Election Time</h3>
          <p className="text-sm text-muted-foreground">Next major election: 2026-11-01 (placeholder)</p>
        </section>

        <section className="bg-card rounded-lg border border-border p-4 col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="font-semibold mb-2">Connect Wallet</h3>
          <p className="text-sm text-muted-foreground mb-3">Connect MetaMask to fill and submit voter details.</p>
          <div className="flex items-center gap-3">
            {!selectedAccount ? (
              <button
                onClick={onConnect}
                disabled={loading}
                className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md"
              >
                {loading ? "Connecting..." : "Connect MetaMask"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-success" aria-hidden="true" />
                <span className="text-sm font-mono">{`${selectedAccount.slice(0,6)}...${selectedAccount.slice(-4)}`}</span>
              </div>
            )}
          </div>
        </section>

        <section className="bg-card rounded-lg border border-border p-4 col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="font-semibold mb-2">Login / Signup</h3>
          <p className="text-sm text-muted-foreground mb-3">You can authenticate with Google for account linking.</p>
          <div className="flex items-center gap-3">
            <a
              href="/api/auth/google?next=/"
              className="inline-flex items-center gap-2 bg-white text-primary px-3 py-2 rounded-md border"
            >
              <img src="/google-logo.png" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
