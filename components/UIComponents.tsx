import React, { useContext } from 'react';
import { 
    RETRO_FONT_FAMILY, UI_TEXT_COLOR, UI_BUTTON_COLOR, UI_PULSATE_COLOR, UI_ACCENT_COLOR, HUD_BACKGROUND_COLOR, 
    WARNING_TEXT_COLOR, VICTORY_TEXT_COLOR, 
    ROLL_COOLDOWN_INDICATOR_READY_COLOR, ROLL_COOLDOWN_INDICATOR_CHARGING_COLOR, PLAYER_ROLL_COOLDOWN, 
    STAGE_TITLE_COLOR, STAGE_SUBTITLE_COLOR, STAGE_TRANSITION_DEFAULT_DURATION, STAGE_TRANSITION_WARNING_DURATION, STAGE_TRANSITION_VICTORY_DURATION,
    HUD_PROGRESS_BAR_BG_COLOR, HUD_PROGRESS_BAR_FG_COLOR, HUD_BOSS_HEALTH_BAR_BG_COLOR, HUD_BOSS_HEALTH_BAR_FG_COLOR, HUD_BOSS_HEALTH_BAR_BORDER_COLOR,
    BOSS_STAGE_TRIGGER
} from '../constants';
import { GamePhase, type GameSettings } from '../types'; 
import { SettingsContext } from '../App';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Content to be displayed inside the button. */
  children: React.ReactNode;
  /** Optional style variant for the button ('primary' or 'danger'). Defaults to 'primary'. */
  variant?: 'primary' | 'danger';
}
/**
 * A general-purpose styled button component.
 * @param {ButtonProps} props - The properties for the Button component.
 * @returns {JSX.Element} The rendered button element.
 */
const Button: React.FC<ButtonProps> = React.memo(({ children, className, variant = 'primary', ...props }) => {
  const colorClass = variant === 'danger' ? 'bg-rose-600 hover:bg-rose-500 focus:bg-rose-400' : `${UI_BUTTON_COLOR} focus:bg-sky-400`;
  return (
    <button
      className={`px-6 py-3 ${UI_TEXT_COLOR} ${colorClass} ${RETRO_FONT_FAMILY} text-lg rounded-md shadow-md hover:shadow-lg focus:shadow-xl transform hover:scale-105 focus:scale-108 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-yellow-400 active:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

interface AnimatedTextProps {
  /** The text string to display. */
  text: string;
  /** Optional additional CSS classes for styling. */
  className?: string;
  /** If true, applies a pulsing animation to the text. Defaults to true. */
  isPulsating?: boolean;
  /** Optional Tailwind animation delay class string (e.g., 'delay-100'). */
  delay?: string; 
}
/**
 * Renders text with an optional pulsing animation and custom styling.
 * @param {AnimatedTextProps} props - The properties for the AnimatedText component.
 * @returns {JSX.Element} The rendered animated text element.
 */
const AnimatedText: React.FC<AnimatedTextProps> = React.memo(({ text, className, isPulsating = true, delay }) => {
  return <p className={`${RETRO_FONT_FAMILY} ${isPulsating ? `custom-pulse ${UI_PULSATE_COLOR}` : ''} ${delay || ''} ${className}`}>{text}</p>;
});

interface ModalProps {
  /** Controls whether the modal is currently open and visible. */
  isOpen: boolean;
  /** Optional callback function invoked when the modal requests to be closed. */
  onClose?: () => void;
  /** The title displayed at the top of the modal. */
  title: string;
  /** The content to be rendered inside the modal body. */
  children: React.ReactNode;
}
/**
 * A modal dialog component for displaying information or interactive forms.
 * @param {ModalProps} props - The properties for the Modal component.
 * @returns {JSX.Element | null} The rendered modal, or null if `isOpen` is false.
 */
const Modal: React.FC<ModalProps> = React.memo(({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  React.useEffect(() => {
    if (!onClose) return; 
    const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]); 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-slate-800 p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md border-2 border-sky-500">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className={`text-2xl ${RETRO_FONT_FAMILY} ${UI_TEXT_COLOR}`}>{title}</h2>
          {onClose && (<button onClick={onClose} className={`${UI_TEXT_COLOR} text-2xl hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-sm`} aria-label="Close modal">&times;</button>)}
        </div>
        <div className={`${RETRO_FONT_FAMILY} ${UI_TEXT_COLOR}`}>{children}</div>
      </div>
    </div>
  );
});

interface HUDProps {
  /** The score value displayed in the HUD (can be animated). */
  displayedScore: number; 
  /** Current number of player lives. */
  lives: number; 
  /** Current number of player bombs. */
  bombs: number; 
  /** Current game stage. */
  stage: number; 
  /** Current player weapon level. */
  weaponLevel: number;
  // Combo count is now displayed via FloatingTextEffect in GameScreen
  /** Current score multiplier value (e.g., 1 for normal, 2 for x2). */
  scoreMultiplier: number;
  /** Remaining duration for the score multiplier. */
  scoreMultiplierTimer: number;
  /** Remaining cooldown time for the player's roll ability. */
  rollCooldownTimer: number; 
  /** Number of enemies killed in the current stage. */
  currentKillsThisStage: number; 
  /** Target number of kills for the current stage to trigger challenge wave. */
  targetKillsForStage: number;
  /** Current phase of the game, influences HUD elements like stage progress bar. */
  gamePhase: GamePhase;
}
/**
 * Heads-Up Display (HUD) for showing critical game information.
 * Combo counter is now handled by FloatingTextEffect in GameScreen.tsx.
 * @param {HUDProps} props - The properties for the HUD component.
 * @returns {JSX.Element} The rendered HUD.
 */
const HUD: React.FC<HUDProps> = React.memo(({ 
  displayedScore, lives, bombs, stage, weaponLevel, 
  scoreMultiplier, scoreMultiplierTimer, 
  rollCooldownTimer, currentKillsThisStage, targetKillsForStage, gamePhase
}) => {
  const rollCooldownPercent = Math.max(0, Math.min(100, 100 - ((rollCooldownTimer || 0) / PLAYER_ROLL_COOLDOWN * 100)));
  const stageProgressPercent = targetKillsForStage > 0 ? Math.min(100, (currentKillsThisStage / targetKillsForStage) * 100) : 0;
  
  const scoreKey = `score-${Math.floor(displayedScore)}`; 
  const livesKey = `lives-${lives}`;
  const bombsKey = `bombs-${bombs}`; 
  const stageKey = `stage-${stage}`; 
  const weaponLevelKey = `wpn-${weaponLevel}`;

  const showStageProgressBar = gamePhase === GamePhase.PLAYING && targetKillsForStage > 0 && stage < BOSS_STAGE_TRIGGER;

  return (
    <div className={`absolute top-0 left-0 right-0 p-3 ${UI_TEXT_COLOR} ${RETRO_FONT_FAMILY} text-base md:text-lg ${HUD_BACKGROUND_COLOR} flex flex-wrap justify-between items-center z-10 shadow-md gap-x-4 gap-y-1`}>
      <div key={scoreKey} className={(Math.floor(displayedScore) % 1000 > (Math.floor(displayedScore) -1 ) % 1000 && Math.floor(displayedScore) > 0) ? 'animate-pop' : ''}> Score: <span className={UI_ACCENT_COLOR}>{Math.floor(displayedScore)}</span> {scoreMultiplier > 1 && scoreMultiplierTimer > 0 && <span className="text-pink-400 text-sm ml-1">(x{scoreMultiplier}!)</span>}</div>
      <div key={stageKey} className="animate-pop">Stage: <span className={UI_ACCENT_COLOR}>{stage}</span></div>
      {showStageProgressBar && (
        <div className="w-full md:w-auto md:flex-1 order-last md:order-none mx-auto md:mx-4 my-1 md:my-0" title="Stage Progress (Kills)">
            <div className={`h-3 ${HUD_PROGRESS_BAR_BG_COLOR} rounded-full overflow-hidden border border-slate-600`}>
                <div className={`${HUD_PROGRESS_BAR_FG_COLOR} h-full rounded-full transition-all duration-300 ease-out`} style={{ width: `${stageProgressPercent}%` }}></div>
            </div>
        </div>
      )}
      <div className="flex items-center">Roll: <div className="w-10 h-3 bg-gray-700 rounded-full ml-1 overflow-hidden border border-gray-600" title="Roll Cooldown"><div className={`${rollCooldownPercent >= 100 ? ROLL_COOLDOWN_INDICATOR_READY_COLOR : ROLL_COOLDOWN_INDICATOR_CHARGING_COLOR} h-full rounded-full transition-all duration-100`} style={{width: `${rollCooldownPercent}%`}}></div></div></div>
      <div key={weaponLevelKey} className="animate-pop">WPN: <span className={UI_ACCENT_COLOR}>{weaponLevel}</span></div>
      <div key={livesKey} className="animate-pop">Lives: <span className={UI_ACCENT_COLOR}>{lives} <span className="text-xs opacity-70">(❤️)</span></span></div>
      <div key={bombsKey} className="animate-pop">Bombs: <span className={UI_ACCENT_COLOR}>{bombs} <span className="text-xs opacity-70">(💣)</span></span></div>
    </div>
  );
});

interface StageTransitionDisplayProps {
  /** Controls whether the display message is visible. */
  isVisible: boolean; 
  /** The current `GamePhase` to determine message type and styling. */
  gamePhase: GamePhase; 
  /** The main title text for the message (e.g., "STAGE 2", "WARNING!"). */
  stageTitle: string; 
  /** Optional subtitle text for the message (e.g., "GET READY!", "CHALLENGE WAVE INCOMING!"). */
  stageSubtitle?: string;
}
/**
 * Displays interstitial messages for various game phases like stage starts,
 * challenge wave warnings, boss encounter warnings, and victory messages.
 * @param {StageTransitionDisplayProps} props - The properties for the StageTransitionDisplay component.
 * @returns {JSX.Element | null} The rendered display message, or null if not `isVisible`.
 */
const StageTransitionDisplay: React.FC<StageTransitionDisplayProps> = React.memo(({ isVisible, gamePhase, stageTitle, stageSubtitle }) => {
  if (!isVisible) return null;

  let duration = STAGE_TRANSITION_DEFAULT_DURATION; 
  let titleColor = STAGE_TITLE_COLOR;
  let subtitleColor = STAGE_SUBTITLE_COLOR; 
  let titleSize = "text-5xl"; 
  let subtitleSize = "text-3xl";

  switch(gamePhase) {
    case GamePhase.CHALLENGE_WAVE_PENDING: 
      duration = STAGE_TRANSITION_WARNING_DURATION; 
      titleColor = WARNING_TEXT_COLOR; 
      subtitleColor = UI_ACCENT_COLOR; 
      titleSize = "text-6xl"; 
      break;
    case GamePhase.BOSS_BATTLE_INCOMING: 
      duration = STAGE_TRANSITION_WARNING_DURATION; 
      titleColor = WARNING_TEXT_COLOR; 
      subtitleColor = UI_PULSATE_COLOR; 
      titleSize = "text-6xl"; 
      break;
    case GamePhase.BOSS_DEFEATED: 
      duration = STAGE_TRANSITION_VICTORY_DURATION; 
      titleColor = VICTORY_TEXT_COLOR; 
      subtitleColor = UI_ACCENT_COLOR; 
      titleSize = "text-7xl"; 
      break;
    // case GamePhase.STAGE_TRANSITION: // Default case handles this
    // default:
    //   break;
  }
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none bg-black/40" 
      style={{ animation: `fadeInOut ${duration}ms ease-in-out forwards` }} 
      aria-live="assertive"
    >
      <p className={`${titleSize} font-bold ${titleColor} custom-pulse`} style={{textShadow: '2px 2px 8px black'}}>{stageTitle}</p>
      {stageSubtitle && (<p className={`${subtitleSize} font-semibold ${subtitleColor} mt-3 custom-pulse`} style={{textShadow: '1px 1px 5px black', animationDelay: '200ms'}}>{stageSubtitle}</p>)}
    </div>
  );
});

interface BossHealthBarProps {
  /** Current health of the boss. */
  currentHealth: number; 
  /** Maximum health of the boss. */
  maxHealth: number; 
  /** Controls whether the health bar is visible. */
  isVisible: boolean; 
  /** Optional name of the boss to display. Defaults to "BOSS". */
  bossName?: string;
}
/**
 * Displays the health bar for the active boss enemy.
 * Renders only when `isVisible` is true and `maxHealth` is positive.
 * @param {BossHealthBarProps} props - The properties for the BossHealthBar component.
 * @returns {JSX.Element | null} The rendered boss health bar, or null if not visible or maxHealth is invalid.
 */
const BossHealthBar: React.FC<BossHealthBarProps> = React.memo(({ currentHealth, maxHealth, isVisible, bossName = "BOSS" }) => {
  if (!isVisible || maxHealth <= 0) return null;
  const healthPercent = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
  return (
    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 md:w-1/2 max-w-md p-1.5 ${HUD_BACKGROUND_COLOR} rounded-md shadow-lg border-2 ${HUD_BOSS_HEALTH_BAR_BORDER_COLOR} z-20`}>
      <div className="flex justify-between items-center mb-1 px-1">
        <span className={`text-sm font-bold ${UI_ACCENT_COLOR}`}>{bossName}</span>
        <span className={`text-xs ${UI_TEXT_COLOR}`}>{Math.max(0,Math.ceil(currentHealth))} / {Math.ceil(maxHealth)}</span>
      </div>
      <div className={`h-3 sm:h-4 ${HUD_BOSS_HEALTH_BAR_BG_COLOR} rounded-full overflow-hidden`}>
        <div 
          className={`${HUD_BOSS_HEALTH_BAR_FG_COLOR} h-full rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${healthPercent}%` }}
          role="progressbar"
          aria-valuenow={currentHealth}
          aria-valuemin={0}
          aria-valuemax={maxHealth}
          aria-label={`${bossName} Health`}
        ></div>
      </div>
    </div>
  );
});

export { Button, AnimatedText, Modal, HUD, StageTransitionDisplay, BossHealthBar };