import { getMeetingById } from "@/lib/meetings-db";
import MeetingDetail from "@/components/MeetingDetail";
import { notFound } from "next/navigation";

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = getMeetingById(Number(id));

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}