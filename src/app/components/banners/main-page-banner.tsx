import s from "./main-page-banner.module.scss";

export const MainPageBanner = () => {
  return (
    <div className={s.bannerContainer}>
      <h1>Token Portfolio</h1>
      <h2>Track your Crypto with confidence</h2>
      <button>Get Started</button>
    </div>
  );
};
