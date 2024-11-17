import PortfolioPageInner from "../components/portfolio-page-elements/portfolio-page-inner";
import { SessionProviderWrapper } from "../components/session-provider-wrapper/session-provider-wrapper";

export default async function PortfolioPage() {
  return (
    <>
      <h4> Connection to MetaMask using ethers.js </h4>
      <SessionProviderWrapper>
        <PortfolioPageInner />
      </SessionProviderWrapper>
    </>
  );
}
