"use client";

import AuthButtons from "./components/auth-buttons/auth-buttons";
import s from "./page.module.scss";
import Link from "next/link";

export default async function Home() {
  return (
    <div className={s.page}>
      <main className={s.main}>
        <div className={s.headerContainer}>
          <h1>Hello! This is &quot;Token Portfolio&quot;</h1>
          <Link className={s.mainPageLink} href='/portfolio'>
            Proceed To Portfolio Page
          </Link>
        </div>
        <section className={s.sectionContainer}>
          <AuthButtons />
        </section>
      </main>
    </div>
  );
}
