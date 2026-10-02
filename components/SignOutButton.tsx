import { signOut } from '@/auth';

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <button type="submit" className="text-sm text-gray-300 underline hover:text-white">
        Sign Out
      </button>
    </form>
  );
}