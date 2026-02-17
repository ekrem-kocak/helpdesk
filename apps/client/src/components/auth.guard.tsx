import { useRouter } from 'next/navigation';
import { useAuthStore } from '@client/store/auth.store';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, accessToken, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return; // Hydration tamamlanana kadar bekle

    if (!isAuthenticated || !accessToken) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, accessToken, _hasHydrated, router]);

  // Hydration henüz tamamlanmadıysa veya auth kontrolü yapılıyorsa loading göster
  if (!_hasHydrated || (!isAuthenticated && !accessToken)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Hydration tamamlandı ama authenticated değilse (redirect beklenirken) loading göster
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="sr-only">Redirecting...</span>
      </div>
    );
  }

  return <>{children}</>;
}
