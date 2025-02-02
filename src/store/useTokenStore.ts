import { create } from "zustand";

export interface Token {
  name: string;
  symbol: string;
  balance: string;
  price: string | number;
  valueInUSD: number;
  logo?: string;
}

interface TokenStore {
  tokenBalances: Token[];
  setTokenBalances: (tokens: Token[], userId: number) => void;
  loadTokenBalances: (userId: number) => Promise<void>;
  defaultAccount: string;
  setDefaultAccount: (account: string) => void;
  totalPortfolioValue: number;
  setTotalPortfolioValue: (amount: number) => void;
  userBalance: number;
  setUserBalance: (value: number) => void;
  etherPriceInUSD: number;
  setEtherPriceInUSD: (amount: number) => void;
  rois: Record<string, number>;
  setROIs: (rois: Record<string, number>, userId: number) => Promise<void>;
  loadROIs: (userId: number) => Promise<void>;
  purchasePrices: Record<string, number>;
  setPurchasePrices: (
    price: Record<string, number>,
    userId: number
  ) => Promise<void>;
  loadPurchasePrices: (userId: number) => Promise<void>;
}

export const useTokenStore = create<TokenStore>((set) => ({
  tokenBalances: [],
  setTokenBalances: async (tokens, userId) => {
    await fetch("/api/token-balances", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, tokens }),
    });
    set({ tokenBalances: tokens });
  },

  loadTokenBalances: async (userId) => {
    const response = await fetch(`/api/token-balances?userId=${userId}`);
    const tokens = await response.json();
    set({ tokenBalances: tokens });
  },
  defaultAccount: "",
  setDefaultAccount: (account) => set({ defaultAccount: account }),
  totalPortfolioValue: 0,
  setTotalPortfolioValue: (amount) => set({ totalPortfolioValue: amount }),
  userBalance: 0,
  setUserBalance: (amount) => set({ userBalance: amount }),
  etherPriceInUSD: 0,
  setEtherPriceInUSD: (amount) => set({ etherPriceInUSD: amount }),
  rois: {},

  setROIs: async (rois, userId) => {
    await fetch("/api/roi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, rois }),
    });
    set({ rois });
  },

  loadROIs: async (userId) => {
    const response = await fetch(`/api/roi?userId=${userId}`);
    const storedROIs = await response.json();
    set({ rois: storedROIs });
  },
  purchasePrices: {},

  setPurchasePrices: async (purchasePrices, userId) => {
    await fetch("/api/purchase-price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, purchasePrices }),
    });
    set({ purchasePrices });
  },

  loadPurchasePrices: async (userId) => {
    const response = await fetch(`/api/purchase-price?userId=${userId}`);
    const storedPurchasePrices = await response.json();
    set({ purchasePrices: storedPurchasePrices });
  },
}));
