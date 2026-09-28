import Link from "next/link";
import { getMeetings } from "@/lib/meetings-db";
import { deleteMeeting } from "@/lib/actions";
import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 5;

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams;
  const currentPage = Number(page) || 1;

  const { meetings, total } = await getMeetings({
    query,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Meetings</h1>
        <Link
          href="/meetings/new"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          New Meeting
        </Link>
      </div>

      <MeetingSearch />

      {meetings.length === 0 ? (
        <p className="mt-6 text-gray-600">No meetings found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {meetings.map((meeting) => (
            <div key={meeting.id}>
              <MeetingCard meeting={meeting} />
              <div className="mt-2 flex items-center gap-4">
                <Link
                  href={`/meetings/${meeting.id}/edit`}
                  aria-label={`Edit meeting on ${meeting.date}`}
                  className="text-blue-600 underline"
                >
                  Edit
                </Link>
                <form action={deleteMeeting.bind(null, meeting.id)}>
                  <button
                    type="submit"
                    aria-label={`Delete meeting on ${meeting.date}`}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination totalPages={totalPages} />
    </div>
  );
}