import React, { useContext } from 'react';
import { Button } from '../components/UIComponents';
import { SettingsContext } from '../App'; 
import type { GameSettings } from '../types'; 
import { UI_TEXT_COLOR, RETRO_FONT_FAMILY } from '../constants';

// Basic SVG Icons for toggle buttons
const SoundOnIcon: React.FC = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0L19.07 5.929a1 1 0 01-1.414 1.414L15 4.757V15.243l2.657-2.657a1 1 0 011.414 1.414L16.07 17.071a1 1 0 01-1.414 0L12.93 14.07a1 1 0 011.414-1.414L17 15.243V4.757L14.343 7.343a1 1 0 01-1.414-1.414l1.728-1.728z" clipRule="evenodd" /></svg>);
const SoundOffIcon: React.FC = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>);
const MusicOnIcon: React.FC = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V4a1 1 0 00-.804-.98z" /></svg>);
const MusicOffIcon: React.FC = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.472 3.939A1 1 0 017.196 3h10A1 1 0 0118 4v.053l-2.738 2.738A1 1 0 0114.553 7H6.886A4.369 4.369 0 005 5.114V5a1 1 0 01.804-.98l.668-.133zM3 14a3 3 0 106 0 3 3 0 00-6 0zm6.894-3.886A4.369 4.369 0 019 12V7.82l8-1.6v2.946l-2.053 2.053a1 1 0 01-1.414-1.414l1.467-1.467-6.114 1.223V14.114A4.358 4.358 0 0112 14.06v2.054a1 1 0 01-.293.707l-2.636 2.636A1 1 0 017.657 19l-2.95-2.95a1 1 0 010-1.414l2.636-2.636A1 1 0 018.053 12H9.22a4.369 4.369 0 01-.326-1.886zM15 12a3 3 0 106 0 3 3 0 00-6 0z" clipRule="evenodd" /></svg>);

/** Props for the ToggleButton component. */
interface ToggleButtonProps {
  /** Current state of the toggle (true for ON, false for OFF). */
  isOn: boolean;
  /** Callback function when the button is clicked. */
  onClick: () => void;
  /** Content of the button, typically an icon and text. */
  children: React.ReactNode;
  /** HTML id attribute for accessibility and label association. */
  id?: string;
}
/**
 * A reusable toggle button component for options.
 * Utilizes `React.memo` for performance optimization.
 * @param {ToggleButtonProps} props - The properties for the ToggleButton component.
 * @returns {JSX.Element} The rendered toggle button.
 */
const ToggleButton: React.FC<ToggleButtonProps> = React.memo(({ isOn, onClick, children, id }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`w-36 py-2 px-4 rounded-md text-lg flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-yellow-400
                  ${isOn ? 'bg-green-500 hover:bg-green-400 text-white shadow-md' : 'bg-slate-600 hover:bg-slate-500 text-slate-300 shadow-sm'}`}
      aria-pressed={isOn} 
    >
      {children}
    </button>
  );
});

/** Props for the OptionsScreenComponent. */
interface OptionsScreenProps {
  /** Callback function to return to the previous screen (typically Title Screen). */
  onBack: () => void;
}

/**
 * Renders the options screen for the game.
 * Allows toggling game settings like sound effects and music using `SettingsContext`.
 * Utilizes `React.memo` for performance optimization.
 * @param {OptionsScreenProps} props - The properties for the OptionsScreenComponent.
 * @returns {JSX.Element} The rendered options screen.
 */
const OptionsScreenComponent: React.FC<OptionsScreenProps> = React.memo(({ onBack }) => {
  const settingsContextValue = useContext(SettingsContext); 

  if (!settingsContextValue) {
    // This should ideally not happen if App component is correctly wrapping with Provider
    return <div className={`w-full h-full flex items-center justify-center ${UI_TEXT_COLOR}`}>Error: Settings context not available.</div>;
  }

  const { settings, updateSettings } = settingsContextValue;

  /** Toggles the sound effects setting. Memoized with `useCallback`. */
  const toggleSoundEffects = React.useCallback(() => {
    updateSettings({ soundEffects: !settings.soundEffects });
  }, [settings.soundEffects, updateSettings]);

  /** Toggles the music setting. Memoized with `useCallback`. */
  const toggleMusic = React.useCallback(() => {
    updateSettings({ music: !settings.music });
  }, [settings.music, updateSettings]);

  return (
    <div className={`w-full h-full flex flex-col items-center justify-start p-6 sm:p-8 bg-slate-900 ${RETRO_FONT_FAMILY} ${UI_TEXT_COLOR} space-y-8`}>
      <h2 className="text-5xl sm:text-6xl font-extrabold mb-8 sm:mb-10 text-sky-400 relative pb-2">
        OPTIONS
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1 bg-sky-500 rounded-full" aria-hidden="true"></span>
      </h2>
      
      <div className="space-y-6 w-full max-w-md bg-slate-800 shadow-xl rounded-lg p-6 sm:p-8">
        <div className="flex justify-between items-center py-2">
          <label htmlFor="sound-effects-toggle" className="text-xl sm:text-2xl text-slate-300">Sound Effects:</label>
          <ToggleButton id="sound-effects-toggle" isOn={settings.soundEffects} onClick={toggleSoundEffects}>
            {settings.soundEffects ? <SoundOnIcon /> : <SoundOffIcon />} {settings.soundEffects ? 'ON' : 'OFF'}
          </ToggleButton>
        </div>
        <hr className="border-slate-700"/>
        <div className="flex justify-between items-center py-2">
          <label htmlFor="music-toggle" className="text-xl sm:text-2xl text-slate-300">Music:</label>
          <ToggleButton id="music-toggle" isOn={settings.music} onClick={toggleMusic}>
            {settings.music ? <MusicOnIcon /> : <MusicOffIcon />} {settings.music ? 'ON' : 'OFF'}
          </ToggleButton>
        </div>
      </div>

      <p className="text-sm text-slate-500 mt-6">Note: Actual audio playback is not implemented in this demo.</p>

      <div className="mt-auto pt-8"> {/* Pushes button to bottom */}
        <Button onClick={onBack} className="w-60 py-3 text-xl" aria-label="Back to Main Menu">
          BACK TO MENU
        </Button>
      </div>
    </div>
  );
});

export default OptionsScreenComponent;