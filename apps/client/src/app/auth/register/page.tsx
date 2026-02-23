'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@helpdesk/shared/ui';
import { useAuthStore } from '@client/store/auth.store';
import { apiClient } from '@client/lib/api-client';
import type { ApiResponse, AuthResponse } from '@helpdesk/shared/interfaces';
import { AuthCard } from '@client/components/auth-card';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const res = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/register',
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      );
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

  const onSubmit = (data: RegisterFormValues) => {
    setGlobalError(null);
    registerMutation.mutate(data);
  };

  return (
    <AuthCard
      title="Create account"
      description="Create your Helpdesk account"
      footer={{
        label: 'Already have an account?',
        href: '/auth/login',
        linkText: 'Sign in',
      }}
    >
      {globalError && (
        <div
          className="border-destructive/30 bg-destructive/10 text-destructive mb-4 rounded-lg border px-4 py-3 text-sm"
          role="alert"
        >
          {globalError}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      placeholder="Your name"
                      type="text"
                      autoComplete="name"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      className="pl-9"
                      {...field}
                    />
                  </div>
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      type="password"
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Creating account...
              </>
            ) : (
              'Sign up'
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
