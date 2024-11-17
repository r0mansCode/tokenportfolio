export const calculateROIs = (
  transactionHistory: any,
  tokenBalances: any,
  purchasePrices: any
) => {
  const roiMap: any = {};

  for (const transaction of transactionHistory) {
    const isSwap = transaction?.category === "token swap";

    if (!!transaction?.erc20Transfers[0] && isSwap) {
      const tokenSymbol = transaction?.erc20Transfers[0].tokenSymbol;
      const currentToken: any = tokenBalances.find(
        (token: any) => token.symbol === tokenSymbol
      );
      const currentPrice: any = !!currentToken && Number(currentToken.price);
      const historicalPrice = purchasePrices[tokenSymbol];
      const roi = ((currentPrice - historicalPrice) / historicalPrice) * 100;
      roiMap[tokenSymbol] = roi;
    }
  }

  return roiMap;
};
