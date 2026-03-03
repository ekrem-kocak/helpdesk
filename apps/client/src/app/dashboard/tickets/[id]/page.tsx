'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Clock,
  Mail,
  Shield,
  Flag,
  UserPlus,
  Zap,
  Edit,
  Ban,
  Trash2,
} from 'lucide-react';
import { useTicket } from '../../../../hooks/use-ticket';
import { useAuthStore } from '../../../../store/auth.store';
import { formatDate } from '../../../../lib/format';
import { statusConfig, priorityConfig } from '../../../../lib/tickets';
import {
  canEditTicketByRole,
  canEditTicketByStatus,
  getTicketEditDisabledReason,
  canManageTicketActions,
  canCancelTicket,
  canDeleteTicket,
} from '../../../../lib/auth';
import { TICKET, MESSAGES } from '../../../../lib/constants';
import { getErrorMessage } from '../../../../lib/errors';
import { AIInfoCard } from '../../../../components/ai-info-card';
import { EditTicketDialog } from '../edit-ticket-dialog';
import { CancelTicketDialog } from '../cancel-ticket-dialog';
import { DeleteTicketDialog } from '../delete-ticket-dialog';
import { ChangePriorityDialog } from '../change-priority-dialog';
import { ChangeStatusDialog } from '../change-status-dialog';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Separator,
  Avatar,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@helpdesk/shared/ui';
import { Role, Status } from '@helpdesk/shared/interfaces';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const ticketId = params.id as string;

  const { ticket, isLoading, isError, error } = useTicket(ticketId);
  const isSupport = canManageTicketActions(user);

  const canEditByRole = canEditTicketByRole(user, ticket);
  const canEditByStatus = canEditTicketByStatus(user, ticket);
  const disabledReason = getTicketEditDisabledReason(user, ticket);
  const canCancel = canCancelTicket(user, ticket);
  const canDelete = canDeleteTicket(user);
  const canChangePriority =
    (isSupport &&
      ticket?.status !== Status.CLOSED &&
      ticket?.status !== Status.CANCELLED) ||
    user?.role === Role.ADMIN;

  const validSupportTransitions: Record<Status, Status[]> = {
    [Status.OPEN]: [
      Status.IN_PROGRESS,
      Status.RESOLVED,
      Status.CANCELLED,
      Status.OPEN,
    ],
    [Status.IN_PROGRESS]: [
      Status.OPEN,
      Status.RESOLVED,
      Status.CANCELLED,
      Status.IN_PROGRESS,
    ],
    [Status.RESOLVED]: [Status.IN_PROGRESS, Status.CLOSED, Status.RESOLVED],
    [Status.CANCELLED]: [],
    [Status.CLOSED]: [],
  };

  const allowedStatuses = ticket
    ? user?.role === Role.ADMIN
      ? Object.values(Status)
      : isSupport
        ? validSupportTransitions[ticket.status as Status] || []
        : []
    : [];

  const canChangeStatus = allowedStatuses.length > 1;

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="space-y-3">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-4">
            <div className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{MESSAGES.ERROR_LOAD_TICKET}</p>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {getErrorMessage(error)}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = statusConfig[ticket.status];
  const priority = priorityConfig[ticket.priority];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hover:bg-muted w-fit gap-2 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <span className="text-muted-foreground font-mono text-sm">
          #{ticket.id.slice(0, TICKET.ID_DISPLAY_LENGTH)}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="border-muted-foreground/10">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="text-lg leading-tight font-bold tracking-tight sm:text-xl">
                  {ticket.title}
                </h1>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Badge variant="outline" className={status.className}>
                    {status.label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${priority.className} border-current`}
                  >
                    {priority.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wider uppercase">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>

                <div className="bg-muted/40 rounded-lg p-3">
                  <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                      <span className="text-muted-foreground text-xs">
                        Created:
                      </span>
                      <span className="font-medium">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                      <span className="text-muted-foreground text-xs">
                        Updated:
                      </span>
                      <span className="font-medium">
                        {formatDate(ticket.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {ticket.aiSummary && isSupport && (
            <AIInfoCard variant="summary" content={ticket.aiSummary} />
          )}

          {ticket.aiSuggestedReply && !isSupport && (
            <AIInfoCard variant="solution" content={ticket.aiSuggestedReply} />
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Card className="border-muted-foreground/10 overflow-hidden">
            <CardContent className="p-0">
              <div className="from-primary/10 to-primary/5 bg-linear-to-br px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="bg-primary text-primary-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold shadow-md">
                    {ticket.user?.name?.[0]?.toUpperCase() ||
                      ticket.user?.email?.[0]?.toUpperCase() ||
                      'U'}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {ticket.user?.name || 'Unknown User'}
                    </p>
                    <Badge
                      variant="secondary"
                      className="mt-1 h-5 text-xs font-medium"
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      {ticket.user?.role || 'USER'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span className="text-muted-foreground truncate">
                    {ticket.user?.email || 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {(canEditByRole || canCancel || canDelete || isSupport) && (
            <Card className="border-muted-foreground/10">
              <CardHeader>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Zap className="h-4 w-4" />
                  Quick Actions
                </h3>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-2">
                {canEditByRole && ticket && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <EditTicketDialog
                            ticket={ticket}
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-muted w-full justify-start gap-2 text-sm"
                                disabled={!canEditByStatus}
                              >
                                <Edit className="h-3.5 w-3.5" />
                                Edit Ticket
                              </Button>
                            }
                          />
                        </div>
                      </TooltipTrigger>
                      {!canEditByStatus && (
                        <TooltipContent side="right">
                          {disabledReason}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )}

                {canCancel && (
                  <CancelTicketDialog
                    ticket={ticket}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-muted text-destructive hover:text-destructive w-full justify-start gap-2 text-sm"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Cancel Ticket
                      </Button>
                    }
                  />
                )}

                {canDelete && (
                  <DeleteTicketDialog
                    ticket={ticket}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-muted text-destructive hover:text-destructive w-full justify-start gap-2 text-sm"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Ticket
                      </Button>
                    }
                    onDeleted={() => router.push('/dashboard/tickets')}
                  />
                )}

                {isSupport && (
                  <>
                    {canChangeStatus ? (
                      <ChangeStatusDialog
                        ticket={ticket}
                        allowedStatuses={allowedStatuses}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-muted w-full justify-start gap-2 text-sm"
                          >
                            <Flag className="h-3.5 w-3.5" />
                            Change Status
                          </Button>
                        }
                      />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-muted w-full justify-start gap-2 text-sm"
                        disabled
                      >
                        <Flag className="h-3.5 w-3.5" />
                        Change Status
                      </Button>
                    )}
                    {canChangePriority ? (
                      <ChangePriorityDialog
                        ticket={ticket}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-muted w-full justify-start gap-2 text-sm"
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            Change Priority
                          </Button>
                        }
                      />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-muted w-full justify-start gap-2 text-sm"
                        disabled
                      >
                        <AlertCircle className="h-3.5 w-3.5" />
                        Change Priority
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-muted w-full justify-start gap-2 text-sm"
                      disabled
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Assign to Me
                    </Button>
                    <div className="bg-muted/30 mt-3 rounded-md px-3 py-2">
                      <p className="text-muted-foreground text-center text-xs">
                        {MESSAGES.COMING_SOON}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
