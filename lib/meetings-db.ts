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

// Every query below selects columns explicitly (never SELECT * or
// RETURNING *) so that `date`, a native Postgres `date` column, comes back
// as a plain 'YYYY-MM-DD' string via TO_CHAR rather than a JS Date object
// the @neondatabase/serverless driver would otherwise construct. MeetingRow
// has always claimed `date: string` — this makes that actually true, so
// template-literal interpolation (e.g. in generateMetadata) doesn't produce
// a full Date.toString() dump.
const MEETING_COLUMNS = `
  id,
  TO_CHAR(date, 'YYYY-MM-DD') AS date,
  meeting_type,
  presiding,
  conducting,
  announcements,
  opening_hymn,
  opening_prayer,
  ward_business,
  stake_business,
  sacrament_hymn,
  speakers,
  closing_hymn,
  closing_prayer
`;

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
      SELECT ${sql.unsafe(MEETING_COLUMNS)} FROM meetings WHERE date = ${date} ORDER BY date DESC
    `) as unknown as MeetingRow[];
    return { meetings: rows.map(mapRowToMeeting), total: rows.length };
  }

  // Page-component use case: text search + pagination
  if (query && query.trim() !== '') {
    const term = `%${query.trim()}%`;

    const rows = (await sql`
      SELECT ${sql.unsafe(MEETING_COLUMNS)} FROM meetings
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
    SELECT ${sql.unsafe(MEETING_COLUMNS)} FROM meetings
    ORDER BY date DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `) as unknown as MeetingRow[];
  const countResult = await sql`SELECT COUNT(*)::int AS count FROM meetings`;

  return { meetings: rows.map(mapRowToMeeting), total: countResult[0].count };
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const rows = (await sql`
    SELECT ${sql.unsafe(MEETING_COLUMNS)} FROM meetings WHERE id = ${id}
  `) as unknown as MeetingRow[];
  if (rows.length === 0) return null;
  return mapRowToMeeting(rows[0]);
}

export async function addMeeting(
  meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  const rows = (await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${meeting.date},
      ${meeting.meetingType},
      ${meeting.presiding},
      ${meeting.conducting},
      ${meeting.announcements ?? []}::text[],
      ${JSON.stringify(meeting.openingHymn)}::jsonb,
      ${meeting.openingPrayer},
      ${JSON.stringify(meeting.wardBusiness)}::jsonb,
      ${meeting.stakeBusiness},
      ${JSON.stringify(meeting.sacramentHymn)}::jsonb,
      ${JSON.stringify(meeting.speakers)}::jsonb,
      ${JSON.stringify(meeting.closingHymn)}::jsonb,
      ${meeting.closingPrayer}
    )
    RETURNING id
  `) as unknown as { id: number }[];

  // Re-select through getMeetingById rather than RETURNING * so the date
  // comes back as a formatted string here too, not a raw Date object.
  const created = await getMeetingById(rows[0].id);
  if (!created) {
    throw new Error('Meeting was created but could not be re-fetched.');
  }
  return created;
}

// NOTE: this now expects the full validated meeting (minus id), not a partial —
// the create/edit form always submits the complete record, so a full REPLACE
// is simpler and safer than a dynamic partial UPDATE.
export async function updateMeeting(
  id: number,
  meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting | null> {
  const rows = (await sql`
    UPDATE meetings SET
      date = ${meeting.date},
      meeting_type = ${meeting.meetingType},
      presiding = ${meeting.presiding},
      conducting = ${meeting.conducting},
      announcements = ${meeting.announcements ?? []}::text[],
      opening_hymn = ${JSON.stringify(meeting.openingHymn)}::jsonb,
      opening_prayer = ${meeting.openingPrayer},
      ward_business = ${JSON.stringify(meeting.wardBusiness)}::jsonb,
      stake_business = ${meeting.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(meeting.sacramentHymn)}::jsonb,
      speakers = ${JSON.stringify(meeting.speakers)}::jsonb,
      closing_hymn = ${JSON.stringify(meeting.closingHymn)}::jsonb,
      closing_prayer = ${meeting.closingPrayer}
    WHERE id = ${id}
    RETURNING id
  `) as unknown as { id: number }[];

  if (rows.length === 0) return null;

  // Same reasoning as addMeeting: re-select for a clean date string.
  return getMeetingById(rows[0].id);
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const rows = (await sql`
    DELETE FROM meetings WHERE id = ${id} RETURNING id
  `) as unknown as { id: number }[];

  return rows.length > 0;
}