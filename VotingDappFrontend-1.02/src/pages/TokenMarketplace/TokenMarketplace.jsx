import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useWeb3Context } from "../../context/useWeb3Context";
import tokenMarketplaceAbi from "../../constant/tokenMarketplaceAbi.json";
import erc20Abi from "../../constant/erc20Abi.json";

const MARKETPLACE_ADDRESS =
  import.meta.env.VITE_MARKETPLACE_ADDRESS || "0x4E05c0B1456e25f6566be393C124E5257a22b9B5";
const FALLBACK_TOKEN_ADDRESS =
  import.meta.env.VITE_GLD_TOKEN_ADDRESS || "0x437F2f874d247968F491D3fa3d1A9AD85Ea3Dd93";
const EXPECTED_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 0);

const formatAddress = (address) => {
  if (!address) return "-";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatError = (error) => {
  if (!error) return "Unknown error";
  if (error.reason) return error.reason;
  if (error.shortMessage) return error.shortMessage;
  if (error.message) return error.message;
  return String(error);
};

const parseAmountToWei = (amount, decimals) => {
  if (!amount) return null;
  try {
    const parsed = ethers.parseUnits(amount, decimals);
    return parsed > 0n ? parsed : null;
  } catch {
    return null;
  }
};

const TokenMarketplace = () => {
  const { web3State, handleWallet } = useWeb3Context();
  const { selectedAccount, chainId } = web3State;

  const [tokenMarketplaceInstance, setTokenMarketplaceInstance] = useState(null);
  const [erc20ContractInstance, setErc20ContractInstance] = useState(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(18);

  const [tokenBalanceWei, setTokenBalanceWei] = useState(0n);
  const [allowanceWei, setAllowanceWei] = useState(0n);
  const [tokenPriceWei, setTokenPriceWei] = useState(0n);

  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTxPending, setIsTxPending] = useState(false);
  const [txStatus, setTxStatus] = useState({ type: "idle", message: "" });

  const walletConnected = Boolean(selectedAccount && window.ethereum);
  const wrongNetwork =
    EXPECTED_CHAIN_ID > 0 && Number.isFinite(chainId) && chainId !== EXPECTED_CHAIN_ID;
  const canTransact = walletConnected && !wrongNetwork && tokenMarketplaceInstance && erc20ContractInstance;

  const buyAmountWei = useMemo(
    () => parseAmountToWei(buyAmount, tokenDecimals),
    [buyAmount, tokenDecimals]
  );

  const sellAmountWei = useMemo(
    () => parseAmountToWei(sellAmount, tokenDecimals),
    [sellAmount, tokenDecimals]
  );

  const buyCostWei = useMemo(() => {
    if (!buyAmountWei || tokenPriceWei <= 0n) return 0n;
    const unit = 10n ** BigInt(tokenDecimals);
    return (buyAmountWei * tokenPriceWei) / unit;
  }, [buyAmountWei, tokenPriceWei, tokenDecimals]);

  const tokenBalance = useMemo(
    () => ethers.formatUnits(tokenBalanceWei, tokenDecimals),
    [tokenBalanceWei, tokenDecimals]
  );

  const tokenPriceEth = useMemo(() => {
    if (tokenPriceWei <= 0n) return "0";
    return Number(ethers.formatEther(tokenPriceWei)).toFixed(6);
  }, [tokenPriceWei]);

  const allowanceTokens = useMemo(
    () => ethers.formatUnits(allowanceWei, tokenDecimals),
    [allowanceWei, tokenDecimals]
  );

  const buyCostEth = useMemo(() => {
    if (buyCostWei <= 0n) return "0";
    return Number(ethers.formatEther(buyCostWei)).toFixed(6);
  }, [buyCostWei]);

  const refreshMarketplaceData = useCallback(async () => {
    if (!canTransact) return;

    setIsRefreshing(true);
    try {
      const [balance, allowance, tokenPrice] = await Promise.all([
        erc20ContractInstance.balanceOf(selectedAccount),
        erc20ContractInstance.allowance(selectedAccount, MARKETPLACE_ADDRESS),
        tokenMarketplaceInstance.tokenPrice(),
      ]);

      setTokenBalanceWei(balance);
      setAllowanceWei(allowance);
      setTokenPriceWei(tokenPrice);
    } catch (error) {
      setTxStatus({
        type: "error",
        message: `Failed to refresh marketplace data: ${formatError(error)}`,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [canTransact, erc20ContractInstance, selectedAccount, tokenMarketplaceInstance]);

  useEffect(() => {
    const initializeContracts = async () => {
      if (!walletConnected || wrongNetwork) {
        setTokenMarketplaceInstance(null);
        setErc20ContractInstance(null);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const marketplace = new ethers.Contract(
          MARKETPLACE_ADDRESS,
          tokenMarketplaceAbi,
          signer
        );

        let resolvedTokenAddress = FALLBACK_TOKEN_ADDRESS;
        try {
          resolvedTokenAddress = await marketplace.gldToken();
        } catch {
          resolvedTokenAddress = FALLBACK_TOKEN_ADDRESS;
        }

        const erc20 = new ethers.Contract(resolvedTokenAddress, erc20Abi, signer);
        const decimals = Number(await erc20.decimals());

        setTokenMarketplaceInstance(marketplace);
        setErc20ContractInstance(erc20);
        setTokenAddress(resolvedTokenAddress);
        setTokenDecimals(decimals);
      } catch (error) {
        setTokenMarketplaceInstance(null);
        setErc20ContractInstance(null);
        setTxStatus({
          type: "error",
          message: `Unable to initialize contracts: ${formatError(error)}`,
        });
      }
    };

    initializeContracts();
  }, [walletConnected, wrongNetwork]);

  useEffect(() => {
    refreshMarketplaceData();
  }, [refreshMarketplaceData]);

  useEffect(() => {
    if (!canTransact) return undefined;
    const timer = setInterval(() => {
      refreshMarketplaceData();
    }, 20000);

    return () => clearInterval(timer);
  }, [canTransact, refreshMarketplaceData]);

  const handleBuyToken = async (event) => {
    event.preventDefault();

    if (!canTransact) return;
    if (!buyAmountWei || buyCostWei <= 0n) {
      setTxStatus({ type: "error", message: "Enter a valid token amount to buy." });
      return;
    }

    setIsTxPending(true);
    setTxStatus({ type: "pending", message: "Submitting buy transaction..." });

    try {
      const tx = await tokenMarketplaceInstance.buyGLDToken(buyAmountWei, {
        value: buyCostWei,
        gasLimit: 350000,
      });

      setTxStatus({ type: "pending", message: "Buy transaction submitted. Waiting for confirmation..." });
      await tx.wait();
      setTxStatus({ type: "success", message: "Token purchase successful." });
      setBuyAmount("");
      await refreshMarketplaceData();
    } catch (error) {
      setTxStatus({ type: "error", message: `Buy failed: ${formatError(error)}` });
    } finally {
      setIsTxPending(false);
    }
  };

  const handleSellToken = async (event) => {
    event.preventDefault();

    if (!canTransact) return;
    if (!sellAmountWei) {
      setTxStatus({ type: "error", message: "Enter a valid token amount to sell." });
      return;
    }

    setIsTxPending(true);

    try {
      const currentAllowance = await erc20ContractInstance.allowance(
        selectedAccount,
        MARKETPLACE_ADDRESS
      );

      if (currentAllowance < sellAmountWei) {
        setTxStatus({ type: "pending", message: "Approving token allowance..." });
        const approveTx = await erc20ContractInstance.approve(
          MARKETPLACE_ADDRESS,
          sellAmountWei
        );
        await approveTx.wait();
      }

      setTxStatus({ type: "pending", message: "Submitting sell transaction..." });
      const sellTx = await tokenMarketplaceInstance.sellGLDToken(sellAmountWei, {
        gasLimit: 350000,
      });
      await sellTx.wait();

      setTxStatus({ type: "success", message: "Token sell successful." });
      setSellAmount("");
      await refreshMarketplaceData();
    } catch (error) {
      setTxStatus({ type: "error", message: `Sell failed: ${formatError(error)}` });
    } finally {
      setIsTxPending(false);
    }
  };

  const statusClass =
    txStatus.type === "success"
      ? "bg-success/10 text-success border-success/30"
      : txStatus.type === "error"
        ? "bg-destructive/10 text-destructive border-destructive/30"
        : txStatus.type === "pending"
          ? "bg-accent/10 text-accent border-accent/30"
          : "bg-secondary text-secondary-foreground border-border";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-primary text-primary-foreground rounded-lg border border-primary/80 p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GLD Token Marketplace</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Buy and sell voting ecosystem tokens through the blockchain marketplace.
            </p>
          </div>
          <div className="text-sm space-y-1">
            <div>
              Wallet: <span className="font-semibold">{walletConnected ? formatAddress(selectedAccount) : "Not connected"}</span>
            </div>
            <div>
              Network: <span className="font-semibold">{chainId || "-"}</span>
              {EXPECTED_CHAIN_ID > 0 && (
                <span className="ml-2 text-primary-foreground/80">(expected {EXPECTED_CHAIN_ID})</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {!walletConnected && (
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-sm text-muted-foreground mb-3">
            Connect MetaMask to access token marketplace functionality.
          </p>
          <button
            onClick={handleWallet}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {walletConnected && wrongNetwork && (
        <div className="bg-destructive/10 text-destructive border border-destructive/30 rounded-lg p-4 text-sm">
          Wrong network detected. Please switch your wallet to chain ID {EXPECTED_CHAIN_ID}.
        </div>
      )}

      {txStatus.message && (
        <div className={`border rounded-lg p-4 text-sm ${statusClass}`}>
          <div className="flex items-center gap-2">
            {txStatus.type === "pending" && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            <span>{txStatus.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Token Balance</p>
          <p className="text-2xl font-bold text-card-foreground mt-2">{tokenBalance}</p>
          <p className="text-xs text-muted-foreground mt-1">GLD tokens</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Token Price</p>
          <p className="text-2xl font-bold text-card-foreground mt-2">{tokenPriceEth}</p>
          <p className="text-xs text-muted-foreground mt-1">ETH per GLD</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Allowance</p>
          <p className="text-2xl font-bold text-card-foreground mt-2">{allowanceTokens}</p>
          <p className="text-xs text-muted-foreground mt-1">Approved GLD for marketplace</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Buy GLD</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter token amount. ETH cost is calculated from current on-chain price.
          </p>

          <form className="mt-4 space-y-4" onSubmit={handleBuyToken}>
            <div className="space-y-1.5">
              <label htmlFor="buyAmount" className="text-sm font-medium text-card-foreground">
                Amount (GLD)
              </label>
              <input
                id="buyAmount"
                value={buyAmount}
                onChange={(event) => setBuyAmount(event.target.value)}
                placeholder="e.g. 10"
                className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="bg-secondary rounded-md p-3 text-sm text-secondary-foreground">
              Estimated Cost: <span className="font-semibold">{buyCostEth} ETH</span>
            </div>

            <button
              type="submit"
              disabled={!canTransact || isTxPending || !buyAmountWei || buyCostWei <= 0n}
              className="w-full bg-accent text-accent-foreground py-2.5 rounded-md font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isTxPending ? "Processing..." : "Buy Tokens"}
            </button>
          </form>
        </section>

        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-card-foreground">Sell GLD</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Selling will auto-approve marketplace allowance if required.
          </p>

          <form className="mt-4 space-y-4" onSubmit={handleSellToken}>
            <div className="space-y-1.5">
              <label htmlFor="sellAmount" className="text-sm font-medium text-card-foreground">
                Amount (GLD)
              </label>
              <input
                id="sellAmount"
                value={sellAmount}
                onChange={(event) => setSellAmount(event.target.value)}
                placeholder="e.g. 5"
                className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={!canTransact || isTxPending || !sellAmountWei}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isTxPending ? "Processing..." : "Sell Tokens"}
            </button>
          </form>
        </section>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground break-all">
          Marketplace: {MARKETPLACE_ADDRESS}
          <br />
          Token: {tokenAddress || FALLBACK_TOKEN_ADDRESS}
        </div>
        <button
          type="button"
          onClick={refreshMarketplaceData}
          disabled={!canTransact || isRefreshing || isTxPending}
          className="shrink-0 px-4 py-2 rounded-md border border-input text-sm font-medium bg-background hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
};

export default TokenMarketplace;
