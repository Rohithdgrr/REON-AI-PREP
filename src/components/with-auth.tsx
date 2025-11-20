
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export default function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isUserLoading && !user) {
        router.replace('/login');
      }
    }, [user, isUserLoading, router]);

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

    