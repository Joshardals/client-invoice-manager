"use client";

import { signOut } from "next-auth/react";
import { useCallback, useTransition } from "react";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = useCallback(() => {
    startTransition(() => {
      signOut({ callbackUrl: "/login" }); // Redirect to homepage after sign-out
    });
  }, []);

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
      Sign Out
    </button>
  );
}
