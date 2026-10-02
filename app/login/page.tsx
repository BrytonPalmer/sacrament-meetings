import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Bishopric Login',
  description: 'Sign in to manage sacrament meeting schedules and details.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-bold text-center">Bishopric Sign In</h1>
        <LoginForm />
      </div>
    </div>
  );
}