/** Place search for listings: exact places ("San Jose, CA") plus broader regions ("California"). */

export interface PlaceOption {
  /** What the student sees and types against. */
  label: string;
  /** What the filter stores: the exact place, or `state:CA` for a whole state. */
  value: string;
  count: number;
  kind: 'region' | 'place';
}

const STATE_NAMES: Record<string, string> = {
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  FL: 'Florida',
  GA: 'Georgia',
  IL: 'Illinois',
  MA: 'Massachusetts',
  NC: 'North Carolina',
  NJ: 'New Jersey',
  NV: 'Nevada',
  NY: 'New York',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  WA: 'Washington',
};

const STATE_PREFIX = 'state:';

export function normalizePlace(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** The two-letter state at the end of "City, ST", or null for places without one. */
export function stateOf(place: string): string | null {
  const match = /,\s*([A-Z]{2})$/.exec(place.trim());
  return match ? match[1] : null;
}

/** Distinct places and their states, each with how many listings are there. */
export function buildPlaceOptions(places: (string | undefined)[]): PlaceOption[] {
  const placeCounts = new Map<string, number>();
  const stateCounts = new Map<string, number>();
  for (const place of places) {
    if (!place) continue;
    placeCounts.set(place, (placeCounts.get(place) ?? 0) + 1);
    const state = stateOf(place);
    if (state) stateCounts.set(state, (stateCounts.get(state) ?? 0) + 1);
  }
  const regions: PlaceOption[] = [...stateCounts].map(([state, count]) => ({
    label: STATE_NAMES[state] ?? state,
    value: `${STATE_PREFIX}${state}`,
    count,
    kind: 'region',
  }));
  const exact: PlaceOption[] = [...placeCounts].map(([place, count]) => ({
    label: place,
    value: place,
    count,
    kind: 'place',
  }));
  return [...regions, ...exact];
}

/** Options whose label contains every word typed, best matches first. */
export function suggestPlaces(options: PlaceOption[], query: string, limit = 8): PlaceOption[] {
  const words = normalizePlace(query).split(/\s+/).filter(Boolean);
  const scored = options.flatMap((option) => {
    const label = normalizePlace(option.label);
    if (!words.every((word) => label.includes(word))) return [];
    const startsWith = words.length > 0 && label.startsWith(words[0]) ? 0 : 1;
    return [{ option, rank: startsWith * 2 + (option.kind === 'region' ? 0 : 1) }];
  });
  return scored
    .sort(
      (first, second) =>
        first.rank - second.rank ||
        second.option.count - first.option.count ||
        first.option.label.localeCompare(second.option.label),
    )
    .slice(0, limit)
    .map((entry) => entry.option);
}

/** True when a listing's place fits the chosen filter value ('' means anywhere). */
export function matchesPlace(place: string | undefined, value: string): boolean {
  if (value === '') return true;
  if (!place) return false;
  if (value.startsWith(STATE_PREFIX)) return stateOf(place) === value.slice(STATE_PREFIX.length);
  return place === value;
}

export function placeLabel(options: PlaceOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? '';
}
