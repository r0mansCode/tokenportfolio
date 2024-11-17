import type { Metadata } from "next";
import s from "./page.module.scss";
import localFont from "next/font/local";
import "./globals.css";
import { NavBar } from "./components/nav-bar/Nav";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <NavBar />
        <div className={s.appContainer}>{children}</div>
      </body>
    </html>
  );
}
