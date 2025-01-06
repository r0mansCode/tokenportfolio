"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import s from "./auth-buttons.module.scss";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div className={s.authContainer}>
        <p>You need to sign in to view this page.</p>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <>
      <p>Welcome, {session.user?.name}</p>
      {session?.user?.subscribed ? (
        <p>You are subscribed to the token portfolio product.</p>
      ) : (
        <p>You are not subscribed.</p>
      )}
      <button onClick={() => signOut()}>Sign out</button>
    </>
  );
}
