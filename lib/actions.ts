'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addMeeting,
  updateMeeting as updateMeetingInDb,
  deleteMeeting as deleteMeetingInDb,
} from './meetings-db';
import type { MeetingFormState } from './meeting-form-state';

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const HymnSchema = z.object({
  number: z.coerce
    .number({ message: 'Hymn number must be a number' })
    .int()
    .positive({ message: 'Hymn number is required' }),
  title: z.string().trim().min(1, { message: 'Hymn title is required' }),
});

const WardBusinessSchema = z.object({
  description: z.string().trim().min(1, { message: 'Ward business item cannot be empty' }),
});

const SpeakerSchema = z.object({
  name: z.string().trim().min(1, { message: 'Speaker name is required' }),
  topic: z.string().trim().min(1, { message: 'Topic is required' }),
  type: z.enum(['speaker', 'musical-number']),
});

const MeetingFormSchema = z.object({
  date: z.string().min(1, { message: 'Date is required' }),
  meetingType: z.enum(['testimony', 'regular', 'stake', 'general'], {
    message: 'Please select a meeting type',
  }),
  presiding: z.string().trim().min(1, { message: 'Presiding officer is required' }),
  conducting: z.string().trim().min(1, { message: 'Conducting officer is required' }),
  announcements: z.array(z.string().trim().min(1)).default([]),
  openingHymn: HymnSchema,
  openingPrayer: z.string().trim().min(1, { message: 'Opening prayer name is required' }),
  wardBusiness: z.array(WardBusinessSchema).default([]),
  stakeBusiness: z.boolean().default(false),
  sacramentHymn: HymnSchema,
  speakers: z
    .array(SpeakerSchema)
    .min(1, { message: 'At least one speaker or musical number is required' }),
  closingHymn: HymnSchema,
  closingPrayer: z.string().trim().min(1, { message: 'Closing prayer name is required' }),
});

// ---------------------------------------------------------------------------
// FormData -> raw object (matches the flat input names used in MeetingForm)
// ---------------------------------------------------------------------------

function parseMeetingFormData(formData: FormData) {
  const announcements = (formData.get('announcements')?.toString() ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const wardBusinessDescriptions = formData.getAll('wardBusinessDescription').map(String);
  const wardBusiness = wardBusinessDescriptions
    .map((description) => ({ description: description.trim() }))
    .filter((item) => item.description.length > 0);

  const speakerNames = formData.getAll('speakerName').map(String);
  const speakerTopics = formData.getAll('speakerTopic').map(String);
  const speakerTypes = formData.getAll('speakerType').map(String);
  const speakers = speakerNames
    .map((name, i) => ({
      name: name.trim(),
      topic: (speakerTopics[i] ?? '').trim(),
      type: speakerTypes[i] === 'musical-number' ? ('musical-number' as const) : ('speaker' as const),
    }))
    .filter((s) => s.name.length > 0 || s.topic.length > 0);

  return {
    date: formData.get('date')?.toString() ?? '',
    meetingType: formData.get('meetingType')?.toString() ?? '',
    presiding: formData.get('presiding')?.toString() ?? '',
    conducting: formData.get('conducting')?.toString() ?? '',
    announcements,
    openingHymn: {
      number: formData.get('openingHymnNumber')?.toString() ?? '',
      title: formData.get('openingHymnTitle')?.toString() ?? '',
    },
    openingPrayer: formData.get('openingPrayer')?.toString() ?? '',
    wardBusiness,
    stakeBusiness: formData.get('stakeBusiness') === 'on',
    sacramentHymn: {
      number: formData.get('sacramentHymnNumber')?.toString() ?? '',
      title: formData.get('sacramentHymnTitle')?.toString() ?? '',
    },
    speakers,
    closingHymn: {
      number: formData.get('closingHymnNumber')?.toString() ?? '',
      title: formData.get('closingHymnTitle')?.toString() ?? '',
    },
    closingPrayer: formData.get('closingPrayer')?.toString() ?? '',
  };
}

function buildErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!errors[key]) errors[key] = [];
    errors[key].push(issue.message);
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

export async function createMeeting(
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  const raw = parseMeetingFormData(formData);
  const result = MeetingFormSchema.safeParse(raw);

  if (!result.success) {
    return { message: 'Please fix the errors below.', errors: buildErrors(result.error) };
  }

  try {
    await addMeeting(result.data);
  } catch (error) {
    console.error('Failed to create meeting:', error);
    throw new Error('Something went wrong while creating the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  const raw = parseMeetingFormData(formData);
  const result = MeetingFormSchema.safeParse(raw);

  if (!result.success) {
    return { message: 'Please fix the errors below.', errors: buildErrors(result.error) };
  }

  try {
    const updated = await updateMeetingInDb(id, result.data);
    if (!updated) {
      return { message: 'This meeting could not be found. It may have already been deleted.' };
    }
  } catch (error) {
    console.error('Failed to update meeting:', error);
    throw new Error('Something went wrong while updating the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function deleteMeeting(id: number): Promise<void> {
  try {
    await deleteMeetingInDb(id);
  } catch (error) {
    console.error('Failed to delete meeting:', error);
    throw new Error('Something went wrong while deleting the meeting. Please try again.');
  }

  revalidatePath('/meetings');
}
