"use client";

import { signOut } from "next-auth/react";

const SignOutButton = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }); // Redirect to homepage after sign-out
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
