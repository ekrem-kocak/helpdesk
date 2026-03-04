'use client';

import { useState } from 'react';
import type { Ticket } from '@helpdesk/shared/interfaces';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@helpdesk/shared/ui';
import { Loader2, RotateCcw } from 'lucide-react';
import { useRestoreTicket } from '../../../hooks/use-restore-ticket';
import { getErrorMessage } from '../../../lib/errors';

type RestoreTicketDialogProps =
  | {
      ticket: Ticket;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      trigger?: React.ReactNode;
      onRestored?: () => void;
    }
  | {
      ticket: Ticket;
      open?: undefined;
      onOpenChange?: undefined;
      trigger?: React.ReactNode;
      onRestored?: () => void;
    };

export function RestoreTicketDialog(props: RestoreTicketDialogProps) {
  const {
    ticket,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    trigger,
    onRestored,
  } = props;

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;

  if (isControlled && !controlledOnOpenChange) {
    throw new Error(
      'RestoreTicketDialog: onOpenChange is required when open is provided.',
    );
  }

  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

  const restoreMutation = useRestoreTicket();

  const handleRestore = () => {
    restoreMutation.mutate(
      { id: ticket.id },
      {
        onSuccess: () => {
          setOpen(false);
          onRestored?.();
        },
        onError: (error) => {
          console.error('Restore ticket failed:', getErrorMessage(error));
        },
      },
    );
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <RotateCcw className="h-3.5 w-3.5" />
      Restore
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Restore Ticket</DialogTitle>
          <DialogDescription>
            Restore this soft-deleted ticket? It will appear again in the active
            ticket list. This action is reserved for administrators.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Ticket ID:</span>
              <span className="ml-2 font-mono font-medium">
                #{ticket.id.slice(0, 8)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Title:</span>
              <span className="ml-2 font-medium">{ticket.title}</span>
            </div>
          </div>
        </div>

        {restoreMutation.isError && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border px-3 py-2 text-sm">
            {getErrorMessage(restoreMutation.error)}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={restoreMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleRestore}
            disabled={restoreMutation.isPending}
          >
            {restoreMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Restoring...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                Yes, Restore Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
