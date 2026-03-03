'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Status, Ticket } from '@helpdesk/shared/interfaces';
import { useUpdateTicket } from '../../../hooks/use-update-ticket';
import { statusConfig } from '../../../lib/tickets';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@helpdesk/shared/ui';

interface ChangeStatusDialogProps {
  ticket: Ticket;
  trigger: React.ReactNode;
  allowedStatuses: Status[];
}

const formSchema = z.object({
  status: z.nativeEnum(Status, {
    error: 'Please select a status.',
  }),
});

export function ChangeStatusDialog({
  ticket,
  trigger,
  allowedStatuses,
}: ChangeStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateTicket, isPending } = useUpdateTicket();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: ticket.status as Status,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.status === ticket.status) {
        setOpen(false);
        return;
      }
      await updateTicket({
        id: ticket.id,
        data: { status: values.status },
      });
      setOpen(false);
    } catch (error) {
      console.error('Failed to change status:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription>
            Update the current status of this ticket.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allowedStatuses.map((s) => {
                        const config = statusConfig[s];
                        return (
                          <SelectItem key={s} value={s}>
                            <div className="flex items-center gap-2">
                              {config.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Status
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
