export function calculateTotalPortfolioValue(
  etherBalance: any,
  etherPrice: any,
  tokenBalances: any
) {
  let totalValue = 0;

  if (etherBalance && etherPrice) {
    totalValue += parseFloat(etherBalance) * parseFloat(etherPrice);
  }

  tokenBalances.forEach((token: any) => {
    if (token.valueInUSD) {
      totalValue += parseFloat(token.valueInUSD);
    }
  });

  return totalValue.toFixed(2);
}
