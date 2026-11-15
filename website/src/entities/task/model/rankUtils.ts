import { generateKeyBetween } from 'fractional-indexing';

export const generateInitialRank = (): string => generateKeyBetween(null, null);

export const generateRankBetween = (
  before: string | null,
  after: string | null
): string => generateKeyBetween(before, after);

export const generateRankAfter = (currentRank: string): string =>
  generateKeyBetween(currentRank, null);
