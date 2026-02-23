import { AuthSessionCheck } from '@client/components/auth-session-check';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20"
        aria-hidden
      >
        <div className="bg-primary/20 absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/15 absolute -right-40 -bottom-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      </div>
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <AuthSessionCheck>{children}</AuthSessionCheck>
      </div>
    </div>
  );
}
