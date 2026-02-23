'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
} from '@helpdesk/shared/ui';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: {
    label: string;
    href: string;
    linkText: string;
  };
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        'w-full max-w-md border-slate-200/80 bg-white/80 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80',
        className,
      )}
    >
      <CardHeader className="space-y-2 text-center">
        <div className="bg-primary/10 text-primary mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
          </svg>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="flex justify-center border-t border-slate-200/80 pt-6 dark:border-slate-800">
          <p className="text-muted-foreground text-sm">
            {footer.label}{' '}
            <Link
              href={footer.href}
              className="text-primary font-medium underline-offset-4 transition-colors hover:underline"
            >
              {footer.linkText}
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
