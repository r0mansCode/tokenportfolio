"use client";

import AuthButtons from "./components/auth-buttons/auth-buttons";
import { MainPageBanner } from "./components/banners/main-page-banner";
import s from "./page.module.scss";
import Link from "next/link";

export default function Home() {
  return (
    <div className={s.page}>
      <main className={s.mainContainer}>
        {/* <div className={s.headerContainer}>
          <h1>Hello! This is &quot;Token Portfolio&quot;</h1>
          <Link className={s.mainPageLink} href='/portfolio'>
            Proceed To Portfolio Page
          </Link>
        </div>
        <section className={s.sectionContainer}>
          <AuthButtons />
        </section> */}
        <div className={s.mainBannerWrapper}>
          <MainPageBanner />
        </div>
      </main>
    </div>
  );
}
