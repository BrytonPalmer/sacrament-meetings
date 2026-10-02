import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">Meeting Not Found</h1>
      <p className="text-gray-600 mb-4">
        We couldn&apos;t find a meeting with that ID. It may have been deleted or the link may be
        incorrect.
      </p>
      <Link href="/meetings" className="text-blue-600 underline">
        Back to meetings
      </Link>
    </div>
  );
}
