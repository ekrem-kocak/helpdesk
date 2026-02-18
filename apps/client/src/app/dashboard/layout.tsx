'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthGuard from '@client/components/auth.guard';
import { ThemeToggle } from '@client/components/theme-toggle';
import { useAuthStore } from '@client/store/auth.store';
import { LAYOUT, TRANSITIONS } from '@client/lib/constants';
import {
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Ticket,
  ChevronRight,
  Headset,
  Menu,
  PanelLeftClose,
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
  Button,
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const sidebarWidth = isDesktopCollapsed
    ? LAYOUT.SIDEBAR_COLLAPSED_WIDTH
    : LAYOUT.SIDEBAR_WIDTH_EXPANDED;

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        <aside
          className={cn(
            'border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all',
            TRANSITIONS.SIDEBAR,
            sidebarWidth,
            'lg:translate-x-0',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div
            className={cn(
              'border-sidebar-border flex items-center justify-between border-b px-4',
              LAYOUT.HEADER_HEIGHT,
            )}
          >
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Headset className="h-4 w-4" />
              </div>

              {!isDesktopCollapsed && (
                <span className="text-sidebar-foreground text-lg font-semibold tracking-tight">
                  HelpDesk
                </span>
              )}
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {!isDesktopCollapsed && (
              <p className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wider uppercase">
                Menu
              </p>
            )}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        isActive &&
                          'bg-sidebar-accent text-sidebar-accent-foreground',
                        isDesktopCollapsed && 'justify-center',
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
                      {!isDesktopCollapsed && (
                        <>
                          <span>{item.label}</span>
                          {isActive && (
                            <ChevronRight className="text-sidebar-primary ml-auto h-4 w-4" />
                          )}
                        </>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isDesktopCollapsed && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          <div className="border-sidebar-border hidden border-t px-2 py-2 lg:block">
            <button
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              className={cn(
                'hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-accent-foreground flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                isDesktopCollapsed && 'justify-center',
              )}
            >
              {isDesktopCollapsed ? (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  <PanelLeftClose className="h-3.5 w-3.5" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>

          <div className="border-sidebar-border border-t p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'hover:bg-sidebar-accent flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors',
                    isDesktopCollapsed && 'justify-center px-0',
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getUserInitials(user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  {!isDesktopCollapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="text-sidebar-foreground truncate text-sm font-medium">
                        {user?.email}
                      </p>
                      <p className="text-muted-foreground truncate text-xs capitalize">
                        {user?.role}
                      </p>
                    </div>
                  )}
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

        <div
          className={cn(
            'flex flex-1 flex-col transition-all',
            TRANSITIONS.SIDEBAR,
            `lg:${LAYOUT.CONTENT_MARGIN_EXPANDED}`,
            isDesktopCollapsed && `lg:${LAYOUT.CONTENT_MARGIN_COLLAPSED}`,
          )}
        >
          <header
            className={cn(
              'bg-background/80 sticky top-0 z-30 flex items-center justify-between border-b px-4 backdrop-blur-sm sm:px-6',
              LAYOUT.HEADER_HEIGHT,
            )}
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <h1 className="text-foreground text-base font-semibold sm:text-lg">
                {getPageTitle(pathname)}
              </h1>
            </div>

            <ThemeToggle />
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
