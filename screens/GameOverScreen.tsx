import React, { useState, useEffect, useCallback } from 'react';
import { Button, AnimatedText, Modal } from '../components/UIComponents';
import { addScoreToLeaderboard, isHighScore } from '../services/leaderboardService';
import { UI_TEXT_COLOR, UI_ACCENT_COLOR, RETRO_FONT_FAMILY } from '../constants';

/** Props for the GameOverScreenComponent. */
interface GameOverScreenProps {
  /** The final score achieved by the player in the last game session. */
  score: number;
  /** Callback function to restart the game, typically navigating to the Game screen. */
  onRestart: () => void;
  /** Callback function to return to the main menu, typically navigating to the Title screen. */
  onMainMenu: () => void;
}

/**
 * Renders the Game Over screen.
 * Displays the player's final score and provides options to restart or return to the main menu.
 * If the score is a high score, it prompts the player to enter their initials.
 * Utilizes `React.memo` for performance optimization.
 * @param {GameOverScreenProps} props - The properties for the GameOverScreenComponent.
 * @returns {JSX.Element} The rendered game over screen.
 */
const GameOverScreenComponent: React.FC<GameOverScreenProps> = React.memo(({ score, onRestart, onMainMenu }) => {
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /**
   * Effect to check if the score is a high score and show the name input modal if it is.
   * Runs when the `score` prop changes. Resets name input and submission state.
   */
  useEffect(() => {
    if (isHighScore(score) && score > 0) {
      setShowNameInput(true);
    } else {
      setShowNameInput(false); 
    }
    setSubmitted(false); 
    setName(''); // Reset name input for new high score opportunities
  }, [score]);

  /**
   * Handles changes to the name input field.
   * Converts input to uppercase and limits to 3 characters.
   * Memoized with `useCallback`.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.toUpperCase().slice(0, 3));
  }, []);

  /**
   * Handles the submission of a high score.
   * Adds the score to the leaderboard and updates UI state.
   * Memoized with `useCallback`.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmitScore = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && score > 0) {
      addScoreToLeaderboard(name, score);
      setSubmitted(true);
      setShowNameInput(false); 
    }
  }, [name, score]);

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 ${RETRO_FONT_FAMILY} ${UI_TEXT_COLOR} space-y-6`}>
      <AnimatedText text="GAME OVER" className={`text-6xl ${UI_TEXT_COLOR}`} isPulsating={true} />
      <p className="text-4xl">Final Score: <span className={UI_ACCENT_COLOR}>{score}</span></p>

      <Modal isOpen={showNameInput && !submitted} title="High Score!" onClose={() => setShowNameInput(false)}>
        <form onSubmit={handleSubmitScore} className="space-y-4">
          <p>Congratulations! You've achieved a high score!</p>
          <p>Enter your initials (3 letters):</p>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            maxLength={3}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-center text-2xl tracking-[0.5em] font-mono focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            autoFocus
            aria-label="Enter your initials for high score"
          />
          <Button type="submit" className="w-full" disabled={name.trim().length === 0}>SUBMIT SCORE</Button>
        </form>
      </Modal>
      
      {submitted && (<p className={`text-xl ${UI_ACCENT_COLOR}`}>Score Submitted! Well done!</p>)}

      <div className="mt-8 space-y-4 flex flex-col items-center">
        <Button onClick={onRestart} className="w-56" aria-label="Restart Game">RETRY</Button>
        <Button onClick={onMainMenu} className="w-56" aria-label="Return to Main Menu">MAIN MENU</Button>
      </div>
    </div>
  );
});

export default GameOverScreenComponent;