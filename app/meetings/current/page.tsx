import { redirect } from "next/navigation";
import { getMeetings } from "@/lib/meetings-db";

function getMostRecentSunday(): string {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const diff = today.getDate() - day;
  const sunday = new Date(today.setDate(diff));
  return sunday.toISOString().split("T")[0];
}

export default function CurrentMeetingPage() {
  const targetDate = getMostRecentSunday();
  const meetings = getMeetings(targetDate);

  if (meetings.length > 0) {
    redirect(`/meetings/${meetings[0].id}`);
  }

  // Fallback: no meeting matches this exact Sunday in the in-memory data
  redirect("/meetings");
}