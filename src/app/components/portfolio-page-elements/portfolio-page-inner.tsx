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

export default function PortfolioPageInner() {
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [defaultAccount, setDefaultAccount] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [tokenBalances, setTokenBalances] = useState<any>([]);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [provider, setProvider] = useState<any>(null);
  const [etherPriceInUSD, setEtherPriceInUSD] = useState(0); // Ether price in USD
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0); // Total portfolio value
  const [purchasePrices, setPurchasePrices] = useState<any>({}); // Store purchase prices
  const [rois, setROIs] = useState<any>({}); // Store ROIs
  const [walletTokens, setWalletTokens] = useState<any>(null);
  const [transactionHistory, setTransactionHistory] = useState<any>(null);

  const { data: session } = useSession();

  useEffect(() => {
    initializeMoralis();
  }, []);

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
    setPurchasePrices(prices);
  };

  const connectWalletHandler = () => {
    if (
      window.ethereum &&
      !!window.ethereum.request &&
      defaultAccount == null
    ) {
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

  const fetchAvailableAssets = async (account: any, provider: any) => {
    try {
      const tokenData = await Promise.all(
        walletTokens.map(async (token: any) => {
          try {
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

        setTokenBalances([...nonZeroTokens, ethBalanceData]);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch assets using MetaMask.");
    }
  };

  useEffect(() => {
    if (defaultAccount && provider && !!walletTokens) {
      provider.getBalance(defaultAccount).then((balanceResult: any) => {
        const formattedEtherBalance = ethers.utils.formatEther(balanceResult);
        setUserBalance(formattedEtherBalance);
      });
    }
  }, [defaultAccount, provider, walletTokens]);

  useEffect(() => {
    if (userBalance && tokenBalances.length < 1 && defaultAccount && provider) {
      fetchAvailableAssets(defaultAccount, provider);
    }
  }, [userBalance, defaultAccount, provider, tokenBalances]);

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
    if (tokenBalances.length > 0 && defaultAccount) {
      fetchTransactionHistory(defaultAccount);
    }
  }, [tokenBalances, defaultAccount]);

  useEffect(() => {
    if (!!transactionHistory) {
      fetchPurchasePrices(transactionHistory);
    }
  }, [transactionHistory]);

  useEffect(() => {
    if (!!transactionHistory && !!tokenBalances && !!purchasePrices) {
      const ROIs = calculateROIs(
        transactionHistory,
        tokenBalances,
        purchasePrices
      );
      setROIs(ROIs);
    }
  }, [transactionHistory, tokenBalances, purchasePrices]);

  const userEmail = session?.user?.email;

  const handleCancelSubscription = async () => {
    await fetch("/api/cancel-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail }), // Pass userEmail in the body
    });
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
      {session && (
        <div className={s.container}>
          <button className={s.button} onClick={handleWalletConnectClick}>
            {connButtonText}
          </button>
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
                    name={token.name}
                    symbol={token.symbol}
                    balance={token.balance}
                    price={token.price}
                    valueInUSD={token.valueInUSD}
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
