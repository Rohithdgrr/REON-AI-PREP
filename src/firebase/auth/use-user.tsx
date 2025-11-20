'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, Auth } from 'firebase/auth';
import { useAuth as useFirebaseAuth } from '@/firebase/provider'; // Use a specific alias to avoid naming conflict

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * Custom hook to get the current authenticated user from Firebase.
 * It provides the user object, loading state, and any authentication errors.
 *
 * This hook is designed to be used within components that are descendants of
 * a FirebaseProvider, ensuring that the Firebase Auth instance is available.
 *
 * @returns {UserHookResult} An object containing the user, loading state, and error.
 */
export function useUser(): UserHookResult {
  const auth = useFirebaseAuth(); // Get the Auth instance from the context

  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isUserLoading, setIsLoading] = useState(true);
  const [userError, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If auth instance isn't available, we can't determine auth state.
    if (!auth) {
      setIsLoading(false);
      setUser(null);
      setError(new Error("Firebase Auth instance is not available. Ensure you're using FirebaseProvider."));
      return;
    }

    // Reset state for a new auth instance
    setIsLoading(true);
    setError(null);
    
    // Subscribe to auth state changes.
    // onAuthStateChanged returns an unsubscribe function.
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        // This callback runs whenever the auth state changes.
        setUser(firebaseUser); // This will be the user object on login, or null on logout.
        setIsLoading(false); // Auth state is now determined.
      },
      (error) => {
        // This callback runs if there's an error with the listener itself.
        console.error("useUser: onAuthStateChanged error:", error);
        setError(error);
        setIsLoading(false);
        setUser(null);
      }
    );

    // Return the unsubscribe function to be called on component unmount.
    // This prevents memory leaks.
    return () => unsubscribe();

  }, [auth]); // The effect re-runs only if the auth instance itself changes.

  return { user, isUserLoading, userError };
}
