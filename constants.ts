
import { EnemyType } from './types'; 

// Game Dimensions & Player Configuration
/** Width of the game area in pixels. */
export const GAME_WIDTH = 600;
/** Height of the game area in pixels. */
export const GAME_HEIGHT = 800;

/** Initial X-coordinate for the player's starting position. */
export const PLAYER_START_X = GAME_WIDTH / 2 - 16;
/** Initial Y-coordinate for the player's starting position. */
export const PLAYER_START_Y = GAME_HEIGHT - 80;
/** Width of the player's ship in pixels. */
export const PLAYER_WIDTH = 32;
/** Height of the player's ship in pixels. */
export const PLAYER_HEIGHT = 32;
/** Base speed of the player's ship in pixels per 16ms frame. */
export const PLAYER_SPEED = 6; 
/** Initial number of lives for the player. */
export const PLAYER_INITIAL_LIVES = 3;
/** Initial number of bombs for the player. */
export const PLAYER_INITIAL_BOMBS = 2;
/** Cooldown duration between player shots in milliseconds. */
export const PLAYER_FIRE_COOLDOWN = 110; 
/** Duration of player invincibility after taking a hit, in milliseconds. */
export const PLAYER_INVINCIBILITY_DURATION = 2000; 
/** Primary color for player thruster animation. */
export const PLAYER_THRUSTER_COLOR_1 = 'bg-orange-400';
/** Secondary color for player thruster animation. */
export const PLAYER_THRUSTER_COLOR_2 = 'bg-yellow-400';
/** Duration of the player's roll/dodge maneuver in milliseconds. */
export const PLAYER_ROLL_DURATION = 350; 
/** Cooldown duration for the player's roll ability in milliseconds. */
export const PLAYER_ROLL_COOLDOWN = 2000; 
/** Speed multiplier applied during a player roll. */
export const PLAYER_ROLL_SPEED_MULTIPLIER = 1.8;
/** Opacity of the player ship during a roll. */
export const PLAYER_ROLL_OPACITY = 0.6;
/** Amplitude of the player's idle bobbing animation in pixels. */
export const PLAYER_IDLE_BOB_AMPLITUDE = 2; 
/** Speed of the player's idle bobbing animation in radians per millisecond. */
export const PLAYER_IDLE_BOB_SPEED = 0.003; 
/** Interval between player low-health damage spark emissions in milliseconds. */
export const PLAYER_LOW_HEALTH_SPARK_INTERVAL = 200; 
/** Duration for the player damage screen flash effect */
export const PLAYER_DAMAGE_FLASH_DURATION = 300; // ms

// Bullet Configuration
/** Default width of player and standard enemy bullets. */
export const BULLET_WIDTH = 6; 
/** Default height of player and standard enemy bullets. */
export const BULLET_HEIGHT = 18; 
/** Width for more visually distinct enemy bullets (e.g., square). */
export const ENEMY_BULLET_WIDTH = 8;
/** Height for more visually distinct enemy bullets (e.g., square). */
export const ENEMY_BULLET_HEIGHT = 8;
/** Speed of player bullets in pixels per 16ms frame. */
export const PLAYER_BULLET_SPEED = 13; 
/** Base speed of enemy bullets in pixels per 16ms frame. */
export const ENEMY_BULLET_SPEED = 4.5; 
/** Damage inflicted by a standard player bullet. */
export const PLAYER_BULLET_DAMAGE = 1;
/** Speed for faster enemy bullets (e.g., from Teleporter Elite). */
export const ENEMY_ELITE_BULLET_SPEED = 7; 
/** Number of spark particles generated on bullet impact. */
export const BULLET_IMPACT_SPARK_COUNT = 5;
/** Lifetime of bullet impact spark particles in milliseconds. */
export const BULLET_IMPACT_SPARK_LIFE = 150; 
/** Base size of bullet impact spark particles. */
export const BULLET_IMPACT_SPARK_SIZE = 2;

// --- Enemy Configurations ---

// Enemy: Grunt Configuration
export const ENEMY_GRUNT_WIDTH = 30;
export const ENEMY_GRUNT_HEIGHT = 30;
export const ENEMY_GRUNT_HEALTH = 1;
export const ENEMY_GRUNT_POINTS = 100;
export const ENEMY_GRUNT_SPEED = 2.2;
export const ENEMY_GRUNT_FIRE_COOLDOWN = 1700; 

// Enemy: Mid-Tier Configuration
export const ENEMY_MID_TIER_WIDTH = 45;
export const ENEMY_MID_TIER_HEIGHT = 45;
export const ENEMY_MID_TIER_HEALTH = 10;
export const ENEMY_MID_TIER_POINTS = 500;
export const ENEMY_MID_TIER_SPEED = 1.5;
export const ENEMY_MID_TIER_FIRE_COOLDOWN = 1400; 
export const ENEMY_MID_TIER_SPECIAL_ATTACK_COOLDOWN = 4500; 
export const ENEMY_MID_TIER_SPAWN_THRESHOLD = 4; // Spawn one mid-tier after this many grunts

// Enemy: Swarm Minion Configuration
export const ENEMY_SWARM_MINION_WIDTH = 18;
export const ENEMY_SWARM_MINION_HEIGHT = 18;
export const ENEMY_SWARM_MINION_HEALTH = 1;
export const ENEMY_SWARM_MINION_POINTS = 50;
export const ENEMY_SWARM_MINION_SPEED = 3.8;
export const ENEMY_SWARM_MINION_SPAWN_COUNT = 5; 
export const ENEMY_SWARM_MINION_OSCILLATION_SPEED = 0.055; // radians per frame-time
export const ENEMY_SWARM_MINION_OSCILLATION_AMPLITUDE = 45; 

// Enemy: Teleporter Elite Configuration
export const ENEMY_TELEPORTER_ELITE_WIDTH = 40;
export const ENEMY_TELEPORTER_ELITE_HEIGHT = 40;
export const ENEMY_TELEPORTER_ELITE_HEALTH = 15;
export const ENEMY_TELEPORTER_ELITE_POINTS = 1200;
export const ENEMY_TELEPORTER_ELITE_PHASE_IN_DURATION = 500; // ms
export const ENEMY_TELEPORTER_ELITE_IDLE_DURATION = 750; // ms
export const ENEMY_TELEPORTER_ELITE_TELEGRAPH_DURATION = 600; // ms
export const ENEMY_TELEPORTER_ELITE_PHASE_OUT_DURATION = 400; // ms
export const ENEMY_TELEPORTER_ELITE_COOLDOWN_BETWEEN_TELEPORTS = 1500; // ms
export const ENEMY_TELEPORTER_ELITE_SPAWN_INTERVAL = 25000; // ms

// Enemy: Splitter Drone Configuration
export const ENEMY_SPLITTER_DRONE_WIDTH = 40;
export const ENEMY_SPLITTER_DRONE_HEIGHT = 40;
export const ENEMY_SPLITTER_DRONE_HEALTH = 8;
export const ENEMY_SPLITTER_DRONE_POINTS = 300;
export const ENEMY_SPLITTER_DRONE_SPEED = 1.2;
export const ENEMY_SPLITTER_DRONE_SPLIT_COUNT = 3; // Number of Mini-Splitters to spawn
export const ENEMY_SPLITTER_ANIM_DURATION = 300; // ms for splitting animation

// Enemy: Mini-Splitter Configuration
export const ENEMY_MINI_SPLITTER_WIDTH = 20;
export const ENEMY_MINI_SPLITTER_HEIGHT = 20;
export const ENEMY_MINI_SPLITTER_HEALTH = 2;
export const ENEMY_MINI_SPLITTER_POINTS = 75;
export const ENEMY_MINI_SPLITTER_SPEED = 2.8;
export const ENEMY_MINI_SPLITTER_FIRE_COOLDOWN = 2200; // ms
export const ENEMY_MINI_SPLITTER_MOVE_VARIANCE = 0.5; // For erratic movement

// General Enemy Spawning Configuration
export const INITIAL_ENEMY_SPAWN_COOLDOWN = 1700; // ms
export const MIN_ENEMY_SPAWN_COOLDOWN = 300; // ms
export const ENEMY_SPAWN_COOLDOWN_DECREMENT = 100; // ms, per stage

// Power-Up Configuration
/** Default width for power-up items. */
export const POWERUP_WIDTH = 28;
/** Default height for power-up items. */
export const POWERUP_HEIGHT = 28;
/** Base speed for power-up item downward movement. */
export const POWERUP_SPEED = 2.2; 
/** Base drop chance for power-ups from Grunt enemies. */
export const POWERUP_DROP_CHANCE = 0.1; 
/** Drop chance for power-ups from Mid-Tier enemies. */
export const POWERUP_DROP_CHANCE_MID_TIER = 0.33; 
/** Drop chance for power-ups from Swarm Minions. */
export const POWERUP_DROP_CHANCE_SWARM = 0.02; 
/** Drop chance for power-ups from Teleporter Elites. */
export const POWERUP_DROP_CHANCE_ELITE = 0.6;
/** Drop chance for power-ups from Splitter Drones. */
export const POWERUP_DROP_CHANCE_SPLITTER = 0.25; 
/** Drop chance for power-ups from Mini-Splitters. */
export const POWERUP_DROP_CHANCE_MINI_SPLITTER = 0.05; 
/** Maximum weapon power level achievable by the player. */
export const POWERUP_WEAPON_MAX_LEVEL = 4;
/** Duration of the Laser Beam power-up in milliseconds. */
export const POWERUP_LASER_BEAM_DURATION = 6000; 
/** Interval between laser damage ticks in milliseconds when Laser Beam is active. */
export const POWERUP_LASER_DAMAGE_TICK_RATE = 100; 
/** Radius within which power-ups start attracting towards the player. */
export const POWERUP_ATTRACT_RADIUS = 120; 
/** Speed factor for power-up attraction movement towards the player. */
export const POWERUP_ATTRACT_SPEED = 0.15; 
/** Duration of the Score Multiplier power-up in milliseconds. */
export const POWERUP_SCORE_MULTIPLIER_DURATION = 8000; 
/** Value of the score multiplier (e.g., 2 for x2 score). */
export const POWERUP_SCORE_MULTIPLIER_VALUE = 2; 
/** Duration of the power-up collection animation (scale up/fade out) in milliseconds. */
export const POWERUP_COLLECT_ANIM_DURATION = 300; 
/** Scale factor applied to power-ups during their collection animation. */
export const POWERUP_COLLECT_ANIM_SCALE = 1.5; 

// Explosion Configuration
export const EXPLOSION_INITIAL_SIZE = 10;
export const EXPLOSION_MAX_SIZE = 75;
export const EXPLOSION_DURATION = 400; // ms
export const EXPLOSION_DEBRIS_COUNT = 5;
export const EXPLOSION_DEBRIS_SPEED = 3;
export const EXPLOSION_DEBRIS_GRAVITY = 0.1;
export const EXPLOSION_SHOCKWAVE_DURATION = 250; // ms
export const EXPLOSION_SHOCKWAVE_MAX_SCALE = 2.5; // Multiplier of initial explosion size

// Screen Shake Configuration
export const SCREEN_SHAKE_DEFAULT_INTENSITY = 5;
export const SCREEN_SHAKE_BOMB_INTENSITY = 12;
export const SCREEN_SHAKE_HIT_INTENSITY = 10; // Increased from 8 for more player impact
export const SCREEN_SHAKE_BOSS_HIT_INTENSITY = 3; // New for boss hits
export const SCREEN_SHAKE_DURATION_SHORT = 150; // ms
export const SCREEN_SHAKE_DURATION_MEDIUM = 300; // ms
export const SCREEN_SHAKE_BOSS_HIT_DURATION = 100; // New for boss hits

// --- UI & Game Flow Configuration ---
/** Maximum number of entries displayed on the leaderboard. */
export const MAX_LEADERBOARD_ENTRIES = 10;
/** Default duration for stage transition messages (e.g., "STAGE X") in milliseconds. */
export const STAGE_TRANSITION_DEFAULT_DURATION = 2500; 
/** Duration for warning messages (Challenge Wave, Boss Incoming) in milliseconds. */
export const STAGE_TRANSITION_WARNING_DURATION = 2000; 
/** Duration for the "VICTORY!" message after defeating a boss, in milliseconds. */
export const STAGE_TRANSITION_VICTORY_DURATION = 3500; 
/** Bonus points awarded for completing a stage without taking damage. */
export const PERFECT_STAGE_BONUS = 1000; 

/** Target number of enemy kills required to trigger the challenge wave for each stage. */
export const KILLS_PER_STAGE = [20, 35, 10]; // Stage 3 is boss stage, fewer normal kills before boss.
/** The stage number at which the boss battle is triggered (e.g., 3 means boss is for Stage 3). */
export const BOSS_STAGE_TRIGGER = 3; 

/** Definitions for challenge waves for each stage. Each sub-array lists EnemyTypes for that wave. */
export const CHALLENGE_WAVES: EnemyType[][] = [
  // Stage 1 Challenge Wave - Target: ~25-30 enemies
  [
    EnemyType.SWARM_MINION, EnemyType.SWARM_MINION, EnemyType.SWARM_MINION, EnemyType.SWARM_MINION, // 4 * 5 = 20 minions
    EnemyType.MID_TIER, EnemyType.MID_TIER, EnemyType.MID_TIER,        // 3 mid-tiers
    EnemyType.GRUNT, EnemyType.GRUNT, EnemyType.GRUNT, EnemyType.GRUNT, EnemyType.GRUNT, // 5 grunts
  ], // Total: 20 (swarm) + 3 (mid) + 5 (grunt) = 28 enemies
  // Stage 2 Challenge Wave - Target: ~25-35 enemies
  [ 
    EnemyType.TELEPORTER_ELITE,
    EnemyType.SPLITTER_DRONE, EnemyType.SPLITTER_DRONE, EnemyType.MID_TIER, EnemyType.MID_TIER,
    EnemyType.SWARM_MINION, EnemyType.SWARM_MINION, EnemyType.SWARM_MINION, EnemyType.SWARM_MINION, // 4 * 5 = 20 minions
    EnemyType.MID_TIER, EnemyType.GRUNT, EnemyType.GRUNT, EnemyType.GRUNT,
  ], // Total initial: 1 (elite) + 2 (splitter) + 3 (mid) + 20 (swarm) + 3 (grunt) = 29. If splitters split: 29 - 2 + (2*3) = 33
  // Stage 3 is the BOSS stage itself, no separate challenge wave from this array.
  // Placeholder for stages beyond boss, if any:
  [
    EnemyType.TELEPORTER_ELITE, EnemyType.TELEPORTER_ELITE, EnemyType.TELEPORTER_ELITE,
    EnemyType.SPLITTER_DRONE, EnemyType.SPLITTER_DRONE, EnemyType.SPLITTER_DRONE,
    EnemyType.MID_TIER, EnemyType.MID_TIER, EnemyType.MID_TIER, EnemyType.MID_TIER, EnemyType.MID_TIER,
    EnemyType.SWARM_MINION, EnemyType.SWARM_MINION,
  ], // Total initial for placeholder: 3 (elite) + 3 (splitter) + 5 (mid) + 10 (swarm) = 21. If split: 21-3+(3*3)=27
];

/** Duration for fade-in/fade-out screen transitions in App.tsx, in milliseconds. */
export const SCREEN_TRANSITION_DURATION = 300; 
/** Duration of the visual hit flash effect on enemies, in milliseconds. */
export const ENEMY_HIT_FLASH_DURATION = 100; 
/** Duration of the enemy spawn animation, in milliseconds. */
export const ENEMY_SPAWN_ANIMATION_DURATION = 250; 
/** Default duration for floating text effects, in milliseconds. */
export const FLOATING_TEXT_DURATION = 1000; 
/** Amount floating text rises during its animation, in pixels. */
export const FLOATING_TEXT_RISE_AMOUNT = 30; 
/** Specific duration for combo floating text, in milliseconds. */
export const FLOATING_TEXT_DURATION_COMBO = 1200; 

/** Duration of the window to achieve a chain kill combo, in milliseconds. */
export const CHAIN_KILL_WINDOW_DURATION = 1600; 
/** Bonus points awarded per kill in a chain, multiplied by the score multiplier. */
export const CHAIN_KILL_BONUS_PER_KILL = 30; 

// Muzzle Flash Configuration
export const MUZZLE_FLASH_DURATION = 80; // ms
export const MUZZLE_FLASH_SIZE_PLAYER = 18;
export const MUZZLE_FLASH_SIZE_ENEMY = 15;
export const MUZZLE_FLASH_SIZE_ELITE = 22;

// Score Ticking Animation
export const SCORE_TICK_SPEED_FACTOR = 0.15; 
export const SCORE_TICK_MIN_INCREMENT = 1;

// --- Boss: Hive Overlord Configuration ---
export const BOSS_HIVE_OVERLORD_WIDTH = 180;
export const BOSS_HIVE_OVERLORD_HEIGHT = 100;
export const BOSS_HIVE_OVERLORD_X = GAME_WIDTH / 2 - BOSS_HIVE_OVERLORD_WIDTH / 2;
export const BOSS_HIVE_OVERLORD_Y = 80; // Target Y position after entry animation
export const BOSS_HIVE_OVERLORD_MAX_HEALTH = 300; // Total health for the entire boss entity
export const BOSS_HIVE_OVERLORD_POINTS = 20000; // Points for defeating the boss
export const BOSS_HIVE_OVERLORD_MOVE_SPEED = 0.8; // Pixels per 16ms frame for horizontal patrol
export const BOSS_HIVE_OVERLORD_MOVE_INTERVAL = 3000; // Milliseconds between changing horizontal direction

export const BOSS_CORE_WIDTH = 50;
export const BOSS_CORE_HEIGHT = 50;
// Health for the Core part; damage to it also reduces BOSS_HIVE_OVERLORD_MAX_HEALTH.
export const BOSS_CORE_HEALTH = 100; 
export const BOSS_CORE_POINTS_ON_DESTROY = 2000; // Not used as core isn't "destroyed" separately

export const BOSS_WEAPON_POD_WIDTH = 40;
export const BOSS_WEAPON_POD_HEIGHT = 60;
export const BOSS_WEAPON_POD_HEALTH = 75; // Health for each weapon pod part
export const BOSS_WEAPON_POD_POINTS_ON_DESTROY = 1500; // Bonus points for destroying a pod
export const BOSS_WEAPON_POD_FIRE_COOLDOWN = 2000; // ms
export const BOSS_CORE_SPREAD_SHOT_COOLDOWN = 3500; // ms
export const BOSS_CORE_LASER_SWEEP_COOLDOWN_PHASE2 = 7000; // ms
export const BOSS_CORE_LASER_SWEEP_DURATION = 1500; // ms

// --- COLORS ---
// Player Colors
export const PLAYER_COLOR = 'bg-sky-400';
export const PLAYER_HITBOX_COLOR = 'bg-white'; // For the small core
export const PLAYER_BULLET_COLOR = 'bg-cyan-300';
export const PLAYER_BULLET_CORE_COLOR = 'bg-white'; // Inner core of player bullets
export const PLAYER_LASER_BEAM_COLOR = 'bg-red-500';
export const PLAYER_MUZZLE_FLASH_COLOR = 'bg-yellow-300';
export const PLAYER_ROLL_TRAIL_COLOR = 'bg-sky-300/30';
export const PLAYER_DAMAGE_SPARK_COLOR = 'bg-orange-500';

// Enemy Colors
export const ENEMY_GRUNT_COLOR = 'bg-rose-500';
export const ENEMY_BULLET_COLOR = 'bg-amber-400';
export const ENEMY_MID_TIER_COLOR = 'bg-purple-600';
export const ENEMY_MID_TIER_BULLET_COLOR = 'bg-pink-500';
export const ENEMY_SWARM_MINION_COLOR = 'bg-lime-400';
export const ENEMY_TELEPORTER_ELITE_COLOR = 'bg-indigo-700';
export const ENEMY_ELITE_BULLET_COLOR = 'bg-fuchsia-500'; // For fast elite bullets
export const ENEMY_SPLITTER_DRONE_COLOR = 'bg-teal-500';
export const ENEMY_MINI_SPLITTER_COLOR = 'bg-teal-300';
export const ENEMY_MINI_SPLITTER_BULLET_COLOR = 'bg-cyan-500';
export const ENEMY_TELEPORTER_ELITE_TELEGRAPH_COLOR = 'border-pink-500'; // Border for telegraphing
export const ENEMY_HIT_FLASH_COLOR = 'bg-white';
export const ENEMY_MUZZLE_FLASH_COLOR = 'bg-orange-400';

// Boss Colors
export const BOSS_HIVE_OVERLORD_COLOR = 'bg-slate-700'; // Main body
export const BOSS_CORE_COLOR = 'bg-red-700'; // Vulnerable core
export const BOSS_CORE_HIT_FLASH_COLOR = 'bg-red-400';
export const BOSS_WEAPON_POD_COLOR = 'bg-indigo-600'; // Weapon pods
export const BOSS_WEAPON_POD_HIT_FLASH_COLOR = 'bg-indigo-300';
export const BOSS_BULLET_COLOR = 'bg-purple-400';
export const BOSS_LASER_COLOR = 'bg-pink-500'; // For phase 2 laser sweep

// Power-Up Colors & Visuals
export const POWERUP_WEAPON_COLOR = 'bg-emerald-500'; 
export const POWERUP_BOMB_COLOR = 'bg-orange-500'; 
export const POWERUP_SHIELD_COLOR = 'bg-violet-500'; 
export const POWERUP_LASER_COLOR = 'bg-yellow-400'; 
export const POWERUP_SCORE_MULTIPLIER_COLOR = 'bg-pink-500';

// Particle Colors for PowerUp Collection
export const PARTICLE_WEAPON_UP_COLOR = POWERUP_WEAPON_COLOR;
export const PARTICLE_BOMB_CHARGE_COLOR = POWERUP_BOMB_COLOR;
export const PARTICLE_SHIELD_COLOR = POWERUP_SHIELD_COLOR;
export const PARTICLE_LASER_BEAM_COLOR = POWERUP_LASER_COLOR;
export const PARTICLE_SCORE_MULTIPLIER_COLOR = POWERUP_SCORE_MULTIPLIER_COLOR;
export const PARTICLE_BOSS_HIT_COLOR = 'bg-pink-400'; // New for boss hits

// Effect Colors
export const EXPLOSION_ENEMY_COLOR = 'bg-red-600';
export const EXPLOSION_PLAYER_COLOR = 'bg-blue-600';
export const EXPLOSION_BOSS_PART_COLOR = 'bg-orange-500';
export const EXPLOSION_BOSS_DEATH_COLOR = 'bg-purple-700';
export const EXPLOSION_SHOCKWAVE_COLOR = 'rgba(255, 255, 255, 0.3)';
export const PARTICLE_BULLET_IMPACT_COLOR = 'bg-gray-300';
export const PARTICLE_TELEPORT_COLOR = 'bg-indigo-400';

// UI Colors
export const UI_BACKGROUND_COLOR = 'bg-slate-800';
export const UI_TEXT_COLOR = 'text-slate-100';
export const UI_ACCENT_COLOR = 'text-yellow-400';
export const UI_BUTTON_COLOR = 'bg-sky-600 hover:bg-sky-500';
export const UI_PULSATE_COLOR = 'text-red-500'; // For "GAME OVER" or warnings
export const HUD_BACKGROUND_COLOR = 'bg-black/60';
export const HUD_PROGRESS_BAR_BG_COLOR = 'bg-gray-700';
export const HUD_PROGRESS_BAR_FG_COLOR = 'bg-sky-500';
export const HUD_BOSS_HEALTH_BAR_BG_COLOR = 'bg-gray-700';
export const HUD_BOSS_HEALTH_BAR_FG_COLOR = 'bg-red-600';
export const HUD_BOSS_HEALTH_BAR_BORDER_COLOR = 'border-red-400';

export const FLOATING_TEXT_COLOR = 'text-yellow-300';
export const FLOATING_TEXT_COMBO_COLOR = 'text-orange-400';
export const FLOATING_TEXT_MULTIPLIER_COLOR = 'text-pink-400';
export const FLOATING_TEXT_PERFECT_COLOR = 'text-cyan-300';
export const WARNING_TEXT_COLOR = 'text-red-500'; // For "WARNING!" in StageTransitionDisplay
export const VICTORY_TEXT_COLOR = 'text-green-400'; // For "VICTORY!" in StageTransitionDisplay

export const ROLL_COOLDOWN_INDICATOR_READY_COLOR = 'bg-green-500';
export const ROLL_COOLDOWN_INDICATOR_CHARGING_COLOR = 'bg-gray-500';
export const STAGE_TITLE_COLOR = 'text-yellow-300';
export const STAGE_SUBTITLE_COLOR = 'text-sky-300';


// Fonts
export const RETRO_FONT_FAMILY = 'font-mono'; // Tailwind class

// Parallax Starfield Configuration
export const STAR_LAYER_SPECS = [
  { count: 60, baseSpeed: 0.15, minSize: 1, maxSize: 2, colorClass: 'bg-indigo-400', minOpacity: 0.2, maxOpacity: 0.4 },
  { count: 40, baseSpeed: 0.4, minSize: 1, maxSize: 3, colorClass: 'bg-sky-300', minOpacity: 0.3, maxOpacity: 0.6 },
  { count: 25, baseSpeed: 0.7, minSize: 2, maxSize: 4, colorClass: 'bg-slate-100', minOpacity: 0.5, maxOpacity: 0.9 }
];
// Nebula colors for different stages
export const NEBULA_COLORS_PER_STAGE = [
    { color1: 'rgba(79, 70, 229, 0.05)', color2: 'rgba(129, 140, 248, 0.04)' }, // Stage 1 (Default Indigo/Sky)
    { color1: 'rgba(139, 92, 246, 0.05)', color2: 'rgba(167, 139, 250, 0.04)' }, // Stage 2 (Purpleish)
    { color1: 'rgba(236, 72, 153, 0.04)', color2: 'rgba(244, 114, 182, 0.03)' }, // Stage 3 (Boss Stage - Pinkish/Rose)
    { color1: 'rgba(16, 185, 129, 0.05)', color2: 'rgba(52, 211, 153, 0.04)' }, // Stage 4 (Post-Boss - Greenish/Emerald)
    { color1: 'rgba(245, 158, 11, 0.05)', color2: 'rgba(251, 191, 36, 0.04)' }, // Stage 5 (Amber/Yellow)
];
// Default nebula colors (can be overridden by stage)
export const DISTANT_NEBULA_COLOR_1 = NEBULA_COLORS_PER_STAGE[0].color1; 
export const DISTANT_NEBULA_COLOR_2 = NEBULA_COLORS_PER_STAGE[0].color2;
