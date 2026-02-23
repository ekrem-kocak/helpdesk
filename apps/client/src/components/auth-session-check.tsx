'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@client/store/auth.store';
import { tryRefresh } from '@client/lib/auth-client';
import { Loader2 } from 'lucide-react';

export function AuthSessionCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [isChecking, setIsChecking] = useState(true);
  const checkAttempted = useRef(false);

  useEffect(() => {
    if (accessToken) {
      router.replace('/dashboard');
      return;
    }

    if (checkAttempted.current) {
      setIsChecking(false);
      return;
    }
    checkAttempted.current = true;

    tryRefresh().then((token) => {
      if (token) {
        setAccessToken(token);
        router.replace('/dashboard');
      } else {
        setIsChecking(false);
      }
    });
  }, [accessToken, setAccessToken, router]);

  if (accessToken || isChecking) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        <span className="sr-only">Checking session...</span>
      </div>
    );
  }

  return <>{children}</>;
}
