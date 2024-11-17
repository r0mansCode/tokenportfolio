"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Update import

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    console.log("refresh");
    async function refreshSession() {
      await fetch("/api/auth/refresh-session");
      router.refresh(); // Use refresh() instead of reload()
    }

    refreshSession();
  }, []);

  return (
    <div>
      <h1>Subscription Success!</h1>
      <p>Your subscription status is now updated.</p>
    </div>
  );
}
