
'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';

export default function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();

    useEffect(() => {
      if (!isUserLoading && !user) {
        router.replace('/login');
      }

      if (!isUserLoading && user && firestore) {
        const userRef = doc(firestore, 'users', user.uid);
        getDoc(userRef).then((docSnap) => {
          if (!docSnap.exists()) {
            // User is new, create a document for them.
            const dobString = localStorage.getItem(`temp_user_dob_${user.uid}`);
            const dob = dobString ? new Date(dobString) : new Date(); // Fallback
            localStorage.removeItem(`temp_user_dob_${user.uid}`);

            const formattedDob = format(dob, 'yyyyMMdd');
            const userFirstLetter = (user.displayName || 'X').charAt(0).toUpperCase();
            
            const riId = `R${formattedDob}${userFirstLetter}T`;

            setDoc(userRef, {
              id: user.uid,
              riId: riId,
              fullName: user.displayName || 'New User',
              email: user.email,
              dateOfBirth: dob.toISOString(),
              targetExam: 'Both', // Default value
              profilePhoto: user.photoURL,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            });
          } else {
             // User exists, update last login
             updateDoc(userRef, { lastLogin: new Date().toISOString() });
          }
        });
      }
    }, [user, isUserLoading, router, firestore]);

    if (isUserLoading || !user) {
      return (
        <div className="flex h-screen items-center justify-center bg-background">
          <p className="text-muted-foreground animate-pulse">Authenticating...</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
