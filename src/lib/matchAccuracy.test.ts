import { describe, expect, it } from 'vitest';
import { events } from '../data/events';
import { resources } from '../data/resources';
import goldData from './__fixtures__/relevance-gold.json';
import personaData from './__fixtures__/relevance-personas.json';
import { MIN_RECOMMENDED_PERCENT } from './matchRules';
import { scoreMatch, type MatchProfile } from './matchScore';

/**
 * Accuracy benchmark. The gold labels come from an independent judge that saw only each listing's
 * title, type, source and summary (never our tags or scores) and graded 8 student personas:
 * 3 = clearly useful, 2 = useful, 1 = marginal, 0 = not relevant (omitted from the file).
 * "Relevant" below means grade 2 or 3. Thresholds sit below the measured scores so ordinary tag
 * changes pass, but a real regression in ranking or selectivity fails.
 *
 * Baseline before the engine changes: P@5 0.43, nDCG@10 0.49, 40% of the catalog recommended.
 */
type Persona = MatchProfile & { id: string };
const personas = personaData as unknown as Persona[];
const gold = goldData as Record<string, Record<string, number>>;
const listings = [...resources, ...events];
const gain = (grade: number) => 2 ** grade - 1;

function discountedGain(grades: number[]): number {
  return grades.slice(0, 10).reduce((sum, grade, index) => sum + gain(grade) / Math.log2(index + 2), 0);
}

function evaluate(persona: Persona) {
  const labels = gold[persona.id] ?? {};
  const ranked = listings
    .map((item) => ({ percent: scoreMatch(item, persona).percent, grade: labels[item.id] ?? 0 }))
    .sort((first, second) => second.percent - first.percent);
  const ideal = Object.values(labels).sort((first, second) => second - first);
  const recommended = ranked.filter((entry) => entry.percent >= MIN_RECOMMENDED_PERCENT);
  return {
    precisionAt5: ranked.slice(0, 5).filter((entry) => entry.grade >= 2).length / 5,
    ndcgAt10: discountedGain(ranked.map((entry) => entry.grade)) / (discountedGain(ideal) || 1),
    share: recommended.length / listings.length,
    irrelevantShare: recommended.length
      ? recommended.filter((entry) => entry.grade === 0).length / recommended.length
      : 0,
  };
}

const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

describe('recommendation accuracy against judged relevance', () => {
  const results = personas.map(evaluate);

  it('puts relevant listings in the top 5 (mean precision@5 at least 0.5)', () => {
    expect(mean(results.map((result) => result.precisionAt5))).toBeGreaterThanOrEqual(0.5);
  });

  it('ranks well overall (mean nDCG@10 at least 0.52)', () => {
    expect(mean(results.map((result) => result.ndcgAt10))).toBeGreaterThanOrEqual(0.52);
  });

  it('stays selective: recommends at most 30% of the catalog on average', () => {
    expect(mean(results.map((result) => result.share))).toBeLessThanOrEqual(0.3);
  });

  it('keeps the share of irrelevant recommendations under 70%', () => {
    expect(mean(results.map((result) => result.irrelevantShare))).toBeLessThan(0.7);
  });

  it('serves a first-time CS internship seeker well (p1: P@5 of 1.0)', () => {
    const p1 = results[personas.findIndex((persona) => persona.id === 'p1')];
    expect(p1.precisionAt5).toBe(1);
  });
});
