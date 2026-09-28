// Shared (non-'use server') module so client components can import the
// initial state without pulling in a Server Actions file.

export type MeetingFormState = {
  message?: string;
  // Keyed by dot-path, e.g. "date", "openingHymn.number", "speakers"
  errors?: Record<string, string[]>;
};

export const initialMeetingFormState: MeetingFormState = {};
