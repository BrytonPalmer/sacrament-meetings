import Link from 'next/link';
import { auth } from '@/auth';
import SignOutButton from './SignOutButton';

export default async function Header() {
  const session = await auth();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Maple Grove Ward</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-300">{today}</p>
          {session?.user ? (
            <SignOutButton />
          ) : (
            <Link href="/login" className="text-sm text-gray-300 underline hover:text-white">
              Bishopric Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}