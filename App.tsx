
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameScreenState, type GameSettings } from './types';
import TitleScreenComponent from './screens/TitleScreen';
import { GameScreenComponent } from './screens/GameScreen';
import GameOverScreenComponent from './screens/GameOverScreen';
import LeaderboardScreenComponent from './screens/LeaderboardScreen';
import OptionsScreenComponent from './screens/OptionsScreen';
import { RETRO_FONT_FAMILY, GAME_WIDTH, GAME_HEIGHT, SCREEN_TRANSITION_DURATION } from './constants';

/**
 * Defines the shape of the settings context provided to child components.
 * @typedef {object} SettingsContextType
 * @property {GameSettings} settings - The current game settings.
 * @property {(newSettings: Partial<GameSettings>) => void} updateSettings - Function to update parts of the game settings.
 */
interface SettingsContextType {
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
}

/**
 * Context for accessing and updating global game settings like sound and music toggles.
 * @type {React.Context<SettingsContextType | null>}
 */
export const SettingsContext = React.createContext<SettingsContextType | null>(null);

/**
 * Main application component. Manages screen navigation, global settings, and game state transitions.
 * It acts as the root for the game application, orchestrating which screen is displayed and providing
 * global settings context to its children.
 * @returns {JSX.Element} The rendered App component.
 */
const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreenState>(GameScreenState.TITLE);
  const [lastScore, setLastScore] = useState<number>(0);
  const [settings, setSettings] = useState<GameSettings>({
    soundEffects: true, 
    music: true,       
  });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true); // Start with transition for initial fade-in
  const [transitionScreen, setTransitionScreen] = useState<GameScreenState>(GameScreenState.TITLE);

  /**
   * Initializes `transitionScreen` and handles the initial fade-in effect.
   * Runs strictly once on component mount.
   */
  useEffect(() => {
    setTransitionScreen(GameScreenState.TITLE); // Set the initial screen for rendering
    // Short delay before turning off transitioning to allow initial render then fade in
    const timer = setTimeout(() => {
        setIsTransitioning(false);
    }, 50); 
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Updates global game settings. Memoized with `useCallback`.
   * @param {Partial<GameSettings>} newSettings - A partial GameSettings object with properties to update.
   */
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []); 
  
  /**
   * Memoized value for the SettingsContext.
   * @type {SettingsContextType}
   */
  const settingsContextValue = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);

  /**
   * Navigates to a new screen with a fade transition.
   * Manages `isTransitioning` state to control opacity for fade-in/fade-out effects.
   * Memoized with `useCallback`.
   * @param {GameScreenState} screen - The target `GameScreenState` to navigate to.
   */
  const navigateTo = useCallback((screen: GameScreenState) => {
    if (currentScreen === screen && !isTransitioning) return; 
    
    setIsTransitioning(true); 

    setTimeout(() => {
      setCurrentScreen(screen);    
      setTransitionScreen(screen); // Set the screen to be rendered during/after transition

      // Short delay for the new screen to render transparently before fading in
      setTimeout(() => {
        setIsTransitioning(false); 
      }, 50); 
    }, SCREEN_TRANSITION_DURATION); 
  }, [currentScreen, isTransitioning]); 

  /**
   * Handles the action to start the game. Navigates to the Game screen.
   * Memoized with `useCallback`.
   */
  const handleGameStart = useCallback(() => {
    navigateTo(GameScreenState.GAME);
  }, [navigateTo]);

  /**
   * Handles the game over event. Sets the last score and navigates to the Game Over screen.
   * Memoized with `useCallback`.
   * @param {number} score - The player's final score from the game session.
   */
  const handleGameOver = useCallback((score: number) => {
    setLastScore(score);
    navigateTo(GameScreenState.GAME_OVER);
  }, [navigateTo]);

  /**
   * Renders the component corresponding to the given screen state.
   * This function is memoized with `useCallback` to optimize rendering and stabilize its identity.
   * @param {GameScreenState} screenToRender - The `GameScreenState` that determines which component to render.
   * @returns {JSX.Element} representing the screen.
   */
  const renderScreen = useCallback((screenToRender: GameScreenState): JSX.Element => {
    switch (screenToRender) {
      case GameScreenState.TITLE:
        return <TitleScreenComponent onStartGame={handleGameStart} onShowLeaderboard={() => navigateTo(GameScreenState.LEADERBOARD)} onShowOptions={() => navigateTo(GameScreenState.OPTIONS)} />;
      case GameScreenState.GAME:
        return <GameScreenComponent onGameOver={handleGameOver} />;
      case GameScreenState.GAME_OVER:
        return <GameOverScreenComponent score={lastScore} onRestart={handleGameStart} onMainMenu={() => navigateTo(GameScreenState.TITLE)} />;
      case GameScreenState.LEADERBOARD:
        return <LeaderboardScreenComponent onBack={() => navigateTo(GameScreenState.TITLE)} />;
      case GameScreenState.OPTIONS:
        return <OptionsScreenComponent onBack={() => navigateTo(GameScreenState.TITLE)} />;
      default:
        console.warn("Unknown screen state in renderScreen:", screenToRender);
        // Fallback to TitleScreen in case of an unknown state
        return <TitleScreenComponent onStartGame={handleGameStart} onShowLeaderboard={() => navigateTo(GameScreenState.LEADERBOARD)} onShowOptions={() => navigateTo(GameScreenState.OPTIONS)} />;
    }
  }, [handleGameStart, handleGameOver, lastScore, navigateTo]); 
  
  /**
   * Memoizes the actual screen content JSX based on `transitionScreen`.
   * `transitionScreen` is the screen that should be rendered (it updates after the fade-out starts).
   */
  const screenContent = useMemo(() => renderScreen(transitionScreen), [transitionScreen, renderScreen]);

  return (
    <SettingsContext.Provider value={settingsContextValue}>
      <div className={`w-screen h-screen flex flex-col items-center justify-center bg-slate-900 ${RETRO_FONT_FAMILY} overflow-hidden`}>
        <div 
          className="game-container relative overflow-hidden shadow-2xl border-4 border-sky-700" 
          style={{ 
            width: GAME_WIDTH, 
            height: GAME_HEIGHT,
            opacity: isTransitioning ? 0 : 1, 
            transition: `opacity ${SCREEN_TRANSITION_DURATION}ms ease-in-out`,
          }}
        >
          {screenContent}
        </div>
        <footer className="mt-4 text-slate-400 text-xs">
            gTech Block Blaster - Powered by React & Tailwind
        </footer>
      </div>
    </SettingsContext.Provider>
  );
};

export default App;