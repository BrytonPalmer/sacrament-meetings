'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-describedby="login-error"
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={6}
          required
          aria-describedby="login-error"
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <button
        type="submit"
        aria-disabled={isPending}
        disabled={isPending}
        className="w-full rounded bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>

      <div id="login-error" aria-live="polite">
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>
    </form>
  );
}