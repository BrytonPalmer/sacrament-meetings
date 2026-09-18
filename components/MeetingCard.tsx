import Link from "next/link";
import { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <article className="p-6 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-bold mb-1">
        {new Date(meeting.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </h3>
      <p className="text-sm text-gray-600 mb-3 capitalize">{meeting.meetingType} meeting</p>
      <p className="text-sm text-gray-700 mb-4">Presiding: {meeting.presiding}</p>
      <Link
        href={`/meetings/${meeting.id}`}
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        View Details
      </Link>
    </article>
  );
}