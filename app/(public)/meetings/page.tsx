import { getMeetings } from "@/lib/meetings-db";
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
      <h1 className="text-2xl font-bold mb-6">All Meetings</h1>

      <MeetingSearch />

      {meetings.length === 0 ? (
        <p className="mt-6 text-gray-600">No meetings found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}

      <Pagination totalPages={totalPages} />
    </div>
  );
}