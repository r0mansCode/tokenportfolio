import Image from "next/image";
import styles from "./page.module.scss";
import AuthButtons from "./components/auth-buttons/auth-buttons";
import { SessionProviderWrapper } from "./components/session-provider-wrapper/session-provider-wrapper";
import Link from "next/link";

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Hello! This is "Token Portfolio"</h1>
        <Link className={styles.mainPageLink} href='/portfolio'>
          Proceed To Portfolio Page
        </Link>
      </main>
    </div>
  );
}
