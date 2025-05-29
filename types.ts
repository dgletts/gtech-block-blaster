
/** Defines the current active screen of the application. */
export enum GameScreenState {
  TITLE = 'TITLE',
  GAME = 'GAME',
  GAME_OVER = 'GAME_OVER',
  LEADERBOARD = 'LEADERBOARD',
  OPTIONS = 'OPTIONS',
}

/** Represents a 2D position with x and y coordinates. */
export interface Position {
  /** The x-coordinate. */
  x: number;
  /** The y-coordinate. */
  y: number;
}

/** Represents 2D dimensions with width and height. */
export interface Size {
  /** The width dimension. */
  width: number;
  /** The height dimension. */
  height: number;
}

/** 
 * Base interface for all game objects that have a position, size, and a unique ID.
 * This is typically extended by more specific game entities.
 */
export interface GameObject extends Position, Size {
  /** A unique identifier for the game object. */
  id:string;
}

/** 
 * Represents the player's starfighter and its current state within the game.
 * Includes properties for health, weapons, special abilities, and visual effects.
 */
export interface Player extends GameObject {
  /** Current number of lives remaining. */
  lives: number;
  /** Current number of bombs available. */
  bombs: number;
  /** Current weapon power level. Higher levels mean more or stronger shots. */
  weaponLevel: number;
  /** True if the player is currently invincible (e.g., after taking a hit, using a shield, or rolling). */
  isInvincible: boolean;
  /** Remaining duration of invincibility in milliseconds. */
  invincibilityTimer: number; 
  /** Timestamp of the last time the player fired a shot, used for managing fire rate cooldown. */
  lastShotTime: number;
  /** True if the player's special laser beam weapon is currently active. */
  isLaserActive?: boolean;
  /** Remaining duration of the laser beam in milliseconds. */
  laserTimer?: number; 
  /** A boolean toggle used for simple thruster animation visual state changes. */
  thrusterAnimationToggle?: boolean; 
  /** True if the player is currently performing a roll/dodge maneuver. */
  isRolling?: boolean;
  /** Remaining duration of the current roll/dodge in milliseconds. */
  rollTimer?: number; 
  /** Timestamp of the last time the player initiated a roll, for managing roll cooldown. */
  lastRollTime?: number; 
  /** Direction of the current roll ('left', 'right', or 'forward'). */
  rollDirection?: 'left' | 'right' | 'forward';
  /** Remaining cooldown time for the roll ability in milliseconds. */
  rollCooldownTimer?: number; 
  /** Timer for the subtle idle bobbing animation of the player ship. Accumulates game time. */
  idleBobTimer?: number;
  /** True if player has only 1 life left, used to trigger visual damage sparks effect. */
  showDamageSparks?: boolean;
  /** Tracks the player's last horizontal movement input direction, for directional dodge. */
  lastPlayerHorizontalMove: 'left' | 'right' | 'none';
}

/** Enumerates the different types of enemies in the game. */
export enum EnemyType {
  GRUNT = 'GRUNT',
  MID_TIER = 'MID_TIER',
  SWARM_MINION = 'SWARM_MINION',
  TELEPORTER_ELITE = 'TELEPORTER_ELITE',
  SPLITTER_DRONE = 'SPLITTER_DRONE',
  MINI_SPLITTER = 'MINI_SPLITTER',
  /** Represents the main body/entity of the Hive Overlord boss. */
  BOSS_HIVE_OVERLORD = 'BOSS_HIVE_OVERLORD', 
  /** Represents the vulnerable core part of the boss. */
  BOSS_CORE = 'BOSS_CORE',
  /** Represents a weapon pod part of the boss. */
  BOSS_WEAPON_POD = 'BOSS_WEAPON_POD',
}

/** 
 * Represents an enemy unit in the game.
 * Includes properties for type, health, points awarded, and specific behaviors.
 */
export interface Enemy extends GameObject {
  /** The type of enemy, determining its behavior and appearance. */
  type: EnemyType;
  /** Current health of the enemy. When this reaches 0 or less, the enemy is defeated. */
  health: number;
  /** Points awarded to the player upon defeating this enemy. */
  points: number;
  /** Timestamp of the last time this enemy fired a shot, for managing its fire rate cooldown. */
  lastShotTime?: number;
  /** Timestamp of the last special attack, for enemies with such abilities (e.g., Mid-Tier). */
  lastSpecialAttackTime?: number; 
  /** Timer for the visual hit flash effect when the enemy takes damage. Decrements to 0. */
  hitFlashTimer?: number; 
  /** Timer for the enemy's spawn animation. Decrements to 0, after which the enemy is fully active. */
  spawnAnimationTimer?: number; 
  /** Offset for Swarm Minion's oscillating horizontal movement pattern. */
  swarmOscillationOffset?: number; 
  // Teleporter Elite specific properties
  /** 
   * Timer for various phases of the Teleporter Elite's teleport sequence.
   * Can be positive (counting down a duration for active phases) 
   * or negative (counting up towards 0 for an off-screen cooldown period after phasing out).
   */
  teleportTimer?: number; 
  /** Current state of the Teleporter Elite's teleport behavior (e.g., 'phasing_in', 'idle'). */
  teleportState?: 'phasing_in' | 'idle' | 'telegraphing' | 'firing' | 'phasing_out';
  /** Target X-coordinate for the Teleporter Elite's next teleport location. */
  teleportTargetX?: number;
  /** Target Y-coordinate for the Teleporter Elite's next teleport location. */
  teleportTargetY?: number;
  /** Angle for aimed shots by the Teleporter Elite, calculated based on player position. */
  aimAngle?: number; 
  // Splitter Drone specific properties
  /** True if the Splitter Drone has been defeated and is currently in its splitting animation. */
  isSplitting?: boolean;
  /** Timer for the splitting animation of the Splitter Drone. Decrements to 0. */
  splitAnimTimer?: number; 
  // Boss part specific properties
  /** True if this enemy entity is a part of a larger boss. */
  isBossPart?: boolean;
  /** ID of the main boss entity this part belongs to. */
  bossParentId?: string; 
  /** Specific type of boss part (e.g., 'core', 'weapon_pod'), used for distinct behavior or visuals. */
  partType?: 'core' | 'weapon_pod'; 
  /** True if this boss part has been destroyed. Destroyed parts may still be rendered differently or stop attacking. */
  isDestroyed?: boolean;
  /** If true, this enemy (e.g. Teleporter Elite in a challenge wave) has been counted for challenge completion when it left the screen. */
  countedForChallengeClear?: boolean;
}

/** 
 * Represents a projectile (bullet) in the game.
 * Can be fired by the player or an enemy.
 */
export interface Bullet extends GameObject {
  /** True if the bullet was fired by the player, false if by an enemy. */
  isPlayerBullet: boolean;
  /** Amount of damage the bullet inflicts upon hitting a target. */
  damage: number;
  /** True if the bullet is a faster variant (e.g., from certain enemies like Teleporter Elite or Boss). */
  isFast?: boolean; 
  /** Horizontal velocity component, for bullets that don't move purely vertically. */
  vx?: number; 
  /** Vertical velocity component, for bullets that don't move purely vertically or for custom speed. */
  vy?: number; 
  /** If true, player's bullet has a visually distinct brighter core. */
  hasCore?: boolean;
  /** If true, an elite enemy's bullet has a distinct visual appearance. */
  isEliteVisual?: boolean;
  /** The type of enemy that fired this bullet, if applicable. Used for bullet visual differentiation. */
  type?: EnemyType; 
}

/** Enumerates the different types of power-ups available in the game. */
export enum PowerUpType {
  WEAPON_UPGRADE = 'WEAPON_UPGRADE',
  BOMB_CHARGE = 'BOMB_CHARGE',
  SHIELD = 'SHIELD', 
  LASER_BEAM = 'LASER_BEAM',
  SCORE_MULTIPLIER = 'SCORE_MULTIPLIER',
}

/** 
 * Represents a collectible power-up item in the game.
 * Provides various benefits to the player upon collection.
 */
export interface PowerUp extends GameObject {
  /** The type of power-up, determining its effect. */
  type: PowerUpType;
  /** Timer for the initial delay before the power-up starts attracting to the player. Decrements to 0. */
  attractionTimer?: number;
  /** True if the power-up has been collected by the player and is currently in its collection animation. */
  isCollected?: boolean;
  /** Timer for the visual animation when the power-up is collected. Decrements to 0. */
  collectAnimationTimer?: number;
}

/** 
 * Represents a visual explosion effect.
 * Includes properties for size, duration, color, and optional debris/shockwave.
 */
export interface Explosion extends Position {
  /** Unique identifier for the explosion. */
  id: string;
  /** Current visual size of the explosion, animated over time. */
  size: number;
  /** Total duration the explosion effect should last in milliseconds. */
  duration: number; 
  /** Time elapsed since the explosion started, used for animation progress. */
  elapsed: number;
  /** Tailwind background color class (e.g., 'bg-red-600') for the explosion. */
  color: string;
  /** True if the explosion should spawn debris particles. */
  hasDebris?: boolean;
  /** If true, the explosion creates an additional visual shockwave effect. */
  hasShockwave?: boolean;
}

/** Represents a single entry in the game's leaderboard. */
export interface ScoreEntry {
  /** Player's name or initials for the score entry. */
  name: string;
  /** Score achieved by the player. */
  score: number;
  /** Date the score was achieved, stored as a string (e.g., from `new Date().toLocaleDateString()`). */
  date: string; 
}

/** 
 * Represents global game settings that can be configured by the player,
 * such as sound and music volume/toggles.
 */
export interface GameSettings {
  /** True if sound effects are enabled, false otherwise. */
  soundEffects: boolean;
  /** True if music is enabled, false otherwise. */
  music: boolean;
}

/** 
 * Represents a piece of floating text displayed temporarily on screen,
 * typically for score feedback, combo counts, or power-up messages.
 */
export interface FloatingText {
  /** Unique identifier for the floating text. */
  id: string;
  /** The text content to display. */
  text: string;
  /** Current x-coordinate for rendering. */
  x: number;
  /** Current y-coordinate for rendering, animated over time. */
  y: number; 
  /** Remaining duration in milliseconds for the text to be visible. Decrements to 0. */
  lifeTimer: number; 
  /** Text color (CSS value or Tailwind class). */
  color: string; 
  /** Starting y-coordinate, used for calculating the rise animation. */
  initialY: number; 
  /** If true, text is rendered larger than default. */
  isLarge?: boolean; 
  /** If true, text is rendered even larger (e.g., for "PERFECT!" or boss messages). */
  isHuge?: boolean; 
}

/** 
 * Represents a visual muzzle flash effect at the point of firing a weapon.
 */
export interface MuzzleFlash extends Position {
  /** Unique identifier for the muzzle flash. */
  id: string;
  /** Size of the muzzle flash. */
  size: number;
  /** Remaining duration in milliseconds for the flash to be visible. Decrements to 0. */
  lifeTimer: number; 
  /** True if it's from the player's weapon, false for enemy weapons. */
  isPlayerFlash: boolean; 
  /** Rotation angle of the flash, useful for directional weapons. */
  rotation: number; 
}

/** 
 * Defines the different phases the core game loop can be in,
 * controlling game logic, UI display, and transitions.
 */
export enum GamePhase {
  /** Normal gameplay, player controls ship, enemies spawn. */
  PLAYING = 'PLAYING', 
  /** Interstitial display between stages (e.g., "STAGE 2", "PERFECT!"). */
  STAGE_TRANSITION = 'STAGE_TRANSITION', 
  /** Warning message displayed before a challenge wave starts. */
  CHALLENGE_WAVE_PENDING = 'CHALLENGE_WAVE_PENDING', 
  /** A specific, difficult wave of enemies is active; regular spawns paused. */
  CHALLENGE_WAVE_ACTIVE = 'CHALLENGE_WAVE_ACTIVE', 
  /** Warning message displayed before a boss battle begins. */
  BOSS_BATTLE_INCOMING = 'BOSS_BATTLE_INCOMING', 
  /** Boss enemy is active; regular spawns paused. */
  BOSS_BATTLE = 'BOSS_BATTLE', 
  /** Boss has been defeated; victory message and scoring. */
  BOSS_DEFEATED = 'BOSS_DEFEATED', 
}

/** 
 * Represents the state of an active boss enemy.
 * This is a complex entity with multiple parts, health, and attack phases.
 */
export interface BossState extends GameObject {
  /** Specific type of the boss, e.g., `EnemyType.BOSS_HIVE_OVERLORD`. */
  type: EnemyType.BOSS_HIVE_OVERLORD; 
  /** Maximum health of the boss. */
  maxHealth: number;
  /** Current health of the boss. */
  currentHealth: number;
  /** Current attack phase of the boss (e.g., 1, 2), influencing attack patterns. */
  phase: number; 
  /** Timers for managing various boss attack cooldowns and patterns. Keys are attack names. */
  attackTimers: { [attackName: string]: number }; 
  /** True if the main boss visual should be rendered (e.g., after an intro fly-in animation). */
  isVisible: boolean; 
  /** Current horizontal movement direction of the boss. */
  moveDirection: 'left' | 'right';
  /** Timestamp of the last time the boss changed its horizontal movement direction. */
  lastMoveChangeTime: number;
  /** Timer for the visual hit flash effect when the boss takes damage. Decrements to 0. */
  hitFlashTimer?: number;
  /** True if the boss is currently performing its laser sweep attack. */
  isLaserSweeping?: boolean;
  /** Current angle of the laser sweep in radians. */
  laserSweepAngle?: number;
  /** Remaining timer for the current laser sweep duration. */
  laserSweepTimer?: number;
  /** Remaining timer for telegraphing the laser sweep. */
  laserTelegraphTimer?: number;
}

/** 
 * Represents the entire state of the game at any given moment.
 * This object is updated on every frame to drive the game's logic and rendering.
 */
export interface GameState {
  /** Current state of the player. */
  player: Player;
  /** Array of all active enemy units, including boss parts. */
  enemies: Enemy[]; 
  /** Array of all active player bullets. */
  playerBullets: Bullet[];
  /** Array of all active enemy bullets. */
  enemyBullets: Bullet[];
  /** Array of all active power-up items on screen. */
  powerUps: PowerUp[];
  /** Array of all active explosion visual effects. */
  explosions: Explosion[];
  /** Array of all active floating text effects. */
  floatingTexts: FloatingText[];
  /** Array of all active muzzle flash effects. */
  muzzleFlashes: MuzzleFlash[];
  /** Current player score. */
  score: number;
  /** Score value displayed in the HUD, which may tick up animatedly to `score`. */
  displayedScore: number; 
  /** Current score multiplier value (e.g., 1 for normal, 2 for x2). */
  scoreMultiplier: number;
  /** Remaining duration for the current score multiplier in milliseconds. */
  scoreMultiplierTimer: number; 
  /** Current game stage number. */
  stage: number;
  /** True if the game is over, false otherwise. */
  gameOver: boolean;
  /** Total elapsed game time in milliseconds since the start of the current game session. */
  gameTime: number; 
  /** Timestamp of the last time a regular enemy was spawned. */
  lastEnemySpawnTime: number;
  /** Timestamp of the last time a Teleporter Elite enemy was spawned. */
  lastEliteSpawnTime: number; 
  /** Set of currently pressed keyboard keys (lowercase). */
  keysPressed: Set<string>; 
  /** State object for managing screen shake effects. */
  screenShake: {
    intensity: number;
    duration: number; 
    active: boolean;
    startTime: number; // Game time when shake started
  };
  /** Counter for spawning Mid-Tier enemies based on Grunt kills. */
  gruntSpawnCounter: number; 
  /** Current number of enemies killed in rapid succession for a chain kill combo. */
  chainKillCount: number;
  /** Remaining duration for the current chain kill combo window in milliseconds. */
  chainKillTimer: number; 
  /** Timestamp of the last enemy kill, used for chain kill window. */
  lastKillTime: number; 
  
  /** Current phase of the game (playing, transitioning, boss battle, etc.). */
  gamePhase: GamePhase;
  /** Timer for stage transitions, warnings, or victory messages. Decrements to 0. */
  stageTransitionTimer: number; 
  /** Main title text for stage transitions (e.g., "STAGE 2", "VICTORY!"). */
  stageTitle: string;
  /** Subtitle text for stage transitions (e.g., "GET READY!", "PERFECT!"). */
  stageSubtitle: string;
  /** True if the player has taken damage during the current stage, reset at stage start. */
  playerTookDamageThisStage: boolean;
  
  // State properties for kill-based progression and challenge waves
  /** Number of enemies defeated by the player in the current stage. */
  currentKillsThisStage: number;
  /** Total number of enemy kills required to trigger the challenge wave for the current stage. */
  targetKillsForStage: number;
  /** Definition of enemies for the current stage's challenge wave. */
  challengeWaveDefinition?: EnemyType[]; 
  /** Number of enemies remaining to be defeated in the active challenge wave. */
  challengeWaveEnemiesRemaining: number;

  // State for the active boss, if any
  /** Current state of the active boss, or undefined if no boss is active. */
  boss?: BossState;
  /** Timer for the full-screen player damage flash effect. */
  playerDamageFlashTimer?: number;
}

/** Represents a single star in the parallax background effect. */
export interface Star {
  /** Unique identifier for the star. */
  id: string;
  /** X-coordinate of the star. */
  x: number;
  /** Y-coordinate of the star. */
  y: number;
  /** Size of the star. */
  size: number;
  /** Speed multiplier for this star, creating depth in parallax. Higher values move faster. */
  speedFactor: number; 
  /** Opacity of the star (0 to 1). */
  opacity: number;
  /** Tailwind background color class for the star (e.g., 'bg-white'). */
  colorClass: string;
}

/** 
 * Represents a generic particle used for various visual effects
 * like debris, sparks, or power-up collection bursts.
 */
export interface Particle extends Position {
  /** Unique identifier for the particle. */
  id: string;
  /** Size of the particle. */
  size: number;
  /** Tailwind background color class or direct CSS color string for the particle. */
  color: string; 
  /** Remaining lifetime in milliseconds for the particle. Decrements to 0. */
  life: number; 
  /** Horizontal velocity of the particle. */
  vx: number; 
  /** Vertical velocity of the particle. */
  vy: number; 
  /** Current opacity of the particle (0 to 1), typically animated. */
  opacity: number;
  /** True if this particle is intended to represent explosion debris. */
  isDebris?: boolean; 
  /** Optional gravity effect (pixels per frame-squared, positive for downwards). */
  gravity?: number; 
  /** If true, particle is a spark (e.g., from bullet impact or player damage). */
  isSpark?: boolean; 
  /** Visual type of particle, allowing for varied rendering (e.g., 'circle', 'square', 'line'). */
  particleType?: 'circle' | 'square' | 'line'; 
  /** Current rotation angle of the particle in degrees. */
  rotation?: number; 
  /** Speed of rotation for the particle in degrees per frame. */
  rotationSpeed?: number; 
}
