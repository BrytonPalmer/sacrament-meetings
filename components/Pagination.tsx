'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get('page')) || 1;

  function createPageURL(pageNumber: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }

  return (
    <nav aria-label="Meetings pagination" className="mt-6 flex items-center justify-between">
      <Link
        href={createPageURL(currentPage - 1)}
        aria-disabled={currentPage <= 1}
        className={`rounded px-4 py-2 ${
          currentPage <= 1
            ? 'pointer-events-none bg-gray-100 text-gray-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        Previous
      </Link>

      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages || 1}
      </span>

      <Link
        href={createPageURL(currentPage + 1)}
        aria-disabled={currentPage >= totalPages}
        className={`rounded px-4 py-2 ${
          currentPage >= totalPages
            ? 'pointer-events-none bg-gray-100 text-gray-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        Next
      </Link>
    </nav>
  );
}