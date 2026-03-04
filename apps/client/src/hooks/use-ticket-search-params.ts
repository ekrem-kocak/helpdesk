'use client';

import {
  useQueryStates,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs';
import { useMemo } from 'react';
import { TicketListParams, TicketOrderBy } from '../lib/ticket-params';
import { TICKET_ORDER_BY } from '../lib/ticket-params';
import { Priority, SortOrder, Status } from '@helpdesk/shared/interfaces';

const ticketSearchParsers = {
  page: parseAsInteger.withDefault(1),
  take: parseAsInteger.withDefault(10),
  order: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
  orderBy: parseAsStringLiteral(TICKET_ORDER_BY).withDefault(
    'createdAt' as TicketOrderBy,
  ),
  search: parseAsString.withDefault(''),
  status: parseAsString.withDefault(''),
  priority: parseAsString.withDefault(''),
  onlyDeleted: parseAsBoolean.withDefault(false),
};

function toTicketListParams(raw: {
  page: number;
  take: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  status: string;
  priority: string;
  onlyDeleted: boolean;
}): TicketListParams {
  return {
    page: raw.page,
    take: raw.take,
    order:
      raw.order === 'asc'
        ? SortOrder.ASC
        : raw.order === 'desc'
          ? SortOrder.DESC
          : undefined,
    orderBy: raw.orderBy as TicketOrderBy,
    search: raw.search || undefined,
    status: Object.values(Status).includes(raw.status as Status)
      ? (raw.status as Status)
      : undefined,
    priority: Object.values(Priority).includes(raw.priority as Priority)
      ? (raw.priority as Priority)
      : undefined,
    onlyDeleted: raw.onlyDeleted || undefined,
  };
}

export function useTicketSearchParams() {
  const [raw, setRaw] = useQueryStates(ticketSearchParsers);
  const params = useMemo(() => toTicketListParams(raw), [raw]);
  return [params, setRaw] as const;
}
