'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Priority, Status, type Ticket } from '@helpdesk/shared/interfaces';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@helpdesk/shared/ui';
import { Loader2, Save } from 'lucide-react';
import { useAuthStore } from '@client/store/auth.store';
import { useUpdateTicket } from '@client/hooks/use-update-ticket';
import { priorityConfig, statusConfig } from '@client/lib/tickets';
import { isUserRole, canManageTicketActions } from '@client/lib/auth';

const editTicketSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title can be at most 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(Priority),
  status: z.enum(Status).optional(),
});

type EditTicketFormValues = z.infer<typeof editTicketSchema>;

interface EditTicketDialogProps {
  ticket: Ticket;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function EditTicketDialog({
  ticket,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: EditTicketDialogProps) {
  const user = useAuthStore((state) => state.user);
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const isUser = isUserRole(user);
  const canEditStatus = canManageTicketActions(user);

  const form = useForm<EditTicketFormValues>({
    resolver: zodResolver(editTicketSchema),
    defaultValues: {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
      });
    }
  }, [
    open,
    ticket.title,
    ticket.description,
    ticket.priority,
    ticket.status,
    form,
  ]);

  const updateMutation = useUpdateTicket();

  const onSubmit = (data: EditTicketFormValues) => {
    const updateData: Record<string, unknown> = {
      title: data.title,
      description: data.description,
      priority: data.priority,
    };

    if (canEditStatus && data.status) {
      updateData.status = data.status;
    }

    updateMutation.mutate(
      {
        id: ticket.id,
        data: updateData,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error: unknown) => {
          if (axios.isAxiosError(error)) {
            const messages = error.response?.data?.message;
            const msg = Array.isArray(messages) ? messages[0] : messages;
            form.setError('root', {
              message: msg || 'Failed to update ticket',
            });
          } else {
            form.setError('root', {
              message: 'An unexpected error occurred',
            });
          }
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !updateMutation.isPending) {
      form.reset();
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="border-muted-foreground/10 bg-card/95 backdrop-blur sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Ticket</DialogTitle>
          <DialogDescription>
            {isUser
              ? 'You can only edit title, description, and priority.'
              : 'Update ticket details and status.'}
          </DialogDescription>
        </DialogHeader>

        {form.formState.errors.root && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border px-3 py-2 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of your issue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your issue"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border-input bg-background focus-visible:ring-ring/50 focus-visible:border-ring h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
                    >
                      {Object.values(Priority).map((priority) => (
                        <option key={priority} value={priority}>
                          {priorityConfig[priority].label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {canEditStatus && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="border-input bg-background focus-visible:ring-ring/50 focus-visible:border-ring h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
                      >
                        {Object.values(Status).map((status) => (
                          <option key={status} value={status}>
                            {statusConfig[status].label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
