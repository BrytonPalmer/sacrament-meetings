import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export default function NewMeetingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create Meeting</h1>
      <MeetingForm action={createMeeting} submitLabel="Create Meeting" />
    </div>
  );
}
