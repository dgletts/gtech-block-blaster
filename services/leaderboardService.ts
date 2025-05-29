import type { ScoreEntry } from '../types';
import { MAX_LEADERBOARD_ENTRIES } from '../constants';

const LEADERBOARD_KEY = 'gTechBlockBlasterLeaderboard';

/**
 * Retrieves the leaderboard scores from localStorage.
 * Scores are sorted by score in descending order.
 * Tie-breaking by date is simplified and not guaranteed to be perfectly chronological due to `toLocaleDateString` format.
 * For robust date sorting, ISO date strings should be used.
 * @returns {ScoreEntry[]} An array of ScoreEntry objects, sorted by score descending, 
 *                         or an empty array if no leaderboard is found or an error occurs.
 */
export const getLeaderboard = (): ScoreEntry[] => {
  try {
    const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
    if (storedLeaderboard) {
      const parsedLeaderboard: ScoreEntry[] = JSON.parse(storedLeaderboard);
      // Ensure scores are numbers and sort
      return parsedLeaderboard
        .map(entry => ({...entry, score: Number(entry.score)}))
        .sort((a, b) => b.score - a.score);
    }
  } catch (error) {
    console.error("Failed to load leaderboard from localStorage:", error);
  }
  return [];
};

/**
 * Adds a new score entry to the leaderboard.
 * The leaderboard is kept sorted (primarily by score descending) and capped at `MAX_LEADERBOARD_ENTRIES`.
 * @param {string} name - The player's name or initials for the score entry (max 15 characters).
 * @param {number} score - The score achieved by the player. Must be a positive number.
 */
export const addScoreToLeaderboard = (name: string, score: number): void => {
  if (!name.trim() || score <= 0) {
    console.warn("Attempted to add invalid score to leaderboard:", { name, score });
    return;
  }

  const newEntry: ScoreEntry = {
    name: name.trim().substring(0, 15), 
    score: Number(score), 
    date: new Date().toLocaleDateString(), 
  };

  const leaderboard = getLeaderboard(); 
  leaderboard.push(newEntry);
  
  // Re-sort after adding new entry. Primary sort: score descending.
  // Secondary sort for ties (by date) is currently simplified. 
  // For truly robust date sorting, store dates in ISO format (new Date().toISOString()) and compare those.
  leaderboard.sort((a, b) => {
    if (b.score === a.score) {
      // This simplified date sort is not reliable for true chronological ordering
      // due to varying toLocaleDateString formats.
      return 0; 
    }
    return b.score - a.score;
  });

  const updatedLeaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);

  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
  } catch (error) {
    console.error("Failed to save leaderboard to localStorage:", error);
  }
};

/**
 * Checks if a given score qualifies as a high score to be added to the leaderboard.
 * A score qualifies if it's positive and either the leaderboard isn't full,
 * or the score is greater than the lowest score on a full leaderboard.
 * @param {number} score - The score to check.
 * @returns {boolean} True if the score is a high score, false otherwise.
 */
export const isHighScore = (score: number): boolean => {
  if (score <= 0) return false;
  const leaderboard = getLeaderboard();
  if (leaderboard.length < MAX_LEADERBOARD_ENTRIES) {
    return true; 
  }
  // Qualifies if score is greater than the lowest score on the full leaderboard
  return score > leaderboard[leaderboard.length - 1].score;
};