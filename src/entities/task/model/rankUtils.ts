// src/entities/task/model/rankUtils.ts
const BASE_RANK = 1000;
const RANK_GAP = 1000;

export const generateInitialRank = (): string => 
  BASE_RANK.toString().padStart(6, '0');

export const generateRankBetween = (
  before: string | null, 
  after: string | null
): string => {
  const beforeNum = before ? parseInt(before) : 0;
  const afterNum = after ? parseInt(after) : beforeNum + RANK_GAP * 2;
  
  const newRank = Math.floor((beforeNum + afterNum) / 2);
  return newRank.toString().padStart(6, '0');
};

export const generateRankAfter = (currentRank: string): string => {
  const currentNum = parseInt(currentRank);
  return (currentNum + RANK_GAP).toString().padStart(6, '0');
};
