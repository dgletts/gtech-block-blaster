import React, { useEffect, useState } from 'react';
import { Button } from '../components/UIComponents';
import { UI_TEXT_COLOR, RETRO_FONT_FAMILY } from '../constants';

/** Props for the TitleScreenComponent. */
interface TitleScreenProps {
  /** Callback function to transition to the game screen. */
  onStartGame: () => void;
  /** Callback function to transition to the leaderboard screen. */
  onShowLeaderboard: () => void;
  /** Callback function to transition to the options screen. */
  onShowOptions: () => void;
}

/**
 * Renders the title screen of the game.
 * Features an animated title and buttons for starting the game, viewing the leaderboard, and accessing options.
 * Utilizes `React.memo` for performance optimization.
 * @param {TitleScreenProps} props - The properties for the TitleScreenComponent.
 * @returns {JSX.Element} The rendered title screen.
 */
const TitleScreenComponent: React.FC<TitleScreenProps> = React.memo(({ onStartGame, onShowLeaderboard, onShowOptions }) => {
  const [gtechVisible, setGtechVisible] = useState(false);
  const [blockBlasterVisible, setBlockBlasterVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [startTextVisible, setStartTextVisible] = useState(false);

  /**
   * Effect to trigger staggered appearance animations for title elements on component mount.
   */
  useEffect(() => {
    const timer1 = setTimeout(() => setGtechVisible(true), 100);
    const timer2 = setTimeout(() => setBlockBlasterVisible(true), 300);
    const timer3 = setTimeout(() => setStartTextVisible(true), 600); 
    const timer4 = setTimeout(() => setButtonsVisible(true), 800); 
    return () => { 
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4);
    };
  }, []); 

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 to-slate-800 ${RETRO_FONT_FAMILY} ${UI_TEXT_COLOR} space-y-6 overflow-hidden relative`}>
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(100, 116, 139, 0.5) 1px, transparent 1px), linear-gradient(to right, rgba(100, 116, 139, 0.5) 1px, transparent 1px)`, backgroundSize: `20px 20px` }} aria-hidden="true"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-2 text-center">
        <h1 
          className={`text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 transition-all duration-700 ease-out ${gtechVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-8 blur-sm'}`}
          style={{ textShadow: '0 0 15px rgba(14, 165, 233, 0.5), 0 0 25px rgba(14, 165, 233, 0.3)' }}
        >
          gTECH
        </h1>
        <h2 
          className={`text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-700 ease-out ${blockBlasterVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'}`}
          style={{ textShadow: '0 0 15px rgba(251, 191, 36, 0.5), 0 0 25px rgba(251, 191, 36, 0.3)', transitionDelay: '150ms', letterSpacing: '0.05em' }}
        >
          BLOCK BLASTER
        </h2>
      </div>
      
      <p 
        className={`text-3xl mt-16 digital-pulse transition-opacity duration-500 ease-in-out ${startTextVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: '300ms' }} 
      >
        PRESS START
      </p>
    
      <div className={`relative z-10 mt-10 space-y-4 flex flex-col items-center transition-opacity duration-700 ease-in-out ${buttonsVisible ? 'opacity-100' : 'opacity-0'}`} style={{transitionDelay: '450ms'}}>
        <Button onClick={onStartGame} className="w-72 py-3 text-xl" aria-label="Start Game">START GAME</Button>
        <Button onClick={onShowLeaderboard} className="w-72 py-3 text-xl" aria-label="View Leaderboard">LEADERBOARD</Button>
        <Button onClick={onShowOptions} className="w-72 py-3 text-xl" aria-label="Open Options Menu">OPTIONS</Button>
      </div>

      <p className={`relative z-10 absolute bottom-6 text-xs text-slate-400 transition-opacity duration-500 ease-in-out ${buttonsVisible ? 'opacity-100' : 'opacity-0'}`} style={{transitionDelay: '600ms'}}>
        Arrow Keys/WASD: Move | Space: Shoot | Q: Bomb | Shift: Dodge
      </p>
    </div>
  );
});

export default TitleScreenComponent;