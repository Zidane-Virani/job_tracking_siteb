import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Use same-origin auth endpoint to avoid localhost port/env mismatches in dev.
  fetchOptions: {
    throw: false,
  },
});

export const { signIn, signUp, useSession, signOut } = authClient;
