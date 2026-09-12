import { SacramentMeeting } from "@/lib/types";

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border rounded-lg">
      <h2 className="text-2xl font-bold mb-1">
        {new Date(meeting.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </h2>
      <p className="text-sm text-gray-600 mb-6 capitalize">{meeting.meetingType} meeting</p>

      <dl className="space-y-4">
        <div>
          <dt className="font-semibold">Presiding</dt>
          <dd>{meeting.presiding}</dd>
        </div>
        <div>
          <dt className="font-semibold">Conducting</dt>
          <dd>{meeting.conducting}</dd>
        </div>

        {meeting.announcements && meeting.announcements.length > 0 && (
          <div>
            <dt className="font-semibold">Announcements</dt>
            <dd>
              <ul className="list-disc list-inside">
                {meeting.announcements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}

        <div>
          <dt className="font-semibold">Opening Hymn</dt>
          <dd>#{meeting.openingHymn.number} — {meeting.openingHymn.title}</dd>
        </div>
        <div>
          <dt className="font-semibold">Opening Prayer</dt>
          <dd>{meeting.openingPrayer}</dd>
        </div>

        {meeting.wardBusiness.length > 0 && (
          <div>
            <dt className="font-semibold">Ward Business</dt>
            <dd>
              <ul className="list-disc list-inside">
                {meeting.wardBusiness.map((wb, i) => (
                  <li key={i}>{wb.description}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}

        {meeting.stakeBusiness && (
          <div>
            <dt className="font-semibold">Stake Business</dt>
            <dd>Yes</dd>
          </div>
        )}

        <div>
          <dt className="font-semibold">Sacrament Hymn</dt>
          <dd>#{meeting.sacramentHymn.number} — {meeting.sacramentHymn.title}</dd>
        </div>

        {meeting.speakers.length > 0 && (
          <div>
            <dt className="font-semibold">Speakers &amp; Musical Numbers</dt>
            <dd>
              <ul className="list-disc list-inside">
                {meeting.speakers.map((s, i) => (
                  <li key={i}>
                    {s.name} — {s.topic} ({s.type === 'speaker' ? 'Speaker' : 'Musical Number'})
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}

        <div>
          <dt className="font-semibold">Closing Hymn</dt>
          <dd>#{meeting.closingHymn.number} — {meeting.closingHymn.title}</dd>
        </div>
        <div>
          <dt className="font-semibold">Closing Prayer</dt>
          <dd>{meeting.closingPrayer}</dd>
        </div>
      </dl>
    </div>
  );
}