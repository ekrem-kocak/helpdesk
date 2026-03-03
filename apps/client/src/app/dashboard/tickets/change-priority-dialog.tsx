'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Priority, Ticket } from '@helpdesk/shared/interfaces';
import { useUpdateTicket } from '../../../hooks/use-update-ticket';
import { priorityConfig } from '../../../lib/tickets';

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

interface ChangePriorityDialogProps {
  ticket: Ticket;
  trigger: React.ReactNode;
}

const formSchema = z.object({
  priority: z.nativeEnum(Priority, {
    error: 'Please select a priority.',
  }),
});

export function ChangePriorityDialog({
  ticket,
  trigger,
}: ChangePriorityDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateTicket, isPending } = useUpdateTicket();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: ticket.priority as Priority,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.priority === ticket.priority) {
        setOpen(false);
        return;
      }
      await updateTicket({
        id: ticket.id,
        data: { priority: values.priority },
      });
      setOpen(false);
    } catch (error) {
      console.error('Failed to change priority:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Priority</DialogTitle>
          <DialogDescription>
            Update the urgency level for this ticket.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Priority).map((p) => {
                        const config = priorityConfig[p];
                        return (
                          <SelectItem key={p} value={p}>
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
                Change Priority
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
