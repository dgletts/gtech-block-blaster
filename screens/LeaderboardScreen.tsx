import React, { useState, useEffect } from 'react';
import type { ScoreEntry } from '../types';
import { getLeaderboard } from '../services/leaderboardService';
import { Button } from '../components/UIComponents';
import { UI_TEXT_COLOR, UI_ACCENT_COLOR, RETRO_FONT_FAMILY } from '../constants';

/** Props for the LeaderboardScreenComponent. */
interface LeaderboardScreenProps {
  /** Callback function to return to the previous screen (typically Title Screen). */
  onBack: () => void;
}

/**
 * Renders the leaderboard screen.
 * Fetches and displays high scores from localStorage.
 * Provides an option to navigate back to the main menu.
 * Utilizes `React.memo` for performance optimization.
 * @param {LeaderboardScreenProps} props - The properties for the LeaderboardScreenComponent.
 * @returns {JSX.Element} The rendered leaderboard screen.
 */
const LeaderboardScreenComponent: React.FC<LeaderboardScreenProps> = React.memo(({ onBack }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  /**
   * Effect to load leaderboard scores when the component mounts.
   */
  useEffect(() => {
    setScores(getLeaderboard());
  }, []);

  /**
   * Determines the text color for a given rank for visual distinction.
   * @param {number} rank - The 0-indexed rank of the score entry.
   * @returns {string} A Tailwind CSS text color class string.
   */
  const getRankColor = (rank: number): string => {
    if (rank === 0) return 'text-yellow-400 font-bold'; 
    if (rank === 1) return 'text-slate-300 font-semibold'; 
    if (rank === 2) return 'text-amber-600 font-medium'; 
    return 'text-slate-400'; 
  };

  return (
    <div className={`w-full h-full flex flex-col items-center justify-start p-6 sm:p-8 bg-slate-900 ${RETRO_FONT_FAMILY} ${UI_TEXT_COLOR} space-y-6 overflow-y-auto`}>
      <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 sm:mb-8 text-sky-400 relative pb-2">
        LEADERBOARD
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1 bg-sky-500 rounded-full" aria-hidden="true"></span>
      </h2>
      
      {scores.length === 0 ? (
        <p className="text-xl text-slate-400 mt-10">No scores yet. Be the first to blast some blocks!</p>
      ) : (
        <div className="w-full max-w-lg bg-slate-800 shadow-xl rounded-lg p-4 sm:p-6">
          <ol className="space-y-3" aria-label="High scores list">
            {scores.map((entry, index) => (
              <li 
                key={`${entry.name}-${entry.score}-${index}-${entry.date}`} 
                className="leaderboard-entry flex items-center justify-between p-3 rounded-md transition-all duration-150 ease-in-out border-b border-slate-700 last:border-b-0 hover:shadow-md"
              >
                <span className={`text-xl sm:text-2xl w-10 ${getRankColor(index)}`}>{index + 1}.</span>
                <span className={`text-lg sm:text-xl flex-1 truncate px-2 ${getRankColor(index)}`}>{entry.name}</span>
                <span className={`text-lg sm:text-xl ${UI_ACCENT_COLOR} font-semibold w-28 text-right`}>{entry.score}</span>
                <span className="text-xs sm:text-sm text-slate-500 w-24 text-right ml-2 hidden sm:inline" suppressHydrationWarning>{entry.date}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-auto pt-8"> {/* Pushes button to bottom */}
        <Button onClick={onBack} className="w-60 py-3 text-xl" aria-label="Back to Main Menu">
          BACK TO MENU
        </Button>
      </div>
    </div>
  );
});

export default LeaderboardScreenComponent;