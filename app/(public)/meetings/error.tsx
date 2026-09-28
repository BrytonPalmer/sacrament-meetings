'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function MeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-6 text-center" role="alert" aria-live="assertive">
      <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
      <p className="text-gray-600 mb-4">
        We ran into a problem loading or saving meeting information. You can try again, or head
        back to the meetings list.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={reset}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Try Again
        </button>
        <Link href="/meetings" className="rounded border border-gray-300 px-4 py-2">
          Back to meetings
        </Link>
      </div>
    </div>
  );
}
