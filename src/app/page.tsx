import styles from "./page.module.scss";
import Link from "next/link";

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Hello! This is &quot;Token Portfolio&quot;</h1>
        <Link className={styles.mainPageLink} href='/portfolio'>
          Proceed To Portfolio Page
        </Link>
      </main>
    </div>
  );
}
