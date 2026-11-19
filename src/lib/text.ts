const KEEP_UPPER = new Set([
  'SJSU', 'AI', 'STEM', 'CS', 'HR', 'UX', 'UI', 'IT', 'MBA', 'GPA', 'SQL', 'API', 'CEO', 'PM',
  'USA', 'US', 'LGBTQ', 'STEAM', 'II', 'III', 'IV', 'Q&A', 'LLC', 'VP', 'ML', 'AWS', 'NASA',
]);

function uppercaseRatio(text: string): number {
  const letters = text.replace(/[^A-Za-z]/g, '');
  if (letters.length === 0) return 0;
  return letters.replace(/[^A-Z]/g, '').length / letters.length;
}

/**
 * Converts titles that are mostly UPPERCASE (more than 60% of letters) to Title Case, keeping
 * well-known acronyms. Titles that are already mixed case are returned unchanged.
 */
export function toDisplayCase(title: string): string {
  if (uppercaseRatio(title) <= 0.6) return title;
  return title
    .split(/(\s+)/)
    .map((part) => {
      if (part.trim() === '') return part;
      const bare = part.replace(/[^A-Za-z&]/g, '');
      if (KEEP_UPPER.has(bare)) return part;
      return part.toLowerCase().replace(/(^|[-/(])([a-z])/g, (_m, lead: string, ch: string) => lead + ch.toUpperCase());
    })
    .join('');
}
