import type { Priority, Status } from '@helpdesk/shared/interfaces';
import { SortOrder } from '@helpdesk/shared/interfaces';

export interface TicketListParams {
  page?: number;
  take?: number;
  order?: SortOrder;
  orderBy?: TicketOrderBy;
  search?: string;
  status?: Status;
  priority?: Priority;
  onlyDeleted?: boolean;
}

export const TICKET_ORDER_BY = [
  'createdAt',
  'updatedAt',
  'title',
  'status',
  'priority',
] as const;
export type TicketOrderBy = (typeof TICKET_ORDER_BY)[number];

export const DEFAULT_TICKET_LIST_PARAMS: TicketListParams = {
  page: 1,
  take: 10,
  order: SortOrder.DESC,
  orderBy: 'createdAt',
  search: '',
};

export function ticketListParamsToSearch(
  params: TicketListParams,
): Record<string, string | number> {
  const q: Record<string, string | number> = {};
  if (params.page != null && params.page > 0) q['page'] = params.page;
  if (params.take != null && params.take > 0) q['take'] = params.take;
  if (params.order) q['order'] = params.order;
  if (params.orderBy) q['orderBy'] = params.orderBy;
  if (params.search?.trim()) q['search'] = params.search.trim();
  if (params.status) q['status'] = params.status;
  if (params.priority) q['priority'] = params.priority;
  if (params.onlyDeleted === true) q['onlyDeleted'] = 'true';
  return q;
}
