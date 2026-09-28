import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { getMeetingById } from '@/lib/meetings-db';

export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetingId = Number(id);

  const meeting = Number.isNaN(meetingId) ? null : await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  const updateMeetingWithId = updateMeeting.bind(null, meeting.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Meeting</h1>
      <MeetingForm action={updateMeetingWithId} initialData={meeting} submitLabel="Save Changes" />
    </div>
  );
}
