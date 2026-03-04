'use client';

import { getColumns } from './columns';
import { CreateTicketDialog } from './create-ticket-dialog';
import { UserTicketsView } from './user-tickets-view';
import { DataTable } from '../../../components/data-table';
import { useTicketSearchParams } from '../../../hooks/use-ticket-search-params';
import { useMyTickets, useTickets } from '../../../hooks/use-tickets';
import { isUserRole, canRestoreTicket } from '../../../lib/auth';
import { TicketOrderBy } from '../../../lib/ticket-params';
import { useAuthStore } from '../../../store/auth.store';
import type { SortOrder } from '@helpdesk/shared/interfaces';
import { Button } from '@helpdesk/shared/ui';
import { Loader2, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

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

  const showDeletedToggle = !isUser && canRestoreTicket(user);
  const isShowingDeleted = params.onlyDeleted === true;

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
        showDeletedAt: isShowingDeleted,
      }),
    [user, handleServerSort, sortState, isShowingDeleted],
  );

  const handleToggleShowDeleted = useCallback(() => {
    setParams({
      ...paramsRef.current,
      onlyDeleted: !isShowingDeleted,
      page: 1,
    });
  }, [isShowingDeleted, setParams]);

  if (isUser) {
    if (myTicketsLoading)
      return (
        <div className="flex items-center justify-center p-10">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      );
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
        <div className="flex items-center gap-3">
          {showDeletedToggle && (
            <Button
              type="button"
              variant={isShowingDeleted ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleToggleShowDeleted}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isShowingDeleted ? 'Showing deleted' : 'Show deleted'}
            </Button>
          )}
          {isLoading && (
            <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
          )}
          <CreateTicketDialog />
        </div>
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
