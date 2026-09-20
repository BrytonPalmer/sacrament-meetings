export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getMeetings } from '@/lib/meetings-db';

function getThisSundayISO(): string {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const diff = (7 - day) % 7; // 0 if today is already Sunday
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + diff);
  return sunday.toISOString().split('T')[0];
}

export default async function CurrentMeetingPage() {
  const sundayDate = getThisSundayISO();
  const { meetings } = await getMeetings({ date: sundayDate });

  if (meetings.length === 0) {
    return (
      <p className="text-gray-600">
        No meeting found scheduled for {sundayDate} yet.
      </p>
    );
  }

  redirect(`/meetings/${meetings[0].id}`);
}