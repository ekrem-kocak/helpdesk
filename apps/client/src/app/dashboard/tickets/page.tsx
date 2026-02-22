'use client';

import { getColumns } from '@client/app/dashboard/tickets/columns';
import { CreateTicketDialog } from '@client/app/dashboard/tickets/create-ticket-dialog';
import { UserTicketsView } from '@client/app/dashboard/tickets/user-tickets-view';
import { DataTable } from '@client/components/data-table';
import { useTicketSearchParams } from '@client/hooks/use-ticket-search-params';
import { useMyTickets, useTickets } from '@client/hooks/use-tickets';
import { isUserRole } from '@client/lib/auth';
import type { TicketOrderBy } from '@client/lib/ticket-params';
import { useAuthStore } from '@client/store/auth.store';
import type { SortOrder } from '@helpdesk/shared/interfaces';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const LOADING_SPINNER = (
  <div className="flex items-center justify-center p-10">
    <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
  </div>
);

const ERROR_MSG = 'Failed to load tickets.';

export default function TicketsPage() {
  const user = useAuthStore((state) => state.user);
  const isUser = isUserRole(user);

  const [params, setParams] = useTicketSearchParams();
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const { tickets, meta, isLoading, isError, error } = useTickets({
    params: isUser ? null : params,
    enabled: !isUser,
  });

  const {
    tickets: myTickets,
    isLoading: myTicketsLoading,
    isError: myTicketsError,
    error: myTicketsErrorObj,
  } = useMyTickets({ enabled: isUser });

  const [localSearch, setLocalSearch] = useState(() => params.search ?? '');
  useEffect(() => {
    setLocalSearch(params.search ?? '');
  }, [params.search]);

  const commitSearchToUrl = useDebouncedCallback((value: string) => {
    setParams({ ...paramsRef.current, search: value, page: 1 });
  }, 400);

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      commitSearchToUrl(value);
    },
    [commitSearchToUrl],
  );

  const handlePageChange = useCallback(
    (pageIndex: number) => {
      setParams({ ...paramsRef.current, page: pageIndex + 1 });
    },
    [setParams],
  );

  const handleServerSort = useCallback(
    (orderBy: TicketOrderBy, order: SortOrder) => {
      setParams({ ...paramsRef.current, orderBy, order, page: 1 });
    },
    [setParams],
  );

  const sortState = useMemo(
    () =>
      params.orderBy && params.order
        ? { orderBy: params.orderBy, order: params.order }
        : undefined,
    [params.orderBy, params.order],
  );

  const columns = useMemo(
    () =>
      getColumns(user, {
        onServerSort: handleServerSort,
        sortState,
      }),
    [user, handleServerSort, sortState],
  );

  if (isUser) {
    if (myTicketsLoading) return LOADING_SPINNER;
    if (myTicketsError) {
      return (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-4">
          {ERROR_MSG}
          {myTicketsErrorObj instanceof Error && (
            <p className="mt-1 text-sm opacity-70">
              {myTicketsErrorObj.message}
            </p>
          )}
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-foreground text-lg font-semibold tracking-tight">
              My Tickets
            </h2>
            <p className="text-muted-foreground text-sm">
              View and manage your support tickets
            </p>
          </div>
          <CreateTicketDialog />
        </div>
        <UserTicketsView
          tickets={myTickets}
          searchPlaceholder="Search tickets..."
        />
      </div>
    );
  }

  if (isLoading) return LOADING_SPINNER;
  if (isError) {
    return (
      <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-4">
        {ERROR_MSG}
        {error instanceof Error && (
          <p className="mt-1 text-sm opacity-70">{error.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-lg font-semibold tracking-tight">
            All Tickets
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage all support tickets and create new ones
          </p>
        </div>
        <CreateTicketDialog />
      </div>
      <DataTable
        columns={columns}
        data={tickets}
        searchKey="title"
        searchPlaceholder="Search by title..."
        searchValue={localSearch}
        onSearchChange={handleSearchChange}
        serverSide
        pageCount={meta?.pageCount ?? 0}
        itemCount={meta?.itemCount ?? 0}
        pageIndex={(params.page ?? 1) - 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
