"use client";

// ERC-20 ABI to interact with token contracts
const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

import React, { useState, useEffect } from "react";
import s from "./portfolio-page-inner.module.scss";
import { ethers } from "ethers";
import { calculateTotalPortfolioValue } from "@/utils/calculateTotalPortfolioValue";
import TokenItem from "./token-item/token-item";
import { truncateAddress } from "@/utils/truncate-address";
import { FaRegClipboard } from "react-icons/fa";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import PieChartComponent from "./pie-chart/pie-chart";
import Moralis from "moralis";
import RoiChart from "./roi-chart/roi-chart";
import { useSession } from "next-auth/react";
import AuthButtons from "../auth-buttons/auth-buttons";
import CheckoutButton from "../stripe-checkout-button/stripe-checkout-button";
import { initializeMoralis } from "@/lib/moralis";
import { getPurchasePrices } from "@/utils/get-purchase-price";
import { calculateROIs } from "@/utils/calculateROIs";
import { isBrave } from "@/utils/checkForBraveBrowser";
import { useTokenStore } from "@/store/useTokenStore";

export default function PortfolioPageInner() {
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [provider, setProvider] = useState<any>(null);
  const [walletTokens, setWalletTokens] = useState<any>(null);
  const [transactionHistory, setTransactionHistory] = useState<any>(null);

  const {
    tokenBalances,
    setTokenBalances,
    loadTokenBalances,
    defaultAccount,
    setDefaultAccount,
    totalPortfolioValue,
    setTotalPortfolioValue,
    userBalance,
    setUserBalance,
    etherPriceInUSD,
    setEtherPriceInUSD,
    rois,
    setROIs,
    loadROIs,
    purchasePrices,
    setPurchasePrices,
    loadPurchasePrices,
  } = useTokenStore();

  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userId = session?.user?.id;

  const updateROIs = async (newROIs: Record<string, number>, userId) => {
    await setROIs(newROIs, userId);
  };

  const updatePurchaseOrices = async (
    newPurchasePrices: Record<string, number>,
    userId
  ) => {
    await setPurchasePrices(newPurchasePrices, userId);
  };

  useEffect(() => {
    initializeMoralis();
  }, []);

  useEffect(() => {
    if (userId) {
      loadTokenBalances(userId);
      loadROIs(userId);
      loadPurchasePrices(userId);
    }
  }, [userId]);

  const fetchTransactionHistory = async (account: any) => {
    try {
      const response = await Moralis.EvmApi.wallets.getWalletHistory({
        chain: "0x1",
        order: "DESC",
        address: account,
      });

      setTransactionHistory(response.result);
    } catch (e) {
      console.error(e);
    }
  };

  async function fetchTokenBalances(walletAddress: string) {
    try {
      const response = await fetch(
        `/api/getTokenBalances?address=${walletAddress}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setWalletTokens(data);
    } catch (e) {
      console.error(e);
    }
  }

  const fetchPurchasePrices = async (transactionHistory) => {
    const prices = await getPurchasePrices(transactionHistory);
    updatePurchaseOrices(prices, userId);
  };

  const connectWalletHandler = () => {
    if (window.ethereum && !!window.ethereum.request && !defaultAccount) {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setConnButtonText("Wallet Connected");
          setDefaultAccount(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else if (!window.ethereum) {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const handleWalletConnectClick = async () => {
    connectWalletHandler();
  };

  const fetchEtherPrice = async () => {
    try {
      const response = await fetch("/api/price");
      const data = await response.json();
      setEtherPriceInUSD(data.ethereum.usd);
    } catch (error) {
      setErrorMessage("Failed to fetch Ether price.");
    }
  };

  useEffect(() => {
    fetchEtherPrice();
  }, []);

  const fetchAvailableAssets = async (
    account: any,
    provider: any,
    userId: number
  ) => {
    try {
      const tokenData = await Promise.all(
        walletTokens.map(async (token: any) => {
          try {
            if (!token?.verified_contract) {
              return;
            }
            const tokenContract = new ethers.Contract(
              token.token_address,
              ERC20_ABI,
              provider
            );
            const balance = await tokenContract.balanceOf(account);
            const decimals = await tokenContract.decimals();
            const formattedBalance = ethers.utils.formatUnits(
              balance,
              decimals
            );

            let price: any = "N/A";
            const priceResponse = await Moralis.EvmApi.token.getTokenPrice({
              chain: "0x1",
              address: token.token_address,
            });
            const priceData: any = priceResponse.result;
            price = priceData.usdPriceFormatted ?? "N/A";

            const formattedValueInUSD =
              price !== "N/A" ? parseFloat(formattedBalance) * price : "N/A";

            return {
              name: token.name,
              symbol: token.symbol,
              balance: formattedBalance,
              price,
              valueInUSD: formattedValueInUSD,
              logo: token.logo,
            };
          } catch (error) {
            console.error(
              `Failed to fetch balance for token: ${token.symbol}`,
              error
            );
            return null;
          }
        })
      );

      if (!!userBalance) {
        const ethBalanceData = {
          name: "Ethereum",
          symbol: "ETH",
          balance: Number(userBalance),
          price: etherPriceInUSD,
          valueInUSD: Number(userBalance) * etherPriceInUSD,
        };

        const nonZeroTokens = tokenData.filter(
          (token) => token && parseFloat(token.balance) > 0
        );
        setTokenBalances([...nonZeroTokens, ethBalanceData], userId);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch assets using MetaMask.");
    }
  };

  useEffect(() => {
    if (!!defaultAccount && provider && !!walletTokens) {
      provider.getBalance(defaultAccount).then((balanceResult: any) => {
        const formattedEtherBalance = Number(
          ethers.utils.formatEther(balanceResult)
        );
        setUserBalance(formattedEtherBalance);
      });
    }
  }, [defaultAccount, provider, walletTokens]);

  useEffect(() => {
    if (
      !!userBalance &&
      tokenBalances.length < 1 &&
      !!defaultAccount &&
      provider &&
      !!userId
    ) {
      fetchAvailableAssets(defaultAccount, provider, userId);
    }
  }, [userBalance, defaultAccount, provider, tokenBalances, userId]);

  useEffect(() => {
    if (tokenBalances.length > 0 && etherPriceInUSD > 0 && userBalance) {
      const totalValue: any = calculateTotalPortfolioValue(
        userBalance,
        etherPriceInUSD,
        tokenBalances
      );
      setTotalPortfolioValue(totalValue);
    }
  }, [tokenBalances, etherPriceInUSD, userBalance]);

  useEffect(() => {
    if (!!defaultAccount) {
      fetchTokenBalances(defaultAccount);
    }
  }, [defaultAccount]);

  useEffect(() => {
    if (tokenBalances.length > 0 && !!defaultAccount) {
      fetchTransactionHistory(defaultAccount);
    }
  }, [tokenBalances, defaultAccount]);

  useEffect(() => {
    if (!!transactionHistory) {
      fetchPurchasePrices(transactionHistory);
    }
  }, [transactionHistory]);

  useEffect(() => {
    if (
      !!transactionHistory &&
      !!tokenBalances &&
      !!purchasePrices &&
      !!userId
    ) {
      const ROIs = calculateROIs(
        transactionHistory,
        tokenBalances,
        purchasePrices
      );
      console.log("ROIs", ROIs);
      updateROIs(ROIs, userId);
    }
  }, [transactionHistory, tokenBalances, purchasePrices, userId]);

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail }), // Pass userEmail in the body
      });

      if (response.ok) {
        alert("Your subscription has been canceled.");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Something went wrong"}`);
      }
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <AuthButtons />
      <div className={s.checkoutButtonsContainer}>
        {!session?.user?.subscribed && <CheckoutButton />}
        {session?.user?.subscribed && (
          <button onClick={handleCancelSubscription}>
            Cancel Subscription
          </button>
        )}
      </div>
      {session && session?.user?.subscribed && (
        <div className={s.container}>
          {/* <div className={s.connectWalletRow}>
            <button className={s.button} onClick={handleWalletConnectClick}>
              {connButtonText}
            </button>
            {isBrave() && (
              <div className={s.infoIcon}>
                ?
                <div className={s.infoText}>
                  Using Brave? You may face issues connecting MetaMask. Follow
                  these
                  <a
                    href="https://support.metamask.io/configure/wallet/using-metamask-wallet-in-brave-browser/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    instructions
                  </a>{" "}
                  to resolve it.
                </div>
              </div>
            )}
          </div> */}
          <div className={s.section}>
            <h3>
              Address:{" "}
              {defaultAccount ? truncateAddress(defaultAccount) : "N/A"}
              {defaultAccount && (
                <span
                  className={s.clipboardIcon}
                  onClick={() => copyToClipboard(defaultAccount)}
                >
                  <FaRegClipboard />
                </span>
              )}
            </h3>
          </div>
          <div className={s.section}>
            <h3>Total Portfolio Value: ${totalPortfolioValue}</h3>
          </div>
          <div className={s.section}>
            <h3>
              Ether Balance: {userBalance}
              {etherPriceInUSD > 0 && userBalance && (
                <> (~${(userBalance * etherPriceInUSD).toFixed(2)} USD)</>
              )}
            </h3>
          </div>
          <div className={s.tokenSection}>
            <h3>Tokens:</h3>
            {tokenBalances.length > 0 && (
              <>
                {tokenBalances.map((token: any, index: number) => (
                  <TokenItem
                    key={index}
                    token={token}
                    purchasePrice={purchasePrices[token.symbol] || null}
                    roi={rois[token.symbol] || null}
                  />
                ))}
                <PieChartComponent tokenBalances={tokenBalances} />
                {!!rois && <RoiChart rawData={rois} />}
                {!rois && <div>ROIs not calculated</div>}
              </>
            )}
            {tokenBalances.length < 1 && <p>No tokens found</p>}
          </div>
          {errorMessage && <p className={s.error}>{errorMessage}</p>}
        </div>
      )}
    </>
  );
}
