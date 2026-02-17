'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthGuard from '@client/components/auth.guard';
import { ThemeToggle } from '@client/components/theme-toggle';
import { useAuthStore } from '@client/store/auth.store';
import {
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Ticket,
  ChevronRight,
  Headset,
} from 'lucide-react';
import {
  cn,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@helpdesk/shared/ui';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/tickets', label: 'Tickets', icon: Ticket },
];

function getPageTitle(pathname: string): string {
  const item = menuItems.find((m) => m.href === pathname);
  return item?.label ?? 'Dashboard';
}

function getUserInitials(email?: string): string {
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* ─── SIDEBAR ─── */}
        <aside className="border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r">
          {/* Logo */}
          <div className="border-sidebar-border flex h-14 items-center gap-2 border-b px-5">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <Headset className="h-4 w-4" />
            </div>
            <span className="text-sidebar-foreground text-lg font-semibold tracking-tight">
              HelpDesk
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            <p className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wider uppercase">
              Menu
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        isActive &&
                          'bg-sidebar-accent text-sidebar-accent-foreground',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-sidebar-primary'
                            : 'text-muted-foreground group-hover:text-sidebar-accent-foreground',
                        )}
                      />
                      <span>{item.label}</span>
                      {isActive && (
                        <ChevronRight className="text-sidebar-primary ml-auto h-4 w-4" />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-sidebar-border border-t p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-sidebar-accent flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getUserInitials(user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sidebar-foreground truncate text-sm font-medium">
                      {user?.email}
                    </p>
                    <p className="text-muted-foreground truncate text-xs capitalize">
                      {user?.role}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-muted-foreground text-xs capitalize">
                      {user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <div className="ml-64 flex flex-1 flex-col">
          {/* Top bar */}
          <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center justify-between border-b px-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <h1 className="text-foreground text-lg font-semibold">
                {getPageTitle(pathname)}
              </h1>
            </div>

            <ThemeToggle />
          </header>

          {/* Page content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
