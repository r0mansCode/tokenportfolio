import Link from "next/link";
import s from "./nav.module.scss";

export function NavBar({
  customClassName,
}: {customClassName?: string}) {
  return (
    <nav className={`${s.navContainer} ${customClassName}`}>
      <Link href='/'>Home</Link>
      <Link href='/portfolio'>Portfolio</Link>
    </nav>
  );
}
