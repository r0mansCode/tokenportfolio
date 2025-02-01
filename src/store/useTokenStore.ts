import { create } from "zustand";

// interface Token {
//   name: string;
//   symbol: string;
//   balance: string;
//   price: string | number;
//   valueInUSD: string | number;
// }

interface TokenStore {
  tokenBalances: any[];
  setTokenBalances: (tokens: any[]) => void;
  defaultAccount: string;
  setDefaultAccount: (account: string) => void;
  totalPortfolioValue: number;
  setTotalPortfolioValue: (amount: number) => void;
  userBalance: number;
  setUserBalance: (value: number) => void;
  etherPriceInUSD: number;
  setEtherPriceInUSD: (amount: number) => void;
}

export const useTokenStore = create<TokenStore>((set) => ({
  tokenBalances: [],
  setTokenBalances: (tokens) => set({ tokenBalances: tokens }),
  defaultAccount: '',
  setDefaultAccount: (account) => set({ defaultAccount: account }),
  totalPortfolioValue: 0,
  setTotalPortfolioValue: (amount) => set({ totalPortfolioValue: amount }),
  userBalance: 0,
  setUserBalance: (amount) => set({ userBalance: amount }),
  etherPriceInUSD: 0,
  setEtherPriceInUSD: (amount) => set({ etherPriceInUSD: amount }),
}));
