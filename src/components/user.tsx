"use client";
import { useSession, signOut } from "next-auth/react";
import React from "react";

const User = () => {
  const { data: session } = useSession();
  return (
    <div>
      {session ? (
        <div>
          <h1>Welcome {session.user.email}</h1>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <div>
          <h1>Welcome Guest</h1>
        </div>
      )}
    </div>
  );
};

export default User;
