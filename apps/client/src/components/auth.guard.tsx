'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@client/store/auth.store';
import { tryRefresh } from '@client/lib/auth-client';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const refreshAttempted = useRef(false);

  useEffect(() => {
    if (accessToken) return;

    if (refreshAttempted.current) return;
    refreshAttempted.current = true;

    tryRefresh().then((token) => {
      if (token) setAccessToken(token);
      else router.replace('/auth/login');
    });
  }, [accessToken, setAccessToken, router]);

  if (accessToken) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
