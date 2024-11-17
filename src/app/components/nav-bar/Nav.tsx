import Link from "next/link";
import s from "./nav.module.scss";

export function NavBar() {
  return (
    <nav className={s.navContainer}>
      <Link href='/'>Home</Link>
      <Link href='/portfolio'>Portfolio</Link>
    </nav>
  );
}
