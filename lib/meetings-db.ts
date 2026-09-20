import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting, Hymn, WardBusinessItem, SpeakerItem, MeetingType } from './types';

const sql = neon(process.env.DATABASE_URL!);

interface MeetingRow {
  id: number;
  date: string;
  meeting_type: string;
  presiding: string;
  conducting: string;
  announcements: string[];
  opening_hymn: Hymn;
  opening_prayer: string;
  ward_business: WardBusinessItem[];
  stake_business: boolean;
  sacrament_hymn: Hymn;
  speakers: SpeakerItem[];
  closing_hymn: Hymn;
  closing_prayer: string;
}

function mapRowToMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date,
    meetingType: row.meeting_type as MeetingType,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements,
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business,
    stakeBusiness: row.stake_business,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers,
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

export async function getMeetings(options: {
  date?: string | null;
  query?: string | null;
  page?: number;
  pageSize?: number;
} = {}): Promise<{ meetings: SacramentMeeting[]; total: number }> {
  const { date, query, page = 1, pageSize = 5 } = options;
  const offset = (page - 1) * pageSize;

  // API-route use case: exact date filter, no pagination
  if (date) {
    const rows = (await sql`
      SELECT * FROM meetings WHERE date = ${date} ORDER BY date DESC
    `) as unknown as MeetingRow[];
    return { meetings: rows.map(mapRowToMeeting), total: rows.length };
  }

  // Page-component use case: text search + pagination
  if (query && query.trim() !== '') {
    const term = `%${query.trim()}%`;

    const rows = (await sql`
      SELECT * FROM meetings
      WHERE presiding ILIKE ${term}
         OR conducting ILIKE ${term}
         OR meeting_type ILIKE ${term}
         OR speakers::text ILIKE ${term}
      ORDER BY date DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `) as unknown as MeetingRow[];

    const countResult = await sql`
      SELECT COUNT(*)::int AS count FROM meetings
      WHERE presiding ILIKE ${term}
         OR conducting ILIKE ${term}
         OR meeting_type ILIKE ${term}
         OR speakers::text ILIKE ${term}
    `;

    return { meetings: rows.map(mapRowToMeeting), total: countResult[0].count };
  }

  // No filters: plain paginated list
  const rows = (await sql`
    SELECT * FROM meetings
    ORDER BY date DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `) as unknown as MeetingRow[];
  const countResult = await sql`SELECT COUNT(*)::int AS count FROM meetings`;

  return { meetings: rows.map(mapRowToMeeting), total: countResult[0].count };
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const rows = (await sql`SELECT * FROM meetings WHERE id = ${id}`) as unknown as MeetingRow[];
  if (rows.length === 0) return null;
  return mapRowToMeeting(rows[0]);
}

export async function addMeeting(
  _meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  throw new Error('addMeeting not yet implemented — coming in Week 04');
}

export async function updateMeeting(
  _id: number,
  _meeting: Partial<SacramentMeeting>
): Promise<SacramentMeeting | null> {
  throw new Error('updateMeeting not yet implemented — coming in Week 04');
}

export async function deleteMeeting(_id: number): Promise<boolean> {
  throw new Error('deleteMeeting not yet implemented — coming in Week 04');
}