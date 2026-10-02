import { cache } from "react";
import type { Metadata } from "next";
import { getMeetingById } from "@/lib/meetings-db";
import MeetingDetail from "@/components/MeetingDetail";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

// React's cache() dedupes this within a single request, so generateMetadata
// and the page component below don't each trigger a separate DB query for
// the same meeting.
const getMeeting = cache((id: number) => getMeetingById(id));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId)) {
    return { title: "Meeting Not Found" };
  }

  const meeting = await getMeeting(meetingId);

  if (!meeting) {
    return {
      title: "Meeting Not Found",
      description: "The requested sacrament meeting could not be found.",
    };
  }

  const description = `${meeting.meetingType} sacrament meeting on ${meeting.date}, presided over by ${meeting.presiding}.`;

  return {
    title: `Meeting — ${meeting.date}`,
    description,
    openGraph: {
      title: `Sacrament Meeting — ${meeting.date}`,
      description,
    },
  };
}

export default async function MeetingDetailPage({ params }: Props) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId)) {
    notFound();
  }

  const meeting = await getMeeting(meetingId);

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}