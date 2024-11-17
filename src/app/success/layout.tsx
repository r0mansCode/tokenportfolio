import { SessionProviderWrapper } from "../components/session-provider-wrapper/session-provider-wrapper";

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
}
