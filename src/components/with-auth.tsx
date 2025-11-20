
'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
            setDoc(userRef, {
              id: user.uid,
              riId: `RI-${user.uid.slice(0, 4).toUpperCase()}`,
              fullName: user.displayName || 'New User',
              email: user.email,
              targetExam: 'Both', // Default value
              profilePhoto: user.photoURL,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            });
          } else {
             // User exists, update last login
             setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
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
