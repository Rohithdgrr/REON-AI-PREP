
'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { getAdditionalUserInfo } from 'firebase/auth';

export default function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();

    useEffect(() => {
      // Wait until the loading is definitively complete.
      if (isUserLoading) {
        return; // Do nothing while Firebase is checking auth state.
      }

      // If loading is done and there's no user, redirect to login.
      if (!user) {
        router.replace('/login');
        return;
      }
      
      // If we have a user and firestore instance, proceed with DB operations.
      if (user && firestore) {
        const userRef = doc(firestore, 'users', user.uid);
        getDoc(userRef).then((docSnap) => {
          const isNewUser = localStorage.getItem(`is_new_user_${user.uid}`) === 'true';

          if (!docSnap.exists()) {
            localStorage.setItem(`is_new_user_${user.uid}`, 'true');

            // User is new, create a document for them.
            const dobString = localStorage.getItem(`temp_user_dob_${user.uid}`);
            const examString = localStorage.getItem(`temp_user_exam_${user.uid}`);
            const dob = dobString ? new Date(dobString) : new Date(new Date().setFullYear(new Date().getFullYear() - 18)); // Default to 18 years ago
            
            localStorage.removeItem(`temp_user_dob_${user.uid}`);
            localStorage.removeItem(`temp_user_exam_${user.uid}`);

            const formattedDob = format(dob, 'yyyyMMdd');
            const userFirstLetter = (user.displayName || 'X').charAt(0).toUpperCase();
            
            const riId = `R${formattedDob}${userFirstLetter}T`;

            setDoc(userRef, {
              id: user.uid,
              riId: riId,
              fullName: user.displayName || 'New User',
              email: user.email,
              dateOfBirth: dobString ? dob.toISOString() : null, // Store null if DOB not provided
              targetExam: examString || 'Both',
              profilePhoto: user.photoURL,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            }).then(() => {
                if (!dobString) { // If DOB was not set (e.g., Google sign-in)
                    router.replace('/dashboard/settings');
                }
            });
          } else {
             // User exists, update last login
             updateDoc(userRef, { lastLogin: new Date().toISOString() });
             if (isNewUser) {
                localStorage.removeItem(`is_new_user_${user.uid}`);
                if (!docSnap.data().dateOfBirth) {
                    router.replace('/dashboard/settings');
                }
             }
          }
        });
      }
    }, [user, isUserLoading, router, firestore]);

    if (isUserLoading || !user) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
