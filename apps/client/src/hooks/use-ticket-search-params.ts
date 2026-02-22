'use client';

import {
  useQueryStates,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs';
import { useMemo } from 'react';
import type {
  TicketListParams,
  TicketOrderBy,
} from '@client/lib/ticket-params';
import { TICKET_ORDER_BY } from '@client/lib/ticket-params';
import { Priority, Status } from '@helpdesk/shared/interfaces';

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
};

function toTicketListParams(raw: {
  page: number;
  take: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  status: string;
  priority: string;
}): TicketListParams {
  return {
    page: raw.page,
    take: raw.take,
    order: raw.order,
    orderBy: raw.orderBy as TicketOrderBy,
    search: raw.search || undefined,
    status: Object.values(Status).includes(raw.status as Status)
      ? (raw.status as Status)
      : undefined,
    priority: Object.values(Priority).includes(raw.priority as Priority)
      ? (raw.priority as Priority)
      : undefined,
  };
}

export function useTicketSearchParams() {
  const [raw, setRaw] = useQueryStates(ticketSearchParsers);
  const params = useMemo(() => toTicketListParams(raw), [raw]);
  return [params, setRaw] as const;
}
