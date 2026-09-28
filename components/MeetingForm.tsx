'use client';

import { useActionState, useState } from 'react';
import type { SacramentMeeting, MeetingType } from '@/lib/types';
import { initialMeetingFormState, type MeetingFormState } from '@/lib/meeting-form-state';

type MeetingFormAction = (
  prevState: MeetingFormState,
  formData: FormData
) => Promise<MeetingFormState>;

interface MeetingFormProps {
  action: MeetingFormAction;
  initialData?: SacramentMeeting;
  submitLabel: string;
}

const MEETING_TYPES: MeetingType[] = ['testimony', 'regular', 'stake', 'general'];

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <div id={id} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
      {messages.join(' ')}
    </div>
  );
}

export default function MeetingForm({ action, initialData, submitLabel }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialMeetingFormState);

  const [wardBusinessCount, setWardBusinessCount] = useState(
    Math.max(initialData?.wardBusiness.length ?? 1, 1)
  );
  const [speakerCount, setSpeakerCount] = useState(
    Math.max(initialData?.speakers.length ?? 1, 1)
  );

  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-8 max-w-2xl">
      {state.message && (
        <div role="alert" aria-live="polite" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      {/* Basic details */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Meeting Details</legend>

        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={initialData?.date}
            aria-describedby="date-error"
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
          <FieldError id="date-error" messages={errors['date']} />
        </div>

        <div>
          <label htmlFor="meetingType" className="block text-sm font-medium">
            Meeting Type
          </label>
          <select
            id="meetingType"
            name="meetingType"
            defaultValue={initialData?.meetingType ?? ''}
            aria-describedby="meetingType-error"
            className="mt-1 w-full rounded border border-gray-300 p-2"
          >
            <option value="" disabled>
              Select a type
            </option>
            {MEETING_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError id="meetingType-error" messages={errors['meetingType']} />
        </div>

        <div>
          <label htmlFor="presiding" className="block text-sm font-medium">
            Presiding
          </label>
          <input
            id="presiding"
            name="presiding"
            type="text"
            defaultValue={initialData?.presiding}
            aria-describedby="presiding-error"
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
          <FieldError id="presiding-error" messages={errors['presiding']} />
        </div>

        <div>
          <label htmlFor="conducting" className="block text-sm font-medium">
            Conducting
          </label>
          <input
            id="conducting"
            name="conducting"
            type="text"
            defaultValue={initialData?.conducting}
            aria-describedby="conducting-error"
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
          <FieldError id="conducting-error" messages={errors['conducting']} />
        </div>

        <div>
          <label htmlFor="announcements" className="block text-sm font-medium">
            Announcements (one per line)
          </label>
          <textarea
            id="announcements"
            name="announcements"
            rows={3}
            defaultValue={initialData?.announcements?.join('\n')}
            aria-describedby="announcements-error"
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
          <FieldError id="announcements-error" messages={errors['announcements']} />
        </div>
      </fieldset>

      {/* Opening */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Opening</legend>

        <div className="flex gap-4">
          <div className="w-32">
            <label htmlFor="openingHymnNumber" className="block text-sm font-medium">
              Opening Hymn #
            </label>
            <input
              id="openingHymnNumber"
              name="openingHymnNumber"
              type="number"
              defaultValue={initialData?.openingHymn.number}
              aria-describedby="openingHymnNumber-error"
              className="mt-1 w-full rounded border border-gray-300 p-2"
            />
            <FieldError id="openingHymnNumber-error" messages={errors['openingHymn.number']} />
          </div>
          <div className="flex-1">
            <label htmlFor="openingHymnTitle" className="block text-sm font-medium">
              Opening Hymn Title
            </label>
            <input
              id="openingHymnTitle"
              name="openingHymnTitle"
              type="text"
              defaultValue={initialData?.openingHymn.title}
              aria-describedby="openingHymnTitle-error"
              className="mt-1 w-full rounded border border-gray-300 p-2"
            />
            <FieldError id="openingHymnTitle-error" messages={errors['openingHymn.title']} />
          </div>
        </div>

        <div>
          <label htmlFor="openingPrayer" className="block text-sm font-medium">
            Opening Prayer
          </label>
          <input
            id="openingPrayer"
            name="openingPrayer"
            type="text"
            defaultValue={initialData?.openingPrayer}
            aria-describedby="openingPrayer-error"
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
          <FieldError id="openingPrayer-error" messages={errors['openingPrayer']} />
        </div>
      </fieldset>

      {/* Ward business */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Ward Business</legend>
        <FieldError id="wardBusiness-error" messages={errors['wardBusiness']} />

        {Array.from({ length: wardBusinessCount }).map((_, i) => (
          <div key={i}>
            <label htmlFor={`wardBusinessDescription-${i}`} className="block text-sm font-medium">
              Item {i + 1}
            </label>
            <input
              id={`wardBusinessDescription-${i}`}
              name="wardBusinessDescription"
              type="text"
              defaultValue={initialData?.wardBusiness[i]?.description}
              className="mt-1 w-full rounded border border-gray-300 p-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setWardBusinessCount((c) => c + 1)}
          className="text-sm text-blue-600 underline"
        >
          + Add ward business item
        </button>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={initialData?.stakeBusiness}
          />
          <label htmlFor="stakeBusiness" className="text-sm font-medium">
            Stake business conducted
          </label>
        </div>
      </fieldset>

      {/* Sacrament */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Sacrament</legend>
        <div className="flex gap-4">
          <div className="w-32">
            <label htmlFor="sacramentHymnNumber" className="block text-sm font-medium">
              Sacrament Hymn #
            </label>
            <input
              id="sacramentHymnNumber"
              name="sacramentHymnNumber"
              type="number"
              defaultValue={initialData?.sacramentHymn.number}
              aria-describedby="sacramentHymnNumber-error"
              className="mt-1 w-full rounded border border-gray-300 p-2"
            />
            <FieldError id="sacramentHymnNumber-error" messages={errors['sacramentHymn.number']} />
          </div>
          <div className="flex-1">
            <label htmlFor="sacramentHymnTitle" className="block text-sm font-medium">
              Sacrament Hymn Title
            </label>
            <input
              id="sacramentHymnTitle"
              name="sacramentHymnTitle"
              type="text"
              defaultValue={initialData?.sacramentHymn.title}
              aria-describedby="sacramentHymnTitle-error"
              className="mt-1 w-full rounded border border-gray-300 p-2"
            />
            <FieldError id="sacramentHymnTitle-error" messages={errors['sacramentHymn.title']} />
          </div>
        </div>
      </fieldset>

      {/* Speakers */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Speakers &amp; Musical Numbers</legend>
        <FieldError id="speakers-error" messages={errors['speakers']} />

        {Array.from({ length: speakerCount }).map((_, i) => (
          <div key={i} className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor={`speakerName-${i}`} className="block text-sm font-medium">
                Name {i + 1}
              </label>
              <input
                id={`speakerName-${i}`}
                name="speakerName"
                type="text"
                defaultValue={initialData?.speakers[i]?.name}
                className="mt-1 w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div>
              <label htmlFor={`speakerTopic-${i}`} className="block text-sm font-medium">
                Topic
              </label>
              <input
                id={`speakerTopic-${i}`}
                name="speakerTopic"
                type="text"
                defaultValue={initialData?.speakers[i]?.topic}
                className="mt-1 w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div>
              <label htmlFor={`speakerType-${i}`} className="block text-sm font-medium">
                Type
              </label>
              <select
                id={`speakerType-${i}`}
                name="speakerType"
                defaultValue={initialData?.speakers[i]?.type ?? 'speaker'}
                className="mt-1 w-full rounded border border-gray-300 p-2"
              >
                <option value="speaker">Speaker</option>
                <option value="musical-number">Musical Number</option>
              </select>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSpeakerCount((c) => c + 1)}
          className="text-sm text-blue-600 underline"
        >
          + Add speaker or musical number
        </button>
      </fieldset>

      {/* Closing */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Closing</legend>
        <div className="flex gap-4">
          <div className="w-32">
            <label htmlFor="closingHymnNumber" className="block text-sm font-medium">
              Closing Hymn #
            </label>
            <input
              id="closingHymnNumber"
              name="closingHymnNumber"
              type="number"
              defaultValue={initialData?.closingHymn.number}
              aria-describedby="closingHymnNumber-error"
              className="mt-1 w-full rounded border border-gray-300 p-2"
            />
            <FieldError id="closingHymnNumber-error" messages={errors['closingHymn.number']} />
          </div>
          <div className="flex-1">
            <label htmlFor="closingHymnTitle" className="block text-sm font-medium">
              Closing Hymn Title
            </label>
            <input
              id="closingHymnTitle"
              name="closingHymnTitle"
              type="text"
              defaultValue={initialData?.closingHymn.title}
              aria-describedby="closingHymnTitle-error"
              className="mt-1 w-full rounded border border-gray-300 p-2"
            />
            <FieldError id="closingHymnTitle-error" messages={errors['closingHymn.title']} />
          </div>
        </div>

        <div>
          <label htmlFor="closingPrayer" className="block text-sm font-medium">
            Closing Prayer
          </label>
          <input
            id="closingPrayer"
            name="closingPrayer"
            type="text"
            defaultValue={initialData?.closingPrayer}
            aria-describedby="closingPrayer-error"
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
          <FieldError id="closingPrayer-error" messages={errors['closingPrayer']} />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
