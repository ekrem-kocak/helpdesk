'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  CreateTicketInput,
  Priority,
  type ApiResponse,
  type Ticket,
} from '@helpdesk/shared/interfaces';
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
import { Loader2, PlusCircle } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { useAuthStore } from '../../../store/auth.store';
import { isUserRole } from '../../../lib/auth';

const createTicketSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title can be at most 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(Priority).optional(),
});

type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

const priorityLabels: Record<Priority, string> = {
  [Priority.LOW]: 'Low',
  [Priority.MEDIUM]: 'Medium',
  [Priority.HIGH]: 'High',
  [Priority.URGENT]: 'Urgent',
};

interface CreateTicketDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function CreateTicketDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: CreateTicketDialogProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isUser = isUserRole(user);
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: Priority.MEDIUM,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateTicketInput) => {
      const res = await apiClient.post<ApiResponse<Ticket>>('/tickets', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      form.reset();
      setOpen(false);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const msg = Array.isArray(messages) ? messages[0] : messages;
        form.setError('root', {
          message: msg || 'An error occurred while creating the ticket.',
        });
      }
    },
  });

  const onSubmit = (data: CreateTicketFormValues) => {
    createMutation.mutate({
      title: data.title,
      description: data.description,
      ...(isUser ? {} : { priority: data.priority }),
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) form.reset();
    setOpen(nextOpen);
  };

  const defaultTrigger = (
    <Button
      size="sm"
      className="bg-primary hover:bg-primary/90 gap-2 rounded-xl shadow-sm transition-all"
    >
      <PlusCircle className="h-4 w-4" />
      New Ticket
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="border-muted-foreground/10 bg-card/95 backdrop-blur sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">New support ticket</DialogTitle>
          <DialogDescription>
            {isUser
              ? 'Share your issue with a title and description. Priority will be set automatically.'
              : 'Share your issue with a title and description. Select a priority if possible.'}
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
                      placeholder="e.g. Cannot log in"
                      className="rounded-lg"
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
                      placeholder="Describe your issue in detail..."
                      className="max-h-[200px] min-h-[120px] resize-y rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isUser && (
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <select
                        className="border-input bg-background focus-visible:ring-ring/50 focus-visible:border-ring h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? (e.target.value as Priority)
                              : undefined,
                          )
                        }
                        onBlur={field.onBlur}
                      >
                        {(Object.keys(priorityLabels) as Priority[]).map(
                          (p) => (
                            <option key={p} value={p}>
                              {priorityLabels[p]}
                            </option>
                          ),
                        )}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded-lg"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
