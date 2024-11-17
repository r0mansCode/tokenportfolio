import Moralis from "moralis";

export const getPurchasePrices = async (transactionHistory: any) => {
  const purchasePriceMap: any = {};

  for (const transaction of transactionHistory) {
    const isSwap = transaction?.category === "token swap";

    if (!!transaction?.erc20Transfers[0] && isSwap) {
      const tokenSymbol = transaction?.erc20Transfers[0].tokenSymbol;

      if (tokenSymbol) {
        const tokenAddress = transaction?.erc20Transfers[0].address._value;
        const blockNumber = transaction.blockNumber;

        const historicalPriceObject = await Moralis.EvmApi.token.getTokenPrice({
          chain: "0x1",
          include: "percent_change",
          address: tokenAddress,
          toBlock: blockNumber,
        });

        const historicalPrice = historicalPriceObject.result.usdPrice;
        purchasePriceMap[tokenSymbol] = historicalPrice;
      }
    }
  }

  return purchasePriceMap;
};
