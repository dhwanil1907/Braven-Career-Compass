import { createContext, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_PROFILE } from '../data/persona';
import { APPLICATION_STATUSES, REFERRAL_SOURCES } from '../data/taxonomy';
import type {
  ApplicationRecord,
  ApplicationStatus,
  CareerInterest,
  Major,
  ReferralSource,
  UserProfile,
} from '../types';

export interface AppContextValue {
  savedResourceIds: string[];
  savedEventIds: string[];
  isResourceSaved(id: string): boolean;
  isEventSaved(id: string): boolean;
  toggleResource(id: string): void;
  toggleEvent(id: string): void;
  reminderEventIds: string[];
  isReminderSet(id: string): boolean;
  toggleReminder(id: string): void;
  profile: UserProfile;
  setMajor(major: Major | null): void;
  toggleInterest(interest: CareerInterest): void;
  updateProfile(changes: Partial<UserProfile>): void;
  completedStepIds: string[];
  isStepComplete(id: string): boolean;
  toggleStep(id: string): void;
  attendedEventIds: string[];
  appliedResourceIds: string[];
  /** Details per applied resource id. Ids applied before this existed may have no record. */
  applications: Record<string, ApplicationRecord>;
  isEventAttended(id: string): boolean;
  isResourceApplied(id: string): boolean;
  toggleAttended(id: string): void;
  toggleApplied(id: string): void;
  setApplicationStatus(id: string, status: ApplicationStatus): void;
  referralSource: ReferralSource | null;
  setReferralSource(source: ReferralSource | null): void;
  resetProfile(): void;
  clearSaved(): void;
  /** Replaces local data with a copy loaded from the student's account. Invalid parts are ignored. */
  restoreFromAccount(data: unknown): void;
}

const EMPTY_IDS: string[] = [];
const EMPTY_APPLICATIONS: Record<string, ApplicationRecord> = {};

function isStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isProfile(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const { major, interests } = value as Record<string, unknown>;
  const { year, goal, challenge, onboarded } = value as Record<string, unknown>;
  const isNullableString = (field: unknown) => field === null || typeof field === 'string';
  return (
    isNullableString(major) &&
    isStringArray(interests) &&
    isNullableString(year) &&
    isNullableString(goal) &&
    isNullableString(challenge) &&
    typeof onboarded === 'boolean'
  );
}

function isApplications(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.values(value).every((record) => {
    if (typeof record !== 'object' || record === null) return false;
    const { appliedAt, status } = record as Record<string, unknown>;
    return typeof appliedAt === 'string' && APPLICATION_STATUSES.some((valid) => valid === status);
  });
}

function isReferralSource(value: unknown): boolean {
  return value === null || REFERRAL_SOURCES.some((source) => source === value);
}

