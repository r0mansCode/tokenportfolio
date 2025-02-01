import s from "./main-page-banner.module.scss";

export const MainPageBanner = () => {
  return (
    <div className={s.bannerContainer}>
      <section>
      <h1>Token Portfolio</h1>
      <h2>Track your Crypto with confidence</h2>
      </section>
      <button>Get Started</button>
    </div>
  );
};
