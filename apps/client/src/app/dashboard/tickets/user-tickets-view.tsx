'use client';

import { useState, useMemo } from 'react';
import type { Ticket } from '@helpdesk/shared/interfaces';
import {
  Card,
  CardContent,
  CardHeader,
  Badge,
  Input,
} from '@helpdesk/shared/ui';
import { formatDate } from '../../../lib/format';
import { statusConfig, priorityConfig } from '../../../lib/tickets';
import { TicketIcon, Calendar, Search, Inbox } from 'lucide-react';

interface UserTicketsViewProps {
  tickets: Ticket[];
  searchPlaceholder?: string;
}

function useTicketSearch(tickets: Ticket[]) {
  const [search, setSearch] = useState('');

  const filteredTickets = useMemo(() => {
    if (!search.trim()) return tickets;
    const q = search.trim().toLowerCase();
    return tickets.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q),
    );
  }, [tickets, search]);

  return {
    search,
    setSearch,
    filteredTickets,
  };
}

export function UserTicketsView({
  tickets,
  searchPlaceholder = 'Search tickets...',
}: UserTicketsViewProps) {
  const { search, setSearch, filteredTickets } = useTicketSearch(tickets);

  if (tickets.length === 0) {
    return (
      <div className="border-muted-foreground/25 bg-muted/30 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center">
        <div className="bg-muted/50 rounded-full p-4">
          <Inbox className="text-muted-foreground h-10 w-10" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No tickets yet</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Your tickets will be listed here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-muted-foreground/20 bg-muted/30 placeholder:text-muted-foreground focus-visible:bg-background h-11 rounded-xl pl-10 transition-colors"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredTickets.map((ticket) => {
          const status = statusConfig[ticket.status];
          const priority = priorityConfig[ticket.priority];
          return (
            <Card
              key={ticket.id}
              className="group border-muted-foreground/10 bg-card/80 hover:border-primary/20 overflow-hidden rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <TicketIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 leading-tight font-semibold tracking-tight">
                      {ticket.title}
                    </h3>
                    <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`shrink-0 ${status.className}`}
                >
                  {status.label}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {ticket.description || 'No description'}
                </p>
                <div className="border-muted/50 mt-3 flex items-center justify-between border-t pt-3">
                  <span className={`text-xs font-medium ${priority.className}`}>
                    {priority.label}
                  </span>
                  <span className="text-muted-foreground font-mono text-xs">
                    #{ticket.id.slice(0, 8)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTickets.length === 0 && search.trim() && (
        <div className="text-muted-foreground py-8 text-center text-sm">
          &quot;{search}&quot; no matching tickets found.
        </div>
      )}
    </div>
  );
}