export const AppContext = createContext<AppContextValue | null>(null);

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedResourceIds, setSavedResourceIds] = useLocalStorage<string[]>(
    'bcc:savedResources',
    EMPTY_IDS,
    isStringArray,
  );
  const [savedEventIds, setSavedEventIds] = useLocalStorage<string[]>(
    'bcc:savedEvents',
    EMPTY_IDS,
    isStringArray,
  );
  const [reminderEventIds, setReminderEventIds] = useLocalStorage<string[]>(
    'bcc:reminderEvents',
    EMPTY_IDS,
    isStringArray,
  );
  const [profile, setProfile] = useLocalStorage<UserProfile>(
    'bcc:profile:v2',
    DEFAULT_PROFILE,
    isProfile,
  );

  const isResourceSaved = useCallback(
    (id: string) => savedResourceIds.includes(id),
    [savedResourceIds],
  );
  const isEventSaved = useCallback((id: string) => savedEventIds.includes(id), [savedEventIds]);

  const toggleResource = useCallback(
    (id: string) => setSavedResourceIds((previous) => toggleId(previous, id)),
    [setSavedResourceIds],
  );
  const toggleEvent = useCallback(
    (id: string) => setSavedEventIds((previous) => toggleId(previous, id)),
    [setSavedEventIds],
  );

  const isReminderSet = useCallback(
    (id: string) => reminderEventIds.includes(id),
    [reminderEventIds],
  );
  const toggleReminder = useCallback(
    (id: string) => setReminderEventIds((previous) => toggleId(previous, id)),
    [setReminderEventIds],
  );

  const setMajor = useCallback(
    (major: Major | null) => setProfile((previous) => ({ ...previous, major })),
    [setProfile],
  );
  const toggleInterest = useCallback(
    (interest: CareerInterest) =>
      setProfile((previous) => ({
        ...previous,
        interests: previous.interests.includes(interest)
          ? previous.interests.filter((existing) => existing !== interest)
          : [...previous.interests, interest],
      })),
    [setProfile],
  );
  const updateProfile = useCallback(
    (changes: Partial<UserProfile>) => setProfile((previous) => ({ ...previous, ...changes })),
    [setProfile],
  );
  const [completedStepIds, setCompletedStepIds] = useLocalStorage<string[]>(
    'bcc:completedSteps',
    EMPTY_IDS,
    isStringArray,
  );
  const isStepComplete = useCallback(
    (id: string) => completedStepIds.includes(id),
    [completedStepIds],
  );
  const toggleStep = useCallback(
    (id: string) => setCompletedStepIds((previous) => toggleId(previous, id)),
    [setCompletedStepIds],
  );
  const [attendedEventIds, setAttendedEventIds] = useLocalStorage<string[]>(
    'bcc:attendedEvents',
    EMPTY_IDS,
    isStringArray,
  );
  const [appliedResourceIds, setAppliedResourceIds] = useLocalStorage<string[]>(
    'bcc:appliedResources',
    EMPTY_IDS,
    isStringArray,
  );
  const isEventAttended = useCallback(
    (id: string) => attendedEventIds.includes(id),
    [attendedEventIds],
  );
  const isResourceApplied = useCallback(
    (id: string) => appliedResourceIds.includes(id),
    [appliedResourceIds],
  );
  const toggleAttended = useCallback(
    (id: string) => setAttendedEventIds((previous) => toggleId(previous, id)),
    [setAttendedEventIds],
  );
  const [applications, setApplications] = useLocalStorage<Record<string, ApplicationRecord>>(
    'bcc:applications',
    EMPTY_APPLICATIONS,
    isApplications,
  );
  const toggleApplied = useCallback(
    (id: string) => {
      if (appliedResourceIds.includes(id)) {
        setApplications((previous) => {
          const { [id]: _removed, ...rest } = previous;
          return rest;
        });
      } else {
        setApplications((previous) => ({
          ...previous,
          [id]: { appliedAt: new Date().toISOString(), status: 'Applied' },
        }));
      }
      setAppliedResourceIds((previous) => toggleId(previous, id));
    },
    [appliedResourceIds, setAppliedResourceIds, setApplications],
  );
  const setApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) =>
      setApplications((previous) => {
        const existing = previous[id];
        // Without a record (applied before dates were tracked) there is no date to keep.
        if (!existing) return previous;
        return { ...previous, [id]: { ...existing, status } };
      }),
    [setApplications],
  );
  const [referralSource, setReferralSource] = useLocalStorage<ReferralSource | null>(
    'bcc:referralSource',
    null,
    isReferralSource,
  );
  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    setCompletedStepIds([]);
    setAttendedEventIds([]);
    setAppliedResourceIds([]);
    setApplications({});
  }, [
    setProfile,
    setCompletedStepIds,
    setAttendedEventIds,
    setAppliedResourceIds,
    setApplications,
  ]);

  const clearSaved = useCallback(() => {
    setSavedResourceIds([]);
    setSavedEventIds([]);
  }, [setSavedResourceIds, setSavedEventIds]);

  const restoreFromAccount = useCallback(
    (data: unknown) => {
      if (typeof data !== 'object' || data === null) return;
      const stored = data as Record<string, unknown>;
      if (isProfile(stored.profile)) setProfile(stored.profile as UserProfile);
      if (isStringArray(stored.savedResourceIds)) {
        setSavedResourceIds(stored.savedResourceIds as string[]);
      }
      if (isStringArray(stored.savedEventIds)) setSavedEventIds(stored.savedEventIds as string[]);
      if (isStringArray(stored.reminderEventIds)) {
        setReminderEventIds(stored.reminderEventIds as string[]);
      }
      if (isStringArray(stored.completedStepIds)) {
        setCompletedStepIds(stored.completedStepIds as string[]);
      }
      if (isStringArray(stored.attendedEventIds)) {
        setAttendedEventIds(stored.attendedEventIds as string[]);
      }
      if (isStringArray(stored.appliedResourceIds)) {
        setAppliedResourceIds(stored.appliedResourceIds as string[]);
      }
      if (isApplications(stored.applications)) {
        setApplications(stored.applications as Record<string, ApplicationRecord>);
      }
      if (isReferralSource(stored.referralSource)) {
        setReferralSource(stored.referralSource as ReferralSource | null);
      }
    },
    [
      setProfile,
      setSavedResourceIds,
      setSavedEventIds,
      setReminderEventIds,
      setCompletedStepIds,
      setAttendedEventIds,
      setAppliedResourceIds,
      setApplications,
      setReferralSource,
    ],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      savedResourceIds,
      savedEventIds,
      isResourceSaved,
      isEventSaved,
      toggleResource,
      toggleEvent,
      reminderEventIds,
      isReminderSet,
      toggleReminder,
      profile,
      setMajor,
      toggleInterest,
      updateProfile,
      completedStepIds,
      isStepComplete,
      toggleStep,
      attendedEventIds,
      appliedResourceIds,
      applications,
      isEventAttended,
      isResourceApplied,
      toggleAttended,
      toggleApplied,
      setApplicationStatus,
      referralSource,
      setReferralSource,
      resetProfile,
      clearSaved,
      restoreFromAccount,
    }),
    [
      savedResourceIds,
      savedEventIds,
      isResourceSaved,
      isEventSaved,
      toggleResource,
      toggleEvent,
      reminderEventIds,
      isReminderSet,
      toggleReminder,
      profile,
      setMajor,
      toggleInterest,
      updateProfile,
      completedStepIds,
      isStepComplete,
      toggleStep,
      attendedEventIds,
      appliedResourceIds,
      applications,
      isEventAttended,
      isResourceApplied,
      toggleAttended,
      toggleApplied,
      setApplicationStatus,
      referralSource,
      setReferralSource,
      resetProfile,
      clearSaved,
      restoreFromAccount,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
