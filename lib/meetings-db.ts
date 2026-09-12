// lib/meetings-db.ts
import { SacramentMeeting } from './types';

export const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-08-02',
    meetingType: 'regular',
    presiding: 'Bishop Anderson',
    conducting: 'Brother Lee',
    announcements: ['Ward temple trip on August 15th', 'New Sunday School schedule starts next week'],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'Sister Johnson',
    wardBusiness: [{ description: 'Sustaining of new Primary president' }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [
      { name: 'Brother Martinez', topic: 'Faith in daily life', type: 'speaker' },
      { name: 'Youth Choir', topic: 'Come, Thou Fount of Every Blessing', type: 'musical-number' },
      { name: 'Sister Kim', topic: 'Service in the community', type: 'speaker' },
    ],
    closingHymn: { number: 219, title: "God Be with You Till We Meet Again" },
    closingPrayer: 'Brother Davis',
  },
  {
    id: 2,
    date: '2026-08-09',
    meetingType: 'testimony',
    presiding: 'Bishop Anderson',
    conducting: 'Brother Lee',
    announcements: ['Fast and testimony meeting today'],
    openingHymn: { number: 30, title: 'Come, Come, Ye Saints' },
    openingPrayer: 'Brother Nguyen',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'In Humility, Our Savior' },
    speakers: [],
    closingHymn: { number: 26, title: 'Joseph Smith\'s First Prayer' },
    closingPrayer: 'Sister Park',
  },
  {
    id: 3,
    date: '2026-08-16',
    meetingType: 'stake',
    presiding: 'President Whitfield',
    conducting: 'President Whitfield',
    announcements: ['Combined stake conference broadcast'],
    openingHymn: { number: 1, title: 'The Morning Breaks' },
    openingPrayer: 'Elder Brown',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 181, title: "O Thou Before the World Began" },
    speakers: [
      { name: 'Elder Thompson', topic: 'Strengthening families', type: 'speaker' },
    ],
    closingHymn: { number: 249, title: 'Come, O Thou King of Kings' },
    closingPrayer: 'Sister White',
  },
  {
    id: 4,
    date: '2026-08-23',
    meetingType: 'regular',
    presiding: 'Bishop Anderson',
    conducting: 'Brother Lee',
    announcements: ['Ward campout this weekend', 'Missionary farewell next month'],
    openingHymn: { number: 89, title: 'Let Us All Press On' },
    openingPrayer: 'Brother Garcia',
    wardBusiness: [{ description: 'Release and thank Sister Reyes from Relief Society presidency' }],
    stakeBusiness: false,
    sacramentHymn: { number: 174, title: 'While of These Emblems We Partake' },
    speakers: [
      { name: 'Sister Reyes', topic: 'Gratitude and service', type: 'speaker' },
      { name: 'Brother Chen', topic: 'Missionary work', type: 'speaker' },
    ],
    closingHymn: { number: 259, title: "Choose the Right" },
    closingPrayer: 'Sister Alvarez',
  },
  {
    id: 5,
    date: '2026-08-30',
    meetingType: 'general',
    presiding: 'Bishop Anderson',
    conducting: 'Brother Lee',
    announcements: ['General conference viewing party details to follow'],
    openingHymn: { number: 4, title: 'Truth Eternal' },
    openingPrayer: 'Brother Kim',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 190, title: "Reverently and Meekly Now" },
    speakers: [],
    closingHymn: { number: 2, title: 'The Spirit of God' },
    closingPrayer: 'Sister Nguyen',
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  if (date) {
    return meetings.filter((m) => m.date === date);
  }
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find((m) => m.id === id) ?? null;
}