import s from "./portfolio-page.module.scss";

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={s.portfolioPageContainer}>{children}</div>;
}
