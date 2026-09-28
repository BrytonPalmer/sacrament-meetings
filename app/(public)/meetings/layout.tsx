import Link from 'next/link';

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <nav aria-label="Meetings navigation" className="mb-6 flex gap-4 border-b pb-3">
        <Link href="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <Link href="/meetings" className="text-blue-600 hover:underline">
          All Meetings
        </Link>
        <Link href="/meetings/current" className="text-blue-600 hover:underline">
          This Sunday
        </Link>
      </nav>
      {children}
    </div>
  );
}