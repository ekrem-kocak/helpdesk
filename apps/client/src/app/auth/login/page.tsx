'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@helpdesk/shared/ui';
import { useAuthStore } from '../../../store/auth.store';
import { apiClient } from '../../../lib/api-client';
import { ApiResponse, AuthResponse } from '@/libs/shared/interfaces/src';

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiClient.post('/auth/login', data);
      return res.data;
    },
    onSuccess: (data: ApiResponse<AuthResponse>) => {
      setAccessToken(data.data.accessToken);
      router.push('/dashboard');
      router.refresh();
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'An unexpected error occurred';
        setGlobalError(message);
      } else {
        setGlobalError('An unexpected error occurred');
      }
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setGlobalError(null);
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            HELPDESK
          </CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {globalError && (
            <div className="bg-destructive/15 text-destructive mb-4 rounded-md p-3 text-sm">
              {globalError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@helpdesk.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                Login
                {loginMutation.isPending && (
                  <Loader2 className="mr-2 inline-block h-4 w-4 animate-spin align-middle" />
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
