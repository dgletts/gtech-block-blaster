
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { GameState, Player, Enemy, Bullet, PowerUp, Explosion, Star, FloatingText, Particle, MuzzleFlash, BossState } from '../types';
import { EnemyType, PowerUpType, GamePhase } from '../types';
import {
  GAME_WIDTH, GAME_HEIGHT, PLAYER_START_X, PLAYER_START_Y, PLAYER_WIDTH, PLAYER_HEIGHT,
  PLAYER_INITIAL_LIVES, PLAYER_INITIAL_BOMBS, PLAYER_SPEED, PLAYER_FIRE_COOLDOWN, PLAYER_INVINCIBILITY_DURATION,
  PLAYER_ROLL_DURATION, PLAYER_ROLL_COOLDOWN, PLAYER_ROLL_SPEED_MULTIPLIER, PLAYER_IDLE_BOB_SPEED, PLAYER_LOW_HEALTH_SPARK_INTERVAL, PLAYER_DAMAGE_FLASH_DURATION,
  ENEMY_GRUNT_WIDTH, ENEMY_GRUNT_HEIGHT, ENEMY_GRUNT_HEALTH, ENEMY_GRUNT_POINTS, ENEMY_GRUNT_SPEED,
  ENEMY_MID_TIER_WIDTH, ENEMY_MID_TIER_HEIGHT, ENEMY_MID_TIER_HEALTH, ENEMY_MID_TIER_POINTS, ENEMY_MID_TIER_SPEED,
  ENEMY_MID_TIER_FIRE_COOLDOWN, ENEMY_MID_TIER_SPECIAL_ATTACK_COOLDOWN, ENEMY_MID_TIER_SPAWN_THRESHOLD,
  ENEMY_SWARM_MINION_WIDTH, ENEMY_SWARM_MINION_HEIGHT, ENEMY_SWARM_MINION_HEALTH, ENEMY_SWARM_MINION_POINTS, ENEMY_SWARM_MINION_SPEED,
  ENEMY_SWARM_MINION_SPAWN_COUNT, ENEMY_SWARM_MINION_OSCILLATION_SPEED,
  ENEMY_TELEPORTER_ELITE_WIDTH, ENEMY_TELEPORTER_ELITE_HEIGHT, ENEMY_TELEPORTER_ELITE_HEALTH, ENEMY_TELEPORTER_ELITE_POINTS,
  ENEMY_TELEPORTER_ELITE_PHASE_IN_DURATION, ENEMY_TELEPORTER_ELITE_IDLE_DURATION, ENEMY_TELEPORTER_ELITE_TELEGRAPH_DURATION,
  ENEMY_TELEPORTER_ELITE_PHASE_OUT_DURATION, ENEMY_TELEPORTER_ELITE_COOLDOWN_BETWEEN_TELEPORTS, ENEMY_TELEPORTER_ELITE_SPAWN_INTERVAL,
  ENEMY_SPLITTER_DRONE_WIDTH, ENEMY_SPLITTER_DRONE_HEIGHT, ENEMY_SPLITTER_DRONE_HEALTH, ENEMY_SPLITTER_DRONE_POINTS, ENEMY_SPLITTER_DRONE_SPEED, ENEMY_SPLITTER_DRONE_SPLIT_COUNT, ENEMY_SPLITTER_ANIM_DURATION,
  ENEMY_MINI_SPLITTER_WIDTH, ENEMY_MINI_SPLITTER_HEIGHT, ENEMY_MINI_SPLITTER_HEALTH, ENEMY_MINI_SPLITTER_POINTS, ENEMY_MINI_SPLITTER_SPEED, ENEMY_MINI_SPLITTER_FIRE_COOLDOWN, ENEMY_MINI_SPLITTER_MOVE_VARIANCE,
  BOSS_HIVE_OVERLORD_WIDTH, BOSS_HIVE_OVERLORD_HEIGHT, BOSS_HIVE_OVERLORD_X, BOSS_HIVE_OVERLORD_Y, BOSS_HIVE_OVERLORD_MAX_HEALTH, BOSS_HIVE_OVERLORD_POINTS, BOSS_HIVE_OVERLORD_MOVE_SPEED, BOSS_HIVE_OVERLORD_MOVE_INTERVAL,
  BOSS_CORE_WIDTH, BOSS_CORE_HEIGHT, BOSS_CORE_HEALTH, BOSS_CORE_POINTS_ON_DESTROY, BOSS_WEAPON_POD_WIDTH, BOSS_WEAPON_POD_HEIGHT, BOSS_WEAPON_POD_HEALTH, BOSS_WEAPON_POD_FIRE_COOLDOWN, BOSS_WEAPON_POD_POINTS_ON_DESTROY, BOSS_CORE_SPREAD_SHOT_COOLDOWN, BOSS_CORE_LASER_SWEEP_COOLDOWN_PHASE2, BOSS_CORE_LASER_SWEEP_DURATION,
  POWERUP_DROP_CHANCE, POWERUP_DROP_CHANCE_MID_TIER, POWERUP_DROP_CHANCE_SWARM, POWERUP_DROP_CHANCE_ELITE, POWERUP_DROP_CHANCE_SPLITTER, POWERUP_DROP_CHANCE_MINI_SPLITTER,
  POWERUP_WEAPON_MAX_LEVEL, POWERUP_LASER_BEAM_DURATION, POWERUP_LASER_DAMAGE_TICK_RATE, POWERUP_ATTRACT_RADIUS, POWERUP_ATTRACT_SPEED,
  POWERUP_SCORE_MULTIPLIER_DURATION, POWERUP_SCORE_MULTIPLIER_VALUE, POWERUP_COLLECT_ANIM_DURATION,
  INITIAL_ENEMY_SPAWN_COOLDOWN, ENEMY_GRUNT_FIRE_COOLDOWN,
  PLAYER_BULLET_SPEED, ENEMY_BULLET_SPEED, BULLET_WIDTH, BULLET_HEIGHT, PLAYER_BULLET_DAMAGE, ENEMY_BULLET_WIDTH, ENEMY_BULLET_HEIGHT, ENEMY_ELITE_BULLET_SPEED, BULLET_IMPACT_SPARK_COUNT, BULLET_IMPACT_SPARK_LIFE, BULLET_IMPACT_SPARK_SIZE, PARTICLE_BULLET_IMPACT_COLOR,
  PARTICLE_BOSS_HIT_COLOR,
  POWERUP_WIDTH, POWERUP_HEIGHT, POWERUP_SPEED, EXPLOSION_MAX_SIZE, EXPLOSION_DURATION, EXPLOSION_DEBRIS_COUNT, EXPLOSION_DEBRIS_GRAVITY, EXPLOSION_DEBRIS_SPEED,
  MIN_ENEMY_SPAWN_COOLDOWN, ENEMY_SPAWN_COOLDOWN_DECREMENT, STAGE_TRANSITION_DEFAULT_DURATION, STAGE_TRANSITION_WARNING_DURATION, STAGE_TRANSITION_VICTORY_DURATION, PERFECT_STAGE_BONUS,
  KILLS_PER_STAGE, BOSS_STAGE_TRIGGER, CHALLENGE_WAVES,
  EXPLOSION_ENEMY_COLOR, EXPLOSION_PLAYER_COLOR, EXPLOSION_BOSS_PART_COLOR, EXPLOSION_BOSS_DEATH_COLOR, PARTICLE_TELEPORT_COLOR, PLAYER_DAMAGE_SPARK_COLOR,
  PARTICLE_WEAPON_UP_COLOR, PARTICLE_BOMB_CHARGE_COLOR, PARTICLE_SHIELD_COLOR, PARTICLE_LASER_BEAM_COLOR, PARTICLE_SCORE_MULTIPLIER_COLOR,
  WARNING_TEXT_COLOR, VICTORY_TEXT_COLOR, BOSS_LASER_COLOR, FLOATING_TEXT_PERFECT_COLOR,
  SCREEN_SHAKE_DEFAULT_INTENSITY, SCREEN_SHAKE_DURATION_SHORT, SCREEN_SHAKE_DURATION_MEDIUM, SCREEN_SHAKE_BOMB_INTENSITY, SCREEN_SHAKE_HIT_INTENSITY, SCREEN_SHAKE_BOSS_HIT_INTENSITY, SCREEN_SHAKE_BOSS_HIT_DURATION,
  STAR_LAYER_SPECS,
  ENEMY_HIT_FLASH_DURATION, ENEMY_SPAWN_ANIMATION_DURATION, FLOATING_TEXT_DURATION, FLOATING_TEXT_COLOR, FLOATING_TEXT_COMBO_COLOR, FLOATING_TEXT_MULTIPLIER_COLOR, FLOATING_TEXT_DURATION_COMBO,
  CHAIN_KILL_WINDOW_DURATION, CHAIN_KILL_BONUS_PER_KILL,
  MUZZLE_FLASH_DURATION, MUZZLE_FLASH_SIZE_PLAYER, MUZZLE_FLASH_SIZE_ENEMY, MUZZLE_FLASH_SIZE_ELITE,
  SCORE_TICK_SPEED_FACTOR, SCORE_TICK_MIN_INCREMENT
} from '../constants';
import { PlayerShip, EnemyUnit, Projectile, PowerUpItem, ExplosionEffect, FloatingTextEffect, LaserBeamEffect, MuzzleFlashEffect, BossLaserSweepEffect } from '../components/GameAssets';
import { ParallaxBackground } from '../components/BackgroundEffects';
import { HUD, BossHealthBar, StageTransitionDisplay } from '../components/UIComponents';
import { SettingsContext } from '../App';

interface GameScreenProps {
  onGameOver: (score: number) => void;
}

export const GameScreenComponent: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const settingsContext = React.useContext(SettingsContext);
  const lastLaserDamageTimeRef = useRef<number>(0);

  const [particles, setParticles] = useState<Particle[]>([]);
  const [lastPlayerDamageSparkTime, setLastPlayerDamageSparkTime] = useState<number>(0);

  const createInitialPlayer = useCallback((): Player => ({
    id: 'player', x: PLAYER_START_X, y: PLAYER_START_Y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT,
    lives: PLAYER_INITIAL_LIVES, bombs: PLAYER_INITIAL_BOMBS, weaponLevel: 1,
    isInvincible: false, invincibilityTimer: 0, lastShotTime: 0,
    isLaserActive: false, laserTimer: 0, thrusterAnimationToggle: false,
    isRolling: false, rollTimer: 0, lastRollTime: -PLAYER_ROLL_COOLDOWN,
    rollDirection: 'forward', rollCooldownTimer: 0, idleBobTimer: 0, showDamageSparks: false,
    lastPlayerHorizontalMove: 'none',
  }), []);

  const initialScreenShake = useMemo(() => ({
    intensity: 0, duration: 0, active: false, startTime: 0
  }), []);

  const createInitialGameState = useCallback((): GameState => ({
    player: createInitialPlayer(), enemies: [], playerBullets: [], enemyBullets: [], powerUps: [],
    explosions: [], floatingTexts: [], muzzleFlashes: [],
    score: 0, displayedScore: 0, scoreMultiplier: 1, scoreMultiplierTimer: 0, stage: 1,
    gameOver: false, gameTime: 0, lastEnemySpawnTime: 0,
    lastEliteSpawnTime: -ENEMY_TELEPORTER_ELITE_SPAWN_INTERVAL, keysPressed: new Set<string>(),
    screenShake: initialScreenShake, gruntSpawnCounter: 0, chainKillCount: 0, chainKillTimer: 0, lastKillTime: 0,
    gamePhase: GamePhase.STAGE_TRANSITION,
    stageTransitionTimer: STAGE_TRANSITION_DEFAULT_DURATION, stageTitle: 'STAGE 1', stageSubtitle: 'GET READY!',
    playerTookDamageThisStage: false, currentKillsThisStage: 0,
    targetKillsForStage: KILLS_PER_STAGE[0],
    challengeWaveDefinition: CHALLENGE_WAVES[0],
    challengeWaveEnemiesRemaining: 0, boss: undefined,
    playerDamageFlashTimer: 0,
  }), [createInitialPlayer, initialScreenShake]);

  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());
  const gameStateRef = useRef<GameState>(gameState); 

  useEffect(() => { 
      gameStateRef.current = gameState;
  }, [gameState]);


  const [starLayers, setStarLayers] = useState<Star[][]>(() =>
    STAR_LAYER_SPECS.map((layerSpec, index) =>
      Array.from({ length: layerSpec.count }, (_, i) => ({
        id: `star_layer${index}_${i}`, x: Math.random() * GAME_WIDTH, y: Math.random() * GAME_HEIGHT,
        size: layerSpec.minSize + Math.random() * (layerSpec.maxSize - layerSpec.minSize),
        speedFactor: 0.8 + Math.random() * 0.4,
        opacity: layerSpec.minOpacity + Math.random() * (layerSpec.maxOpacity - layerSpec.minOpacity),
        colorClass: layerSpec.colorClass,
      }))
    )
  );

  const playSound = useCallback((soundId: string) => {
    if (settingsContext?.settings.soundEffects) {
      // console.log(`Playing sound: ${soundId}`);
    }
  }, [settingsContext?.settings.soundEffects]);

  const createParticles = useCallback((
    x: number, y: number, count: number, color: string, baseSize: number = 2, sizeVariance: number = 3,
    lifeMin: number = 300, lifeVariance: number = 400, speedMin:number = 1, speedVariance:number = 2,
    particleType: 'circle' | 'square' = 'circle', gravity?: number, isSpark?: boolean
  ) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = speedMin + Math.random() * speedVariance;
      newParticles.push({
        id: `particle_${Date.now()}_${Math.random()}`, x, y,
        size: baseSize + Math.random() * sizeVariance, color,
        life: lifeMin + Math.random() * lifeVariance,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        opacity: 1, particleType, gravity, isSpark,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5
      });
    }
    setParticles(prevP => [...prevP, ...newParticles]);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setParticles([]);
    setStarLayers(STAR_LAYER_SPECS.map((layerSpec, index) =>
      Array.from({ length: layerSpec.count }, (_, i) => ({
        id: `star_reset_layer${index}_${i}`, x: Math.random() * GAME_WIDTH, y: Math.random() * GAME_HEIGHT,
        size: layerSpec.minSize + Math.random() * (layerSpec.maxSize - layerSpec.minSize),
        speedFactor: 0.8 + Math.random() * 0.4,
        opacity: layerSpec.minOpacity + Math.random() * (layerSpec.maxOpacity - layerSpec.minOpacity),
        colorClass: layerSpec.colorClass,
      }))
    ));
    lastTimeRef.current = performance.now();
    setLastPlayerDamageSparkTime(0);
  }, [createInitialGameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'shift' || key === ' ' || key === 'q' || key.startsWith('arrow')) e.preventDefault();
      setGameState(prev => ({ ...prev, keysPressed: new Set(prev.keysPressed).add(key) }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setGameState(prev => {
        const newKeys = new Set(prev.keysPressed);
        newKeys.delete(e.key.toLowerCase());
        return { ...prev, keysPressed: newKeys };
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const createBossEntity = useCallback((): BossState => ({
    id: `boss_${Date.now()}`, x: BOSS_HIVE_OVERLORD_X, y: -BOSS_HIVE_OVERLORD_HEIGHT,
    width: BOSS_HIVE_OVERLORD_WIDTH, height: BOSS_HIVE_OVERLORD_HEIGHT,
    type: EnemyType.BOSS_HIVE_OVERLORD, maxHealth: BOSS_HIVE_OVERLORD_MAX_HEALTH,
    currentHealth: BOSS_HIVE_OVERLORD_MAX_HEALTH, phase: 1,
    attackTimers: { 
        weaponPodFire: BOSS_WEAPON_POD_FIRE_COOLDOWN, 
        coreSpreadShot: BOSS_CORE_SPREAD_SHOT_COOLDOWN, 
        laserSweepCharge: BOSS_CORE_LASER_SWEEP_COOLDOWN_PHASE2,
    },
    isVisible: false, moveDirection: 'right', lastMoveChangeTime: 0, hitFlashTimer: 0,
    isLaserSweeping: false, laserSweepAngle: 0, laserSweepTimer: 0, laserTelegraphTimer: 0,
  }), []);

  const createBossParts = useCallback((bossState: BossState): Enemy[] => {
    const parts: Enemy[] = [];
    const randomSuffix = () => `_R${Math.random().toString(36).substring(7)}`;
    const corePart: Enemy = {
        id: `${bossState.id}_core${randomSuffix()}`, x: bossState.x + bossState.width / 2 - BOSS_CORE_WIDTH / 2, y: bossState.y + bossState.height / 2 - BOSS_CORE_HEIGHT / 2,
        width: BOSS_CORE_WIDTH, height: BOSS_CORE_HEIGHT, type: EnemyType.BOSS_CORE, health: BOSS_CORE_HEALTH, points: BOSS_CORE_POINTS_ON_DESTROY,
        isBossPart: true, bossParentId: bossState.id, partType: 'core', spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0,
    };
    parts.push(corePart);
    console.log(`DEBUG_BOSS_PART_INIT: Part ${corePart.id} (Type: ${corePart.partType}), Health: ${corePart.health}, SpawnTimer: ${corePart.spawnAnimationTimer}`);

    const pod1Part: Enemy = {
        id: `${bossState.id}_pod1${randomSuffix()}`, x: bossState.x + 20, y: bossState.y + bossState.height / 2 - BOSS_WEAPON_POD_HEIGHT / 2,
        width: BOSS_WEAPON_POD_WIDTH, height: BOSS_WEAPON_POD_HEIGHT, type: EnemyType.BOSS_WEAPON_POD, health: BOSS_WEAPON_POD_HEALTH, points: BOSS_WEAPON_POD_POINTS_ON_DESTROY,
        isBossPart: true, bossParentId: bossState.id, partType: 'weapon_pod', lastShotTime: 0, spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0, isDestroyed: false,
    };
    parts.push(pod1Part);
    console.log(`DEBUG_BOSS_PART_INIT: Part ${pod1Part.id} (Type: ${pod1Part.partType}), Health: ${pod1Part.health}, SpawnTimer: ${pod1Part.spawnAnimationTimer}`);
    
    const pod2Part: Enemy = {
        id: `${bossState.id}_pod2${randomSuffix()}`, x: bossState.x + bossState.width - BOSS_WEAPON_POD_WIDTH - 20, y: bossState.y + bossState.height / 2 - BOSS_WEAPON_POD_HEIGHT / 2,
        width: BOSS_WEAPON_POD_WIDTH, height: BOSS_WEAPON_POD_HEIGHT, type: EnemyType.BOSS_WEAPON_POD, health: BOSS_WEAPON_POD_HEALTH, points: BOSS_WEAPON_POD_POINTS_ON_DESTROY,
        isBossPart: true, bossParentId: bossState.id, partType: 'weapon_pod', lastShotTime: 0, spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0, isDestroyed: false,
    };
    parts.push(pod2Part);
    console.log(`DEBUG_BOSS_PART_INIT: Part ${pod2Part.id} (Type: ${pod2Part.partType}), Health: ${pod2Part.health}, SpawnTimer: ${pod2Part.spawnAnimationTimer}`);

    return parts;
  }, []);

  const spawnChallengeWave = useCallback((stageNum: number): { spawnedEnemies: Enemy[], enemiesInWaveCount: number } => {
    const randomSuffix = () => `_R${Math.random().toString(36).substring(7)}`;
    let waveDefinitionToSpawn: EnemyType[];
    const spawnedWaveEnemies: Enemy[] = [];

    const waveIndex = Math.min(stageNum - 1, CHALLENGE_WAVES.length - 1);
    waveDefinitionToSpawn = CHALLENGE_WAVES[waveIndex] || [];

    if (waveDefinitionToSpawn.length === 0) {
         console.warn(`DEBUG: No wave definition found for stage ${stageNum}, or it's empty.`);
         return { spawnedEnemies: [], enemiesInWaveCount: 0 };
    }

    const baseSpawnY = -40; 
    const yStaggerPerGroup = 20; 

    waveDefinitionToSpawn.forEach((enemyType, index) => {
        let newEnemy: Enemy | null = null;
        const spawnXBase = (GAME_WIDTH / (waveDefinitionToSpawn.length + 1)) * (index + 1);
        let currentY = baseSpawnY - (index * yStaggerPerGroup);

        switch (enemyType) {
            case EnemyType.GRUNT:
                 newEnemy = {
                    id: `cw_grunt_${Date.now()}_${index}${randomSuffix()}`, x: Math.random() * (GAME_WIDTH - ENEMY_GRUNT_WIDTH), y: currentY - Math.random()*20, // Add some Y variance for grunts
                    width: ENEMY_GRUNT_WIDTH, height: ENEMY_GRUNT_HEIGHT, type: EnemyType.GRUNT,
                    health: ENEMY_GRUNT_HEALTH + Math.floor(stageNum/2), points: ENEMY_GRUNT_POINTS,
                    lastShotTime: Date.now() + Math.random() * ENEMY_GRUNT_FIRE_COOLDOWN, 
                    spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0, countedForChallengeClear: false,
                };
                break;
            case EnemyType.MID_TIER:
                const midTierX = Math.max(0, Math.min(GAME_WIDTH - ENEMY_MID_TIER_WIDTH, spawnXBase - ENEMY_MID_TIER_WIDTH / 2));
                newEnemy = {
                    id: `cw_mid_${Date.now()}_${index}${randomSuffix()}`, x: midTierX, y: currentY,
                    width: ENEMY_MID_TIER_WIDTH, height: ENEMY_MID_TIER_HEIGHT, type: EnemyType.MID_TIER,
                    health: ENEMY_MID_TIER_HEALTH + stageNum,
                    points: ENEMY_MID_TIER_POINTS, lastShotTime: 0, lastSpecialAttackTime: 0,
                    spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0, countedForChallengeClear: false,
                };
                break;
            case EnemyType.SPLITTER_DRONE:
                const splitterX = Math.max(0, Math.min(GAME_WIDTH - ENEMY_SPLITTER_DRONE_WIDTH, spawnXBase - ENEMY_SPLITTER_DRONE_WIDTH / 2));
                newEnemy = {id: `cw_splitter_${Date.now()}_${index}${randomSuffix()}`, x: splitterX, y: currentY, width: ENEMY_SPLITTER_DRONE_WIDTH, height: ENEMY_SPLITTER_DRONE_HEIGHT, type: EnemyType.SPLITTER_DRONE, health: ENEMY_SPLITTER_DRONE_HEALTH, points: ENEMY_SPLITTER_DRONE_POINTS, spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0, isSplitting: false, splitAnimTimer: 0, countedForChallengeClear: false,};
                break;
            case EnemyType.TELEPORTER_ELITE:
                const eliteX = Math.max(0, Math.min(GAME_WIDTH - ENEMY_TELEPORTER_ELITE_WIDTH, spawnXBase - ENEMY_TELEPORTER_ELITE_WIDTH / 2));
                newEnemy = {id: `cw_elite_${Date.now()}_${index}${randomSuffix()}`, x: eliteX, y: currentY, width: ENEMY_TELEPORTER_ELITE_WIDTH, height: ENEMY_TELEPORTER_ELITE_HEIGHT, type: EnemyType.TELEPORTER_ELITE, health: ENEMY_TELEPORTER_ELITE_HEALTH + stageNum * 2, points: ENEMY_TELEPORTER_ELITE_POINTS, teleportState: 'phasing_in', teleportTimer: ENEMY_TELEPORTER_ELITE_PHASE_IN_DURATION, hitFlashTimer: 0, teleportTargetX: eliteX, teleportTargetY: Math.random() * (GAME_HEIGHT * 0.3) + 30, countedForChallengeClear: false };
                break;
            case EnemyType.SWARM_MINION:
                const swarmClusterBaseX = Math.max(ENEMY_SWARM_MINION_WIDTH, Math.min(GAME_WIDTH - ENEMY_SWARM_MINION_WIDTH * 3, spawnXBase - ENEMY_SWARM_MINION_WIDTH * 1.5));
                for (let k = 0; k < ENEMY_SWARM_MINION_SPAWN_COUNT; k++) { // Spawn a cluster of SWARM_MINION_SPAWN_COUNT
                     spawnedWaveEnemies.push({
                        id: `cw_swarm_${Date.now()}_${index}_${k}${randomSuffix()}`,
                        x: swarmClusterBaseX + (k % 3 - 1) * (ENEMY_SWARM_MINION_WIDTH + 5) + (Math.random()-0.5)*10,
                        y: currentY - (Math.floor(k/3) * (ENEMY_SWARM_MINION_HEIGHT + 10)),
                        width: ENEMY_SWARM_MINION_WIDTH, height: ENEMY_SWARM_MINION_HEIGHT,
                        type: EnemyType.SWARM_MINION, health: ENEMY_SWARM_MINION_HEALTH, points: ENEMY_SWARM_MINION_POINTS,
                        spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0,
                        swarmOscillationOffset: Math.random() * Math.PI * 2,
                        countedForChallengeClear: false,
                    });
                }
                break;
        }
        if (newEnemy) spawnedWaveEnemies.push(newEnemy);
    });
    playSound('warning_siren');
    console.log(`DEBUG: spawnChallengeWave for Stage ${stageNum} prepared ${spawnedWaveEnemies.length} enemies. First enemy ID (if any): ${spawnedWaveEnemies[0]?.id}`);
    return { spawnedEnemies: spawnedWaveEnemies, enemiesInWaveCount: spawnedWaveEnemies.length };
  }, [playSound]);

  useEffect(() => {
    resetGame();
    lastTimeRef.current = performance.now();

    const gameLoop = (currentTime: number) => {
      if (gameStateRef.current.gameOver) {
          if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
          return;
      }

      let deltaTime = currentTime - lastTimeRef.current;
      if (deltaTime > 100) deltaTime = 16.66; 
      lastTimeRef.current = currentTime;

      setGameState(prev => {
        if (prev.gameOver) return prev;

        let mutableState = {...prev, player: { ...prev.player }, keysPressed: new Set(prev.keysPressed), screenShake: { ...prev.screenShake }, boss: prev.boss ? { ...prev.boss, attackTimers: {...prev.boss.attackTimers} } : undefined,};
        let bossDefeatedThisFrame = false;

        let newEnemies = [...mutableState.enemies];
        let newPlayerBullets = [...mutableState.playerBullets];
        let newEnemyBullets = [...mutableState.enemyBullets];
        let newPowerUps = [...mutableState.powerUps];
        let newExplosions = [...mutableState.explosions];
        let newFloatingTexts = [...mutableState.floatingTexts];
        let newMuzzleFlashes = [...mutableState.muzzleFlashes];

        let explosionsToCreateThisFrame: Array<Omit<Explosion, 'id' | 'elapsed' | 'duration'> & { duration: number }> = [];
        let floatingTextsToCreateThisFrame: Array<Omit<FloatingText, 'id' | 'initialY' | 'lifeTimer'> & { initialY?: number, y: number, lifeTimer?: number }> = [];
        let muzzleFlashesToCreateThisFrame: Array<Omit<MuzzleFlash, 'id' | 'lifeTimer'>> = [];
        let screenShakeToApplyThisFrame: { intensity: number, duration: number, gameTimeForStart: number } | null = null;
        let newlySpawnedChildrenThisFrame: Enemy[] = []; 
        let newlySpawnedPowerUpsThisFrame: PowerUp[] = [];

        mutableState.gameTime += deltaTime;
        mutableState.player.idleBobTimer = (mutableState.player.idleBobTimer || 0) + deltaTime;
        mutableState.player.showDamageSparks = mutableState.player.lives === 1;
        
        if (mutableState.playerDamageFlashTimer && mutableState.playerDamageFlashTimer > 0) {
            mutableState.playerDamageFlashTimer = Math.max(0, mutableState.playerDamageFlashTimer - deltaTime);
        }

        if (mutableState.player.showDamageSparks && mutableState.gameTime - lastPlayerDamageSparkTime > PLAYER_LOW_HEALTH_SPARK_INTERVAL) {
            setLastPlayerDamageSparkTime(mutableState.gameTime);
            createParticles(mutableState.player.x + Math.random() * mutableState.player.width, mutableState.player.y + Math.random() * mutableState.player.height, 1, PLAYER_DAMAGE_SPARK_COLOR, 2, 1, 100, 50, 0.1, 0.2, 'circle', undefined, true );
        }

        if (mutableState.scoreMultiplierTimer > 0) { mutableState.scoreMultiplierTimer = Math.max(0, mutableState.scoreMultiplierTimer - deltaTime); if (mutableState.scoreMultiplierTimer <= 0) mutableState.scoreMultiplier = 1; }
        if (mutableState.player.isInvincible) { mutableState.player.invincibilityTimer = Math.max(0, mutableState.player.invincibilityTimer - deltaTime); if (mutableState.player.invincibilityTimer <= 0) mutableState.player.isInvincible = false; }

        setParticles(prevParticles => prevParticles.map(p => { let newVx = p.vx; let newVy = p.vy; if (p.isDebris && p.gravity !== undefined) newVy += p.gravity * (deltaTime / 16.66); const updatedP = {...p, x: p.x + newVx * (deltaTime / 16.66), y: p.y + newVy * (deltaTime / 16.66), life: p.life - deltaTime, opacity: Math.max(0, p.opacity - (deltaTime / (p.life + 0.1)) * 1.5) }; if (p.rotationSpeed) updatedP.rotation = (p.rotation || 0) + p.rotationSpeed * (deltaTime/16.66); return updatedP; }).filter(p => p.life > 0));

        if (mutableState.screenShake.active && mutableState.gameTime - mutableState.screenShake.startTime > mutableState.screenShake.duration) { mutableState.screenShake = { ...mutableState.screenShake, active: false, intensity: 0 }; }

        setStarLayers(prevLayers => prevLayers.map((layer, layerIndex) => layer.map(star => { const layerSpec = STAR_LAYER_SPECS[layerIndex]; let newY = star.y + layerSpec.baseSpeed * star.speedFactor * (deltaTime / 16.66); if (newY > GAME_HEIGHT) { return { ...star, y: -star.size, x: Math.random() * GAME_WIDTH, size: layerSpec.minSize + Math.random() * (layerSpec.maxSize - layerSpec.minSize), opacity: layerSpec.minOpacity + Math.random() * (layerSpec.maxOpacity - layerSpec.minOpacity) }; } return { ...star, y: newY }; })));

        if (mutableState.displayedScore < mutableState.score) { const diff = mutableState.score - mutableState.displayedScore; const increment = Math.max(SCORE_TICK_MIN_INCREMENT, Math.ceil(diff * SCORE_TICK_SPEED_FACTOR )); mutableState.displayedScore = Math.min(mutableState.score, mutableState.displayedScore + increment); } else if (mutableState.displayedScore > mutableState.score) { mutableState.displayedScore = mutableState.score; }

        if (mutableState.gamePhase === GamePhase.STAGE_TRANSITION || mutableState.gamePhase === GamePhase.CHALLENGE_WAVE_PENDING || mutableState.gamePhase === GamePhase.BOSS_BATTLE_INCOMING || mutableState.gamePhase === GamePhase.BOSS_DEFEATED) {
            mutableState.stageTransitionTimer = Math.max(0, mutableState.stageTransitionTimer - deltaTime);
            if (mutableState.stageTransitionTimer <= 0) {
                if (mutableState.gamePhase === GamePhase.STAGE_TRANSITION) {
                    mutableState.gamePhase = GamePhase.PLAYING;
                    mutableState.lastEnemySpawnTime = mutableState.gameTime;
                } else if (mutableState.gamePhase === GamePhase.CHALLENGE_WAVE_PENDING) {
                    mutableState.gamePhase = GamePhase.CHALLENGE_WAVE_ACTIVE;
                    const waveResult = spawnChallengeWave(mutableState.stage);
                    newEnemies.push(...waveResult.spawnedEnemies);
                    mutableState.challengeWaveEnemiesRemaining = waveResult.enemiesInWaveCount;
                    console.log(`DEBUG: Challenge wave (Stage ${mutableState.stage}) starting. Enemies remaining set to: ${mutableState.challengeWaveEnemiesRemaining}`);
                } else if (mutableState.gamePhase === GamePhase.BOSS_BATTLE_INCOMING) {
                    mutableState.gamePhase = GamePhase.BOSS_BATTLE;
                    const bossEntity = createBossEntity();
                    mutableState.boss = bossEntity;
                    const bossParts = createBossParts(bossEntity);
                    newEnemies.push(...bossParts); 
                    console.log(`DEBUG_BOSS: Boss parts added to newEnemies. Count: ${bossParts.length}, newEnemies total: ${newEnemies.length}`);
                    playSound('boss_spawn');
                } else if (mutableState.gamePhase === GamePhase.BOSS_DEFEATED) {
                    mutableState.gamePhase = GamePhase.STAGE_TRANSITION;
                    mutableState.stage++;
                    mutableState.playerTookDamageThisStage = false;
                    mutableState.currentKillsThisStage = 0;
                    mutableState.gruntSpawnCounter = 0;
                    mutableState.targetKillsForStage = KILLS_PER_STAGE[Math.min(mutableState.stage - 1, KILLS_PER_STAGE.length - 1)];
                    mutableState.challengeWaveDefinition = CHALLENGE_WAVES[Math.min(mutableState.stage - 1, CHALLENGE_WAVES.length - 1)];
                    mutableState.stageTitle = `STAGE ${mutableState.stage}`;
                    mutableState.stageSubtitle = "GET READY!";
                    mutableState.stageTransitionTimer = STAGE_TRANSITION_DEFAULT_DURATION;
                    mutableState.boss = undefined; 
                    newEnemies = newEnemies.filter(e => !e.isBossPart && e.type !== EnemyType.BOSS_HIVE_OVERLORD); 
                    mutableState.lastEnemySpawnTime = mutableState.gameTime;
                }
            }
        } else { 
            let dxPlayerInput = 0; if (mutableState.keysPressed.has('arrowleft') || mutableState.keysPressed.has('a')) dxPlayerInput = -1; if (mutableState.keysPressed.has('arrowright') || mutableState.keysPressed.has('d')) dxPlayerInput = 1; mutableState.player.lastPlayerHorizontalMove = dxPlayerInput !== 0 ? (dxPlayerInput > 0 ? 'right' : 'left') : 'none';
            const normalizedPlayerSpeed = PLAYER_SPEED * (deltaTime / 16.66);
            if (mutableState.player.isRolling) { mutableState.player.rollTimer = Math.max(0, (mutableState.player.rollTimer || 0) - deltaTime); let rollDx = 0, rollDy = 0; const rollSpeed = normalizedPlayerSpeed * PLAYER_ROLL_SPEED_MULTIPLIER; if (mutableState.player.rollDirection === 'left') rollDx = -rollSpeed; else if (mutableState.player.rollDirection === 'right') rollDx = rollSpeed; else rollDy = -rollSpeed * 0.7; mutableState.player.x = Math.max(0, Math.min(GAME_WIDTH - mutableState.player.width, mutableState.player.x + rollDx)); mutableState.player.y = Math.max(0, Math.min(GAME_HEIGHT - mutableState.player.height, mutableState.player.y + rollDy)); if (mutableState.player.rollTimer <= 0) mutableState.player.isRolling = false; }
            else { if (mutableState.keysPressed.has('arrowleft') || mutableState.keysPressed.has('a')) mutableState.player.x = Math.max(0, mutableState.player.x - normalizedPlayerSpeed); if (mutableState.keysPressed.has('arrowright') || mutableState.keysPressed.has('d')) mutableState.player.x = Math.min(GAME_WIDTH - mutableState.player.width, mutableState.player.x + normalizedPlayerSpeed); if (mutableState.keysPressed.has('arrowup') || mutableState.keysPressed.has('w')) mutableState.player.y = Math.max(0, mutableState.player.y - normalizedPlayerSpeed); if (mutableState.keysPressed.has('arrowdown') || mutableState.keysPressed.has('s')) mutableState.player.y = Math.min(GAME_HEIGHT - mutableState.player.height, mutableState.player.y + normalizedPlayerSpeed);
                mutableState.player.rollCooldownTimer = Math.max(0, (mutableState.player.rollCooldownTimer || 0) - deltaTime);
                if (mutableState.keysPressed.has('shift') && !mutableState.player.isRolling && (mutableState.player.rollCooldownTimer !== undefined && mutableState.player.rollCooldownTimer <= 0)) { mutableState.player.isRolling = true; mutableState.player.rollTimer = PLAYER_ROLL_DURATION; mutableState.player.lastRollTime = mutableState.gameTime; mutableState.player.rollCooldownTimer = PLAYER_ROLL_COOLDOWN; mutableState.player.isInvincible = true; mutableState.player.invincibilityTimer = Math.max(mutableState.player.invincibilityTimer || 0, PLAYER_ROLL_DURATION); mutableState.player.rollDirection = mutableState.player.lastPlayerHorizontalMove !== 'none' && (mutableState.keysPressed.has('arrowleft') || mutableState.keysPressed.has('a') || mutableState.keysPressed.has('arrowright') || mutableState.keysPressed.has('d')) ? mutableState.player.lastPlayerHorizontalMove : 'forward'; playSound('player_roll'); mutableState.keysPressed.delete('shift'); }
            }
            mutableState.player.thrusterAnimationToggle = Math.floor(mutableState.gameTime / 150) % 2 === 0;
            const playerCenterX = mutableState.player.x + mutableState.player.width / 2; const playerCenterY = mutableState.player.y + mutableState.player.height / 2;

            if (mutableState.keysPressed.has(' ') && !mutableState.player.isLaserActive && !mutableState.player.isRolling && mutableState.gameTime - mutableState.player.lastShotTime > PLAYER_FIRE_COOLDOWN) { mutableState.player.lastShotTime = mutableState.gameTime; playSound('player_shoot'); muzzleFlashesToCreateThisFrame.push({x: playerCenterX, y: mutableState.player.y, size: MUZZLE_FLASH_SIZE_PLAYER, isPlayerFlash: true, rotation: -90}); const baseBulletX = playerCenterX - BULLET_WIDTH / 2; let tempPlayerBullets: Bullet[] = []; tempPlayerBullets.push({ id: `pb_${mutableState.gameTime}`, x: baseBulletX, y: mutableState.player.y, width: BULLET_WIDTH, height: BULLET_HEIGHT, isPlayerBullet: true, damage: PLAYER_BULLET_DAMAGE, hasCore: true }); if (mutableState.player.weaponLevel >= 2) { tempPlayerBullets.push({ id: `pb_${mutableState.gameTime}_l`, x: baseBulletX - 10, y: mutableState.player.y + 5, width: BULLET_WIDTH, height: BULLET_HEIGHT, isPlayerBullet: true, damage: PLAYER_BULLET_DAMAGE, hasCore: true }); tempPlayerBullets.push({ id: `pb_${mutableState.gameTime}_r`, x: baseBulletX + 10, y: mutableState.player.y + 5, width: BULLET_WIDTH, height: BULLET_HEIGHT, isPlayerBullet: true, damage: PLAYER_BULLET_DAMAGE, hasCore: true });} if (mutableState.player.weaponLevel >= 3) { tempPlayerBullets.push({ id: `pb_${mutableState.gameTime}_l2`, x: baseBulletX - 20, y: mutableState.player.y + 10, width: BULLET_WIDTH, height: BULLET_HEIGHT, isPlayerBullet: true, damage: PLAYER_BULLET_DAMAGE, hasCore: true }); tempPlayerBullets.push({ id: `pb_${mutableState.gameTime}_r2`, x: baseBulletX + 20, y: mutableState.player.y + 10, width: BULLET_WIDTH, height: BULLET_HEIGHT, isPlayerBullet: true, damage: PLAYER_BULLET_DAMAGE, hasCore: true });} if (mutableState.player.weaponLevel >= 4) { tempPlayerBullets.push({ id: `pb_${mutableState.gameTime}_al`, x: baseBulletX - 7, y: mutableState.player.y - 5, width: BULLET_WIDTH, height: BULLET_HEIGHT, isPlayerBullet: true, damage: PLAYER_BULLET_DAMAGE, vx: -0.5 * PLAYER_BULLET_SPEED * 0.2, vy: -PLAYER_BULLET_SPEED * 0.98, hasCore: true }); tempPlayerBullets.push({ id: `pb_${mutableState.gameTime}_ar`, x: baseBulletX + 7, y: mutableState.player.y - 5, width: BULLET_WIDTH, height: BULLET_HEIGHT, isPlayerBullet: true, damage: PLAYER_BULLET_DAMAGE, vx: 0.5 * PLAYER_BULLET_SPEED * 0.2, vy: -PLAYER_BULLET_SPEED * 0.98, hasCore: true });} newPlayerBullets.push(...tempPlayerBullets); }
            if (mutableState.player.isLaserActive && mutableState.player.laserTimer !== undefined) { mutableState.player.laserTimer = Math.max(0, mutableState.player.laserTimer - deltaTime); if (mutableState.player.laserTimer <= 0) mutableState.player.isLaserActive = false; }

            if (mutableState.keysPressed.has('q') && mutableState.player.bombs > 0 && !mutableState.player.isRolling ) {
                mutableState.player.bombs--; mutableState.player.isInvincible = true; mutableState.player.invincibilityTimer = Math.max(mutableState.player.invincibilityTimer || 0, 1500); playSound('bomb_explode');
                explosionsToCreateThisFrame.push({x: playerCenterX, y: playerCenterY, size: GAME_WIDTH * 0.8, duration: EXPLOSION_DURATION, color: EXPLOSION_PLAYER_COLOR, hasDebris: true, hasShockwave: true});
                const bombShake = {intensity: SCREEN_SHAKE_BOMB_INTENSITY, duration: SCREEN_SHAKE_DURATION_MEDIUM, gameTimeForStart: mutableState.gameTime};
                if (!screenShakeToApplyThisFrame || bombShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = bombShake;
                newEnemyBullets = [];

                newEnemies.forEach(enemy => {
                    if (enemy.health <= 0 || enemy.isSplitting || (enemy.isBossPart && enemy.isDestroyed) ) return;
                    
                    enemy.hitFlashTimer = ENEMY_HIT_FLASH_DURATION; 
                    const impactX = enemy.x + enemy.width / 2; const impactY = enemy.y + enemy.height / 2;

                    if (enemy.spawnAnimationTimer && enemy.spawnAnimationTimer > 0) { 
                         if (enemy.isBossPart || enemy.type === EnemyType.BOSS_HIVE_OVERLORD) { createParticles(impactX, impactY, 5, PARTICLE_BOSS_HIT_COLOR, 2, 2, 150, 100); }
                         return;
                    }

                    const damageDealt = 10; enemy.health -= damageDealt;
                    if (enemy.isBossPart && mutableState.boss) { mutableState.boss.currentHealth -= damageDealt; if (mutableState.boss.currentHealth <= 0) mutableState.boss.currentHealth = 0; }
                    
                    if (enemy.isBossPart || enemy.type === EnemyType.BOSS_HIVE_OVERLORD) { createParticles(impactX, impactY, 5, PARTICLE_BOSS_HIT_COLOR, 2, 2, 150, 100); const bossHitShakeBomb = {intensity: SCREEN_SHAKE_BOSS_HIT_INTENSITY, duration: SCREEN_SHAKE_BOSS_HIT_DURATION, gameTimeForStart: mutableState.gameTime}; if (!screenShakeToApplyThisFrame || bossHitShakeBomb.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = bossHitShakeBomb; }


                    if (enemy.health <= 0) {
                        const enemyCenterXBomb = enemy.x + enemy.width / 2; const enemyCenterYBomb = enemy.y + enemy.height / 2;
                        mutableState.score += enemy.points * mutableState.scoreMultiplier;
                        explosionsToCreateThisFrame.push({x: enemyCenterXBomb, y: enemyCenterYBomb, size: EXPLOSION_MAX_SIZE * 0.8, duration: EXPLOSION_DURATION, color: enemy.isBossPart ? EXPLOSION_BOSS_PART_COLOR : EXPLOSION_ENEMY_COLOR, hasDebris: true});
                        if (!enemy.isBossPart) mutableState.currentKillsThisStage++;

                        if (mutableState.gamePhase === GamePhase.CHALLENGE_WAVE_ACTIVE && !enemy.isBossPart && !enemy.countedForChallengeClear) {
                            mutableState.challengeWaveEnemiesRemaining = Math.max(0, mutableState.challengeWaveEnemiesRemaining - 1);
                            enemy.countedForChallengeClear = true;
                        }

                        if (enemy.type === EnemyType.SPLITTER_DRONE && !enemy.isSplitting) { enemy.isSplitting = true; enemy.splitAnimTimer = ENEMY_SPLITTER_ANIM_DURATION; }
                        else if (enemy.isBossPart && enemy.type === EnemyType.BOSS_WEAPON_POD && !enemy.isDestroyed) { enemy.isDestroyed = true; mutableState.score += BOSS_WEAPON_POD_POINTS_ON_DESTROY * mutableState.scoreMultiplier;}
                        let dropChanceBomb = POWERUP_DROP_CHANCE; if (enemy.type === EnemyType.MID_TIER) dropChanceBomb = POWERUP_DROP_CHANCE_MID_TIER; else if (enemy.type === EnemyType.SWARM_MINION) dropChanceBomb = POWERUP_DROP_CHANCE_SWARM; else if (enemy.type === EnemyType.TELEPORTER_ELITE) dropChanceBomb = POWERUP_DROP_CHANCE_ELITE; else if (enemy.type === EnemyType.SPLITTER_DRONE) dropChanceBomb = POWERUP_DROP_CHANCE_SPLITTER; else if (enemy.type === EnemyType.MINI_SPLITTER) dropChanceBomb = POWERUP_DROP_CHANCE_MINI_SPLITTER;
                        if (!enemy.isBossPart && Math.random() < dropChanceBomb) { let powerUpTypeBomb: PowerUpType; const randTypeBomb = Math.random(); if (randTypeBomb < 0.35 || (mutableState.player.weaponLevel < POWERUP_WEAPON_MAX_LEVEL && randTypeBomb < 0.55)) powerUpTypeBomb = PowerUpType.WEAPON_UPGRADE; else if (randTypeBomb < 0.60) powerUpTypeBomb = PowerUpType.BOMB_CHARGE; else if (randTypeBomb < 0.80) powerUpTypeBomb = PowerUpType.SHIELD; else if (randTypeBomb < 0.90 && mutableState.stage >= 1) powerUpTypeBomb = PowerUpType.LASER_BEAM; else powerUpTypeBomb = PowerUpType.SCORE_MULTIPLIER; newlySpawnedPowerUpsThisFrame.push({id: `pu_bomb_${mutableState.gameTime}_${enemy.id}`, type: powerUpTypeBomb, x: enemyCenterXBomb - POWERUP_WIDTH / 2, y: enemyCenterYBomb - POWERUP_HEIGHT / 2, width: POWERUP_WIDTH, height: POWERUP_HEIGHT, attractionTimer: 300}); }
                    }
                });

                if (mutableState.boss && mutableState.boss.isVisible) {
                    const weaponPods = newEnemies.filter(e => e.isBossPart && e.bossParentId === mutableState.boss?.id && e.partType === 'weapon_pod');
                    const corePart = newEnemies.find(e => e.isBossPart && e.bossParentId === mutableState.boss?.id && e.partType === 'core');
                    
                    const allWeaponPodsDestroyed = weaponPods.every(p => p.isDestroyed === true);
                    const coreEffectivelyDestroyed = corePart ? corePart.health <= 0 : true;

                    if (allWeaponPodsDestroyed && coreEffectivelyDestroyed) {
                        const bombDamageToBossBody = 50; 
                        mutableState.boss.currentHealth -= bombDamageToBossBody;
                        mutableState.boss.hitFlashTimer = ENEMY_HIT_FLASH_DURATION * 2;
                        const bossBodyImpactX = mutableState.boss.x + mutableState.boss.width / 2;
                        const bossBodyImpactY = mutableState.boss.y + mutableState.boss.height / 2;
                        createParticles(bossBodyImpactX, bossBodyImpactY, 15, PARTICLE_BOSS_HIT_COLOR, 3, 3, 200, 150);
                        const bossBodyHitShake = {intensity: SCREEN_SHAKE_BOSS_HIT_INTENSITY * 1.5, duration: SCREEN_SHAKE_BOSS_HIT_DURATION * 1.5, gameTimeForStart: mutableState.gameTime}; if (!screenShakeToApplyThisFrame || bossBodyHitShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = bossBodyHitShake;
                        if (mutableState.boss.currentHealth <= 0) mutableState.boss.currentHealth = 0;
                    }
                }

                if (mutableState.boss && mutableState.boss.currentHealth <= 0 && !bossDefeatedThisFrame) {
                    mutableState.gamePhase = GamePhase.BOSS_DEFEATED;
                    bossDefeatedThisFrame = true;
                    mutableState.boss.currentHealth = 0;
                    mutableState.score += BOSS_HIVE_OVERLORD_POINTS * mutableState.scoreMultiplier;
                    explosionsToCreateThisFrame.push({ x: mutableState.boss.x + mutableState.boss.width/2, y: mutableState.boss.y + mutableState.boss.height/2, size: mutableState.boss.width * 1.5, duration: EXPLOSION_DURATION * 2.5, color: EXPLOSION_BOSS_DEATH_COLOR, hasDebris:true, hasShockwave: true});
                    floatingTextsToCreateThisFrame.push({text: "OVERLORD ANNIHILATED!", x: GAME_WIDTH/2 - 200, y: GAME_HEIGHT/2 - 60, color: VICTORY_TEXT_COLOR, isHuge: true, lifeTimer: STAGE_TRANSITION_VICTORY_DURATION - 300 });
                    mutableState.stageTitle = "VICTORY!";
                    mutableState.stageSubtitle = `+${BOSS_HIVE_OVERLORD_POINTS * mutableState.scoreMultiplier} PTS`;
                    mutableState.stageTransitionTimer = STAGE_TRANSITION_VICTORY_DURATION;
                    const bossDeathShake = {intensity: SCREEN_SHAKE_BOMB_INTENSITY * 2, duration: SCREEN_SHAKE_DURATION_MEDIUM * 2.5, gameTimeForStart: mutableState.gameTime};
                    if (!screenShakeToApplyThisFrame || bossDeathShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = bossDeathShake;
                    playSound('boss_explode_final');
                }
                mutableState.keysPressed.delete('q');
            }

            newPlayerBullets = newPlayerBullets.map(b => ({ ...b, y: b.y - (b.vy !== undefined ? b.vy : PLAYER_BULLET_SPEED) * (deltaTime / 16.66), x: b.x + (b.vx || 0) * (deltaTime / 16.66) })).filter(b => b.y > -b.height && b.x > -b.width && b.x < GAME_WIDTH);
            newEnemyBullets = newEnemyBullets.map(b => { const normalizedSpeed = (b.isFast ? ENEMY_ELITE_BULLET_SPEED : ENEMY_BULLET_SPEED) * (deltaTime / 16.66); if (b.vx !== undefined && b.vy !== undefined) return { ...b, x: b.x + b.vx * (deltaTime / 16.66), y: b.y + b.vy * (deltaTime / 16.66) }; return { ...b, y: b.y + normalizedSpeed }; }).filter(b => b.y < GAME_HEIGHT && b.y > -b.height && b.x > -b.width && b.x < GAME_WIDTH + b.width);

            if (mutableState.gamePhase === GamePhase.PLAYING) {
                const currentEnemySpawnCooldown = Math.max(MIN_ENEMY_SPAWN_COOLDOWN, INITIAL_ENEMY_SPAWN_COOLDOWN - (mutableState.stage - 1) * ENEMY_SPAWN_COOLDOWN_DECREMENT);
                if (mutableState.gameTime - mutableState.lastEnemySpawnTime > currentEnemySpawnCooldown && newEnemies.filter(e => !e.isBossPart).length < 15) { mutableState.lastEnemySpawnTime = mutableState.gameTime; let enemyTypeToSpawn = EnemyType.GRUNT; const randomFactor = Math.random(); if (mutableState.stage > 1 && mutableState.gruntSpawnCounter >= ENEMY_MID_TIER_SPAWN_THRESHOLD && randomFactor < 0.3 + mutableState.stage * 0.02) { enemyTypeToSpawn = EnemyType.MID_TIER; mutableState.gruntSpawnCounter = 0; } else if (mutableState.stage > 0 && randomFactor < 0.2 + mutableState.stage * 0.03) { enemyTypeToSpawn = EnemyType.SWARM_MINION; } else if (mutableState.stage > 1 && randomFactor < 0.4 + mutableState.stage * 0.02) { enemyTypeToSpawn = EnemyType.SPLITTER_DRONE; }
                    const randomSuffix = () => `_R${Math.random().toString(36).substring(7)}`;
                    if (enemyTypeToSpawn === EnemyType.SWARM_MINION) { const startX = Math.random() * (GAME_WIDTH - ENEMY_SWARM_MINION_WIDTH * 3); for (let k = 0; k < ENEMY_SWARM_MINION_SPAWN_COUNT; k++) newlySpawnedChildrenThisFrame.push({id: `en_swarm_${mutableState.gameTime}_${k}${randomSuffix()}`,x: startX + (k % 3) * (ENEMY_SWARM_MINION_WIDTH + 5) - (Math.floor(k/3) * 10),y: -ENEMY_SWARM_MINION_HEIGHT - (Math.floor(k/3) * (ENEMY_SWARM_MINION_HEIGHT + 5)),width: ENEMY_SWARM_MINION_WIDTH, height: ENEMY_SWARM_MINION_HEIGHT, type: EnemyType.SWARM_MINION,health: ENEMY_SWARM_MINION_HEALTH, points: ENEMY_SWARM_MINION_POINTS,spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0,swarmOscillationOffset: Math.random() * Math.PI * 2,});}
                    else if (enemyTypeToSpawn === EnemyType.MID_TIER) { newlySpawnedChildrenThisFrame.push({id: `en_mid_${mutableState.gameTime}${randomSuffix()}`, x: Math.random() * (GAME_WIDTH - ENEMY_MID_TIER_WIDTH), y: -ENEMY_MID_TIER_HEIGHT,width: ENEMY_MID_TIER_WIDTH, height: ENEMY_MID_TIER_HEIGHT, type: EnemyType.MID_TIER,health: ENEMY_MID_TIER_HEALTH + mutableState.stage, points: ENEMY_MID_TIER_POINTS,lastShotTime: mutableState.gameTime + Math.random() * ENEMY_MID_TIER_FIRE_COOLDOWN,lastSpecialAttackTime: mutableState.gameTime + Math.random() * ENEMY_MID_TIER_SPECIAL_ATTACK_COOLDOWN,spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0,}); }
                    else if (enemyTypeToSpawn === EnemyType.SPLITTER_DRONE) { newlySpawnedChildrenThisFrame.push({id: `en_splitter_${mutableState.gameTime}${randomSuffix()}`, x: Math.random() * (GAME_WIDTH - ENEMY_SPLITTER_DRONE_WIDTH), y: -ENEMY_SPLITTER_DRONE_HEIGHT,width: ENEMY_SPLITTER_DRONE_WIDTH, height: ENEMY_SPLITTER_DRONE_HEIGHT, type: EnemyType.SPLITTER_DRONE,health: ENEMY_SPLITTER_DRONE_HEALTH, points: ENEMY_SPLITTER_DRONE_POINTS, spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0, isSplitting: false, splitAnimTimer: 0});}
                    else { newlySpawnedChildrenThisFrame.push({id: `en_grunt_${mutableState.gameTime}${randomSuffix()}`, x: Math.random() * (GAME_WIDTH - ENEMY_GRUNT_WIDTH), y: -ENEMY_GRUNT_HEIGHT,width: ENEMY_GRUNT_WIDTH, height: ENEMY_GRUNT_HEIGHT, type: EnemyType.GRUNT,health: ENEMY_GRUNT_HEALTH + Math.floor(mutableState.stage/2), points: ENEMY_GRUNT_POINTS,lastShotTime: mutableState.gameTime + Math.random() * ENEMY_GRUNT_FIRE_COOLDOWN, spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0,}); mutableState.gruntSpawnCounter++; }
                }
                if (mutableState.stage > 1 && mutableState.gameTime - mutableState.lastEliteSpawnTime > ENEMY_TELEPORTER_ELITE_SPAWN_INTERVAL && newEnemies.filter(e => e.type === EnemyType.TELEPORTER_ELITE).length === 0 ) { mutableState.lastEliteSpawnTime = mutableState.gameTime; const eliteX = Math.random() * (GAME_WIDTH - ENEMY_TELEPORTER_ELITE_WIDTH); const eliteY = -ENEMY_TELEPORTER_ELITE_HEIGHT; const randomSuffix = () => `_R${Math.random().toString(36).substring(7)}`; newlySpawnedChildrenThisFrame.push({id: `en_elite_${mutableState.gameTime}${randomSuffix()}`, x: eliteX, y: eliteY, width: ENEMY_TELEPORTER_ELITE_WIDTH, height: ENEMY_TELEPORTER_ELITE_HEIGHT,type: EnemyType.TELEPORTER_ELITE, health: ENEMY_TELEPORTER_ELITE_HEALTH + mutableState.stage * 2, points: ENEMY_TELEPORTER_ELITE_POINTS,teleportState: 'phasing_in', teleportTimer: ENEMY_TELEPORTER_ELITE_PHASE_IN_DURATION, hitFlashTimer: 0,teleportTargetX: eliteX, teleportTargetY: Math.random() * (GAME_HEIGHT * 0.3) + 20, countedForChallengeClear: false }); createParticles(eliteX + ENEMY_TELEPORTER_ELITE_WIDTH/2, eliteY + ENEMY_TELEPORTER_ELITE_HEIGHT/2, 20, PARTICLE_TELEPORT_COLOR, 3, 5, 400, 200); }
            }

            let processedEnemiesFromMap = newEnemies.map(enemy => {
                let updatedEnemy = { ...enemy };
                const enemyCenterX = updatedEnemy.x + updatedEnemy.width / 2; const enemyCenterY = updatedEnemy.y + updatedEnemy.height / 2;
                
                if (updatedEnemy.spawnAnimationTimer && updatedEnemy.spawnAnimationTimer > 0) {
                    const oldTimer = updatedEnemy.spawnAnimationTimer;
                    const timerDecrement = Math.min(oldTimer, deltaTime); 
                    updatedEnemy.spawnAnimationTimer = oldTimer - timerDecrement;

                    if (updatedEnemy.isBossPart) {
                        // console.log(`DEBUG_BOSS_PART_SPAWN_TIMER: ID: ${updatedEnemy.id}, PrevTimer: ${oldTimer.toFixed(2)}, Delta: ${deltaTime.toFixed(2)}, Decrement: ${timerDecrement.toFixed(2)}, NewTimer: ${updatedEnemy.spawnAnimationTimer.toFixed(2)}`);
                    }
                }

                if (updatedEnemy.hitFlashTimer && updatedEnemy.hitFlashTimer > 0) updatedEnemy.hitFlashTimer = Math.max(0, updatedEnemy.hitFlashTimer - deltaTime);

                if (updatedEnemy.type === EnemyType.SPLITTER_DRONE && updatedEnemy.isSplitting && updatedEnemy.splitAnimTimer && updatedEnemy.splitAnimTimer > 0) { updatedEnemy.splitAnimTimer = Math.max(0, updatedEnemy.splitAnimTimer - deltaTime); if (updatedEnemy.splitAnimTimer <= 0) { const randomSuffix = () => `_R${Math.random().toString(36).substring(7)}`; for (let k = 0; k < ENEMY_SPLITTER_DRONE_SPLIT_COUNT; k++) { const angleOffset = (k / ENEMY_SPLITTER_DRONE_SPLIT_COUNT) * Math.PI * 2; newlySpawnedChildrenThisFrame.push({id: `en_mini_${mutableState.gameTime}_${updatedEnemy.id}_${k}${randomSuffix()}`, x: enemyCenterX + Math.cos(angleOffset) * 10 - ENEMY_MINI_SPLITTER_WIDTH / 2, y: enemyCenterY + Math.sin(angleOffset) * 10 - ENEMY_MINI_SPLITTER_HEIGHT / 2, width: ENEMY_MINI_SPLITTER_WIDTH, height: ENEMY_MINI_SPLITTER_HEIGHT, type: EnemyType.MINI_SPLITTER,health: ENEMY_MINI_SPLITTER_HEALTH, points: ENEMY_MINI_SPLITTER_POINTS, lastShotTime: mutableState.gameTime + Math.random() * ENEMY_MINI_SPLITTER_FIRE_COOLDOWN, spawnAnimationTimer: ENEMY_SPAWN_ANIMATION_DURATION, hitFlashTimer: 0,});} updatedEnemy.health = -100; }}

                if ((!updatedEnemy.spawnAnimationTimer || updatedEnemy.spawnAnimationTimer <= 0) && !(updatedEnemy.type === EnemyType.SPLITTER_DRONE && updatedEnemy.isSplitting) && !(updatedEnemy.isBossPart && (!mutableState.boss || !mutableState.boss.isVisible)) && updatedEnemy.health > 0 ) {
                    const speedMultiplier = (1 + mutableState.stage * 0.05) * (deltaTime / 16.66);
                    if (updatedEnemy.type === EnemyType.GRUNT) { updatedEnemy.y += ENEMY_GRUNT_SPEED * speedMultiplier; if (mutableState.gameTime - (updatedEnemy.lastShotTime || 0) > ENEMY_GRUNT_FIRE_COOLDOWN / (1 + mutableState.stage * 0.1)) { updatedEnemy.lastShotTime = mutableState.gameTime; playSound('enemy_shoot'); muzzleFlashesToCreateThisFrame.push({x: enemyCenterX, y: updatedEnemy.y + updatedEnemy.height, size: MUZZLE_FLASH_SIZE_ENEMY, isPlayerFlash: false, rotation: 90}); newEnemyBullets.push({ id: `eb_grunt_${mutableState.gameTime}_${enemy.id}`, x: enemyCenterX - ENEMY_BULLET_WIDTH / 2, y: updatedEnemy.y + updatedEnemy.height, width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT, isPlayerBullet: false, damage: 1, type: EnemyType.GRUNT });}}
                    else if (updatedEnemy.type === EnemyType.MID_TIER) { updatedEnemy.y += ENEMY_MID_TIER_SPEED * speedMultiplier; if (mutableState.gameTime - (updatedEnemy.lastShotTime || 0) > ENEMY_MID_TIER_FIRE_COOLDOWN / (1 + mutableState.stage * 0.15)) { updatedEnemy.lastShotTime = mutableState.gameTime; playSound('enemy_shoot_mid'); muzzleFlashesToCreateThisFrame.push({x: enemyCenterX, y: updatedEnemy.y + updatedEnemy.height, size: MUZZLE_FLASH_SIZE_ENEMY * 1.2, isPlayerFlash: false, rotation: 90}); newEnemyBullets.push({ id: `eb_mid_${mutableState.gameTime}_${enemy.id}`, x: enemyCenterX - ENEMY_BULLET_WIDTH / 2, y: updatedEnemy.y + updatedEnemy.height, width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT, isPlayerBullet: false, damage: 2, type: EnemyType.MID_TIER });} if (mutableState.gameTime - (updatedEnemy.lastSpecialAttackTime || 0) > ENEMY_MID_TIER_SPECIAL_ATTACK_COOLDOWN / (1 + mutableState.stage * 0.1)) { updatedEnemy.lastSpecialAttackTime = mutableState.gameTime; for (let k = -1; k <= 1; k++) newEnemyBullets.push({id: `eb_mid_sp_${mutableState.gameTime}_${enemy.id}_${k}`, x: enemyCenterX - ENEMY_BULLET_WIDTH / 2, y: updatedEnemy.y + updatedEnemy.height,width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT, isPlayerBullet: false, damage: 1,vx: k * 1.5 * (1 + mutableState.stage * 0.1), vy: ENEMY_BULLET_SPEED * 0.9, type: EnemyType.MID_TIER});}}
                    else if (updatedEnemy.type === EnemyType.SWARM_MINION) { updatedEnemy.y += ENEMY_SWARM_MINION_SPEED * speedMultiplier; updatedEnemy.swarmOscillationOffset = (updatedEnemy.swarmOscillationOffset || 0) + ENEMY_SWARM_MINION_OSCILLATION_SPEED * (deltaTime/16.66); updatedEnemy.x += Math.sin(updatedEnemy.swarmOscillationOffset || 0) * 1.5 * (1 + mutableState.stage * 0.05); updatedEnemy.x = Math.max(0, Math.min(GAME_WIDTH - updatedEnemy.width, updatedEnemy.x)); }
                    else if (updatedEnemy.type === EnemyType.TELEPORTER_ELITE) {  updatedEnemy.teleportTimer = (updatedEnemy.teleportTimer || 0) - deltaTime; if (updatedEnemy.teleportTimer < 0 && updatedEnemy.teleportState !== 'phasing_out' && updatedEnemy.teleportState !== 'phasing_in') updatedEnemy.teleportTimer = 0; const eliteCenterX = updatedEnemy.x + updatedEnemy.width / 2; const eliteCenterY = updatedEnemy.y + updatedEnemy.height / 2; switch(updatedEnemy.teleportState) { case 'phasing_in': if (updatedEnemy.teleportTimer <= 0) { updatedEnemy.teleportState = 'idle'; updatedEnemy.teleportTimer = ENEMY_TELEPORTER_ELITE_IDLE_DURATION; updatedEnemy.x = updatedEnemy.teleportTargetX !== undefined ? updatedEnemy.teleportTargetX : updatedEnemy.x; updatedEnemy.y = updatedEnemy.teleportTargetY !== undefined ? updatedEnemy.teleportTargetY : updatedEnemy.y; } break; case 'idle': if (updatedEnemy.teleportTimer <= 0) { updatedEnemy.teleportState = 'telegraphing'; updatedEnemy.teleportTimer = ENEMY_TELEPORTER_ELITE_TELEGRAPH_DURATION; const dx = (mutableState.player.x + mutableState.player.width/2) - eliteCenterX; const dy = (mutableState.player.y + mutableState.player.height/2) - eliteCenterY; updatedEnemy.aimAngle = Math.atan2(dy, dx); } break; case 'telegraphing': if (updatedEnemy.teleportTimer <= 0) { updatedEnemy.teleportState = 'firing'; playSound('enemy_shoot_elite'); muzzleFlashesToCreateThisFrame.push({x: eliteCenterX, y: eliteCenterY, size: MUZZLE_FLASH_SIZE_ELITE, isPlayerFlash: false, rotation: (updatedEnemy.aimAngle || 0) * (180/Math.PI) + 90}); if (updatedEnemy.aimAngle !== undefined) newEnemyBullets.push({id: `eb_elite_${mutableState.gameTime}_${enemy.id}`, x: eliteCenterX - ENEMY_BULLET_WIDTH / 2, y: eliteCenterY - ENEMY_BULLET_HEIGHT / 2,width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT, isPlayerBullet: false, damage: 2,vx: Math.cos(updatedEnemy.aimAngle) * ENEMY_ELITE_BULLET_SPEED,vy: Math.sin(updatedEnemy.aimAngle) * ENEMY_ELITE_BULLET_SPEED,isFast: true, isEliteVisual: true, type: EnemyType.TELEPORTER_ELITE}); updatedEnemy.teleportState = 'phasing_out'; updatedEnemy.teleportTimer = ENEMY_TELEPORTER_ELITE_PHASE_OUT_DURATION; createParticles(eliteCenterX, eliteCenterY, 20, PARTICLE_TELEPORT_COLOR, 2,4, 300, 150);} break; case 'phasing_out': const currentPhasingOutTimer = Math.max(0, updatedEnemy.teleportTimer || 0); if (currentPhasingOutTimer <= 0) { if (mutableState.gamePhase === GamePhase.CHALLENGE_WAVE_ACTIVE && !updatedEnemy.countedForChallengeClear && updatedEnemy.health > 0) { mutableState.challengeWaveEnemiesRemaining = Math.max(0, mutableState.challengeWaveEnemiesRemaining - 1); updatedEnemy.countedForChallengeClear = true; } updatedEnemy.teleportTimer = -ENEMY_TELEPORTER_ELITE_COOLDOWN_BETWEEN_TELEPORTS; let newTargetX, newTargetY; do { newTargetX = Math.random() * (GAME_WIDTH - updatedEnemy.width); newTargetY = Math.random() * (GAME_HEIGHT * 0.4); } while (Math.abs(newTargetX - mutableState.player.x) < 100 && Math.abs(newTargetY - mutableState.player.y) < 100); updatedEnemy.teleportTargetX = newTargetX; updatedEnemy.teleportTargetY = newTargetY; updatedEnemy.x = -updatedEnemy.width * 2; updatedEnemy.y = -updatedEnemy.height * 2;} if (updatedEnemy.teleportTimer < 0 && (updatedEnemy.teleportTimer + ENEMY_TELEPORTER_ELITE_COOLDOWN_BETWEEN_TELEPORTS <= 0)) { updatedEnemy.x = updatedEnemy.teleportTargetX !== undefined ? updatedEnemy.teleportTargetX : 0; updatedEnemy.y = updatedEnemy.teleportTargetY !== undefined ? updatedEnemy.teleportTargetY : -updatedEnemy.height; updatedEnemy.teleportState = 'phasing_in'; updatedEnemy.teleportTimer = ENEMY_TELEPORTER_ELITE_PHASE_IN_DURATION; updatedEnemy.countedForChallengeClear = false; createParticles(updatedEnemy.x + updatedEnemy.width/2, updatedEnemy.y + updatedEnemy.height/2, 20, PARTICLE_TELEPORT_COLOR, 3,5,400,200);} break;}}
                    else if (updatedEnemy.type === EnemyType.SPLITTER_DRONE) { updatedEnemy.y += ENEMY_SPLITTER_DRONE_SPEED * speedMultiplier;}
                    else if (updatedEnemy.type === EnemyType.MINI_SPLITTER) { updatedEnemy.y += ENEMY_MINI_SPLITTER_SPEED * speedMultiplier; updatedEnemy.x += (Math.random() - 0.5) * ENEMY_MINI_SPLITTER_MOVE_VARIANCE * speedMultiplier; updatedEnemy.x = Math.max(0, Math.min(GAME_WIDTH - updatedEnemy.width, updatedEnemy.x)); if (mutableState.gameTime - (updatedEnemy.lastShotTime || 0) > ENEMY_MINI_SPLITTER_FIRE_COOLDOWN / (1 + mutableState.stage * 0.05)) { updatedEnemy.lastShotTime = mutableState.gameTime; playSound('enemy_shoot_mini'); muzzleFlashesToCreateThisFrame.push({x: enemyCenterX, y: updatedEnemy.y + updatedEnemy.height, size: MUZZLE_FLASH_SIZE_ENEMY * 0.8, isPlayerFlash: false, rotation: 90}); newEnemyBullets.push({ id: `eb_mini_${mutableState.gameTime}_${enemy.id}`, x: enemyCenterX - ENEMY_BULLET_WIDTH / 2, y: updatedEnemy.y + updatedEnemy.height, width: ENEMY_BULLET_WIDTH * 0.8, height: ENEMY_BULLET_HEIGHT * 0.8, isPlayerBullet: false, damage: 1, type: EnemyType.MINI_SPLITTER });}}
                    else if (updatedEnemy.isBossPart && mutableState.boss && mutableState.boss.isVisible) { if (updatedEnemy.type === EnemyType.BOSS_WEAPON_POD && !updatedEnemy.isDestroyed) { if (mutableState.gameTime - (updatedEnemy.lastShotTime || 0) > BOSS_WEAPON_POD_FIRE_COOLDOWN / (mutableState.boss.phase === 2 ? 1.5 : 1)) { updatedEnemy.lastShotTime = mutableState.gameTime; playSound('boss_shoot'); muzzleFlashesToCreateThisFrame.push({x: enemyCenterX, y: enemyCenterY + updatedEnemy.height/2, size: MUZZLE_FLASH_SIZE_ENEMY * 1.5, isPlayerFlash: false, rotation: 90}); newEnemyBullets.push({id: `eb_boss_pod_${updatedEnemy.id}_${mutableState.gameTime}`, x: enemyCenterX - ENEMY_BULLET_WIDTH/2, y: enemyCenterY + updatedEnemy.height/2, width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT*1.2, isPlayerBullet: false, damage: 2, type: EnemyType.BOSS_WEAPON_POD, isFast: true, isEliteVisual: true }); } } }
                }
                return updatedEnemy;
            });


            let currentFrameTotalEnemies: Enemy[] = [...processedEnemiesFromMap, ...newlySpawnedChildrenThisFrame];
            newlySpawnedChildrenThisFrame = []; 

            if (mutableState.gamePhase === GamePhase.BOSS_BATTLE) {
                const bossPartsBeforeFilter = currentFrameTotalEnemies.filter(e => e.isBossPart);
                if (bossPartsBeforeFilter.length > 0) {
                    // console.log(`DEBUG_BOSS_PRE_FILTER: Boss parts count before main filtering: ${bossPartsBeforeFilter.length}`);
                    // bossPartsBeforeFilter.forEach(p => {
                        // console.log(`DEBUG_BOSS_PRE_FILTER_DETAIL: ID: ${p.id}, Type: ${p.partType}, Health: ${p.health}, isDestroyed: ${p.isDestroyed}, SpawnTmr: ${p.spawnAnimationTimer != null ? p.spawnAnimationTimer.toFixed(2) : 'Undef'}`);
                    // });
                }
            }
            
            let enemiesAfterOffScreenCheck = [...currentFrameTotalEnemies];
            if (mutableState.gamePhase === GamePhase.CHALLENGE_WAVE_ACTIVE) {
                enemiesAfterOffScreenCheck = currentFrameTotalEnemies.map(enemy => {
                    let currentEnemy = {...enemy};
                    if (currentEnemy.health > 0 && !currentEnemy.isBossPart && !currentEnemy.countedForChallengeClear) {
                        const isEliteFullyGoneAfterCooldown = currentEnemy.type === EnemyType.TELEPORTER_ELITE && currentEnemy.teleportTimer !== undefined && currentEnemy.teleportTimer < 0 && (currentEnemy.teleportTimer + ENEMY_TELEPORTER_ELITE_COOLDOWN_BETWEEN_TELEPORTS <= 0);
                        const isGeneralOffScreen = currentEnemy.y >= GAME_HEIGHT + currentEnemy.height * 2 && currentEnemy.type !== EnemyType.TELEPORTER_ELITE && !currentEnemy.isBossPart;

                        if (isGeneralOffScreen) {
                            if (!currentEnemy.countedForChallengeClear) {
                                mutableState.challengeWaveEnemiesRemaining = Math.max(0, mutableState.challengeWaveEnemiesRemaining - 1);
                                currentEnemy.countedForChallengeClear = true;
                            }
                            currentEnemy.health = 0; 
                        } else if (isEliteFullyGoneAfterCooldown) {
                           
                            currentEnemy.health = 0;
                        }
                    }
                    return currentEnemy;
                });
            }

            newEnemies = enemiesAfterOffScreenCheck.filter(enemy => {
                if (enemy.type === EnemyType.SPLITTER_DRONE && enemy.isSplitting && (enemy.splitAnimTimer || 0) > 0) return true;
                if (enemy.isBossPart && enemy.isDestroyed) return false; 
                if (enemy.isBossPart) return true; 

                if (enemy.type === EnemyType.TELEPORTER_ELITE && enemy.teleportTimer !== undefined && enemy.teleportTimer < 0 && (enemy.teleportTimer + ENEMY_TELEPORTER_ELITE_COOLDOWN_BETWEEN_TELEPORTS) > 0) return true;
                if (enemy.health <= 0) return false;
                if (enemy.y >= GAME_HEIGHT + enemy.height * 2 && !(enemy.type === EnemyType.TELEPORTER_ELITE && enemy.teleportTimer !== undefined && enemy.teleportTimer < 0) && !enemy.isBossPart) return false;
                return true;
            });

            if (mutableState.gamePhase === GamePhase.BOSS_BATTLE && mutableState.boss) {
                const bossSpeedNormalized = BOSS_HIVE_OVERLORD_MOVE_SPEED * (deltaTime / 16.66);
                if (!mutableState.boss.isVisible) { 
                    mutableState.boss.y += bossSpeedNormalized * 2; 
                    if (mutableState.boss.y >= BOSS_HIVE_OVERLORD_Y) { 
                        mutableState.boss.y = BOSS_HIVE_OVERLORD_Y; 
                        mutableState.boss.isVisible = true; 
                        mutableState.boss.lastMoveChangeTime = mutableState.gameTime; 
                        // console.log(`DEBUG_BOSS: Boss is now visible. GameTime: ${mutableState.gameTime}`);
                    }
                }
                else { 
                    if (mutableState.gameTime - mutableState.boss.lastMoveChangeTime > BOSS_HIVE_OVERLORD_MOVE_INTERVAL) { mutableState.boss.moveDirection = mutableState.boss.moveDirection === 'left' ? 'right' : 'left'; mutableState.boss.lastMoveChangeTime = mutableState.gameTime; } if (mutableState.boss.moveDirection === 'left') mutableState.boss.x -= bossSpeedNormalized; else mutableState.boss.x += bossSpeedNormalized; if (mutableState.boss.x < 0) { mutableState.boss.x = 0; mutableState.boss.moveDirection = 'right'; mutableState.boss.lastMoveChangeTime = mutableState.gameTime;} if (mutableState.boss.x + mutableState.boss.width > GAME_WIDTH) { mutableState.boss.x = GAME_WIDTH - mutableState.boss.width; mutableState.boss.moveDirection = 'left'; mutableState.boss.lastMoveChangeTime = mutableState.gameTime; }
                    for (const attack in mutableState.boss.attackTimers) { mutableState.boss.attackTimers[attack] = Math.max(0, mutableState.boss.attackTimers[attack] - deltaTime); }
                    
                    const corePart = newEnemies.find(e => e.isBossPart && e.bossParentId === mutableState.boss?.id && e.partType === 'core' && !e.isDestroyed);
                    if (corePart && corePart.health > 0 && (!corePart.spawnAnimationTimer || corePart.spawnAnimationTimer <=0)) { 
                        if (mutableState.boss.attackTimers.coreSpreadShot <= 0) { 
                            mutableState.boss.attackTimers.coreSpreadShot = BOSS_CORE_SPREAD_SHOT_COOLDOWN / (mutableState.boss.phase === 2 ? 1.5 : 1); 
                            playSound('boss_shoot_core'); 
                            muzzleFlashesToCreateThisFrame.push({x: corePart.x + corePart.width/2, y: corePart.y + corePart.height/2, size: MUZZLE_FLASH_SIZE_ELITE, isPlayerFlash: false, rotation: 0}); 
                            const numSpreadBullets = mutableState.boss.phase === 2 ? 7 : 5; 
                            for (let i = 0; i < numSpreadBullets; i++) { 
                                const angle = (i / (numSpreadBullets -1) - 0.5) * (Math.PI / (mutableState.boss.phase === 2 ? 2.5 : 3)); 
                                newEnemyBullets.push({ id: `eb_boss_core_${mutableState.boss.id}_${mutableState.gameTime}_${i}`, x: corePart.x + corePart.width / 2 - ENEMY_BULLET_WIDTH / 2, y: corePart.y + corePart.height / 2, width: ENEMY_BULLET_WIDTH * 1.2, height: ENEMY_BULLET_HEIGHT * 1.2, isPlayerBullet: false, damage: 2, vx: Math.sin(angle) * ENEMY_ELITE_BULLET_SPEED * 0.8, vy: Math.cos(angle) * ENEMY_ELITE_BULLET_SPEED * 0.8, type: EnemyType.BOSS_CORE, isFast: true, isEliteVisual: true, }); 
                            } 
                        }
                        
                        if (mutableState.boss.phase === 2 && !mutableState.boss.isLaserSweeping && (mutableState.boss.laserTelegraphTimer === undefined || mutableState.boss.laserTelegraphTimer <= 0) && mutableState.boss.attackTimers.laserSweepCharge <= 0) {
                            mutableState.boss.laserTelegraphTimer = 1000; 
                            mutableState.boss.attackTimers.laserSweepCharge = BOSS_CORE_LASER_SWEEP_COOLDOWN_PHASE2;
                            playSound('boss_laser_charge');
                        }

                        if (mutableState.boss.laserTelegraphTimer && mutableState.boss.laserTelegraphTimer > 0) {
                            mutableState.boss.laserTelegraphTimer = Math.max(0, mutableState.boss.laserTelegraphTimer - deltaTime);
                            if (mutableState.boss.laserTelegraphTimer <= 0) {
                                mutableState.boss.isLaserSweeping = true;
                                mutableState.boss.laserSweepTimer = BOSS_CORE_LASER_SWEEP_DURATION;
                                mutableState.boss.laserSweepAngle = Math.PI / 2; 
                                playSound('boss_laser_fire');
                            }
                        }

                        if (mutableState.boss.isLaserSweeping && mutableState.boss.laserSweepTimer && mutableState.boss.laserSweepTimer > 0) {
                            mutableState.boss.laserSweepTimer = Math.max(0, mutableState.boss.laserSweepTimer - deltaTime);
                            const sweepRange = Math.PI / 1.5; 
                            const sweepProgress = 1 - (mutableState.boss.laserSweepTimer / BOSS_CORE_LASER_SWEEP_DURATION);
                            mutableState.boss.laserSweepAngle = (Math.PI / 2) - (sweepRange / 2) + (sweepProgress * sweepRange);

                            if (!mutableState.player.isInvincible && !mutableState.player.isRolling) {
                                const laserOriginX = corePart.x + corePart.width / 2;
                                const laserOriginY = corePart.y + corePart.height / 2;
                                const dxPlayer = (mutableState.player.x + mutableState.player.width/2) - laserOriginX;
                                const dyPlayer = (mutableState.player.y + mutableState.player.height/2) - laserOriginY;
                                const playerAngleFromCore = Math.atan2(dyPlayer, dxPlayer);
                                const angleDifference = Math.abs(playerAngleFromCore - mutableState.boss.laserSweepAngle);
                                
                                if (angleDifference < Math.PI / 16 && Math.sqrt(dxPlayer*dxPlayer + dyPlayer*dyPlayer) < GAME_HEIGHT) { 
                                    mutableState.player.lives--;
                                    mutableState.player.isInvincible = true; mutableState.player.invincibilityTimer = PLAYER_INVINCIBILITY_DURATION; mutableState.playerTookDamageThisStage = true;
                                    mutableState.playerDamageFlashTimer = PLAYER_DAMAGE_FLASH_DURATION;
                                    playSound('player_hit');
                                    explosionsToCreateThisFrame.push({ x: playerCenterX, y: playerCenterY, size: PLAYER_WIDTH * 1.5, duration: EXPLOSION_DURATION, color: EXPLOSION_PLAYER_COLOR });
                                    const laserHitShake = {intensity: SCREEN_SHAKE_HIT_INTENSITY, duration: SCREEN_SHAKE_DURATION_SHORT, gameTimeForStart: mutableState.gameTime}; if (!screenShakeToApplyThisFrame || laserHitShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = laserHitShake;
                                    if (mutableState.player.lives <= 0 && !mutableState.gameOver) { mutableState.gameOver = true; playSound('game_over');}
                                }
                            }
                            if (mutableState.boss.laserSweepTimer <= 0) {
                                mutableState.boss.isLaserSweeping = false;
                            }
                        }
                    } 
                    if (mutableState.boss.currentHealth <= mutableState.boss.maxHealth / 2 && mutableState.boss.phase === 1) { mutableState.boss.phase = 2; playSound('boss_phase_change'); floatingTextsToCreateThisFrame.push({ text: "BOSS ENRAGED!", x: GAME_WIDTH/2 - 80, y: mutableState.boss.y - 30, color: WARNING_TEXT_COLOR, isLarge: true, lifeTimer: 2000, isHuge: true}); }
                }
                newEnemies.forEach(enemy => { if (enemy.isBossPart && mutableState.boss && enemy.bossParentId === mutableState.boss.id) { if (enemy.type === EnemyType.BOSS_CORE) { enemy.x = mutableState.boss.x + mutableState.boss.width / 2 - BOSS_CORE_WIDTH / 2; enemy.y = mutableState.boss.y + mutableState.boss.height / 2 - BOSS_CORE_HEIGHT / 2; } else if (enemy.partType === 'weapon_pod') { const isLeftPod = enemy.id.includes('pod1'); enemy.x = mutableState.boss.x + (isLeftPod ? 20 : mutableState.boss.width - BOSS_WEAPON_POD_WIDTH - 20); enemy.y = mutableState.boss.y + mutableState.boss.height / 2 - BOSS_WEAPON_POD_HEIGHT / 2; } } });
            }

            newPowerUps = newPowerUps.map(p => { let updatedPowerUp = {...p}; if (updatedPowerUp.isCollected && updatedPowerUp.collectAnimationTimer) { updatedPowerUp.collectAnimationTimer = Math.max(0, updatedPowerUp.collectAnimationTimer - deltaTime); if (updatedPowerUp.collectAnimationTimer <= 0) { playSound('powerup_collect_final'); let puText = ''; let particleColor = ''; switch (updatedPowerUp.type) { case PowerUpType.WEAPON_UPGRADE: mutableState.player.weaponLevel = Math.min(POWERUP_WEAPON_MAX_LEVEL, mutableState.player.weaponLevel + 1); puText = `+WPN LVL ${mutableState.player.weaponLevel}`; particleColor = PARTICLE_WEAPON_UP_COLOR; break; case PowerUpType.BOMB_CHARGE: mutableState.player.bombs = Math.min(PLAYER_INITIAL_BOMBS + 3, mutableState.player.bombs + 1); puText = '+BOMB'; particleColor = PARTICLE_BOMB_CHARGE_COLOR; break; case PowerUpType.SHIELD: mutableState.player.isInvincible = true; mutableState.player.invincibilityTimer = Math.max(mutableState.player.invincibilityTimer || 0, 5000); puText = '+SHIELD'; particleColor = PARTICLE_SHIELD_COLOR; break; case PowerUpType.LASER_BEAM: mutableState.player.isLaserActive = true; mutableState.player.laserTimer = POWERUP_LASER_BEAM_DURATION; puText = 'LASER BEAM!'; playSound('laser_powerup'); particleColor = PARTICLE_LASER_BEAM_COLOR; break; case PowerUpType.SCORE_MULTIPLIER: mutableState.scoreMultiplier = POWERUP_SCORE_MULTIPLIER_VALUE; mutableState.scoreMultiplierTimer = POWERUP_SCORE_MULTIPLIER_DURATION; puText = `x${POWERUP_SCORE_MULTIPLIER_VALUE} SCORE!`; floatingTextsToCreateThisFrame.push({text: puText, x: playerCenterX - 40, y: mutableState.player.y - 30, color: FLOATING_TEXT_MULTIPLIER_COLOR, isLarge: true, lifeTimer: 1500}); playSound('score_multiplier_pickup'); particleColor = PARTICLE_SCORE_MULTIPLIER_COLOR; break; } if (updatedPowerUp.type !== PowerUpType.SCORE_MULTIPLIER && puText) floatingTextsToCreateThisFrame.push({ text: puText, x: playerCenterX - 20, y: mutableState.player.y - 20, color: FLOATING_TEXT_COLOR, isLarge: updatedPowerUp.type === PowerUpType.LASER_BEAM}); if (particleColor) createParticles(playerCenterX, playerCenterY, 25, particleColor, 2, 4, 300, 250, 1.5, 3); return null; } return updatedPowerUp; } let newPowerUpX = updatedPowerUp.x; let newPowerUpY = updatedPowerUp.y + POWERUP_SPEED * (deltaTime/16.66); const dxToPlayer = playerCenterX - (updatedPowerUp.x + updatedPowerUp.width/2); const dyToPlayer = playerCenterY - (updatedPowerUp.y + updatedPowerUp.height/2); const distToPlayer = Math.sqrt(dxToPlayer*dxToPlayer + dyToPlayer*dyToPlayer); if (updatedPowerUp.attractionTimer === undefined) updatedPowerUp.attractionTimer = 200; if (updatedPowerUp.attractionTimer > 0) updatedPowerUp.attractionTimer = Math.max(0, updatedPowerUp.attractionTimer - deltaTime); if (distToPlayer < POWERUP_ATTRACT_RADIUS && updatedPowerUp.attractionTimer <=0 && !updatedPowerUp.isCollected) { const attractFactor = Math.min(1, (POWERUP_ATTRACT_RADIUS - distToPlayer) / POWERUP_ATTRACT_RADIUS) * POWERUP_ATTRACT_SPEED; newPowerUpX += dxToPlayer * attractFactor; newPowerUpY += dyToPlayer * attractFactor; } return { ...updatedPowerUp, x: newPowerUpX, y: newPowerUpY }; }).filter(p => p !== null && p.y < GAME_HEIGHT && (!p.isCollected || (p.collectAnimationTimer && p.collectAnimationTimer > 0))) as PowerUp[];

            for (let i = newPlayerBullets.length - 1; i >= 0; i--) {
                const bullet = newPlayerBullets[i];
                if (!bullet) continue;
                let bulletHasHit = false;
                
                for (let j = 0; j < newEnemies.length; j++) {
                    let enemy = newEnemies[j];
                    if (!enemy || enemy.health <= 0 || enemy.isSplitting || (enemy.isBossPart && enemy.isDestroyed) || (enemy.type === EnemyType.TELEPORTER_ELITE && (enemy.teleportState === 'phasing_in' || enemy.teleportState === 'phasing_out'))) continue;
                    
                    if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x && bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
                        bulletHasHit = true;
                        enemy.hitFlashTimer = ENEMY_HIT_FLASH_DURATION;
                        playSound('enemy_hit');
                        createParticles(bullet.x + bullet.width/2, bullet.y + bullet.height/2, BULLET_IMPACT_SPARK_COUNT, PARTICLE_BULLET_IMPACT_COLOR, BULLET_IMPACT_SPARK_SIZE, 1, BULLET_IMPACT_SPARK_LIFE, 50, 0.5, 1, 'square', undefined, true);

                        if (!enemy.spawnAnimationTimer || enemy.spawnAnimationTimer <= 0) { 
                            enemy.health -= bullet.damage;
                            if (enemy.isBossPart && mutableState.boss) {
                                mutableState.boss.currentHealth -= bullet.damage;
                                if (mutableState.boss.currentHealth <= 0) mutableState.boss.currentHealth = 0;
                                createParticles(bullet.x + bullet.width/2, bullet.y + bullet.height/2, 5, PARTICLE_BOSS_HIT_COLOR, 2, 2, 150, 100);
                                const bossPartHitShake = {intensity: SCREEN_SHAKE_BOSS_HIT_INTENSITY, duration: SCREEN_SHAKE_BOSS_HIT_DURATION, gameTimeForStart: mutableState.gameTime}; if (!screenShakeToApplyThisFrame || bossPartHitShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = bossPartHitShake;
                            } else if (enemy.type === EnemyType.BOSS_HIVE_OVERLORD && mutableState.boss) { // Main boss body hit
                                createParticles(bullet.x + bullet.width/2, bullet.y + bullet.height/2, 5, PARTICLE_BOSS_HIT_COLOR, 2, 2, 150, 100);
                                const bossBodyHitShake = {intensity: SCREEN_SHAKE_BOSS_HIT_INTENSITY, duration: SCREEN_SHAKE_BOSS_HIT_DURATION, gameTimeForStart: mutableState.gameTime}; if (!screenShakeToApplyThisFrame || bossBodyHitShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = bossBodyHitShake;
                            }
                        }


                        if (enemy.health <= 0 && (!enemy.spawnAnimationTimer || enemy.spawnAnimationTimer <= 0)) { 
                            const enemyCenterXCollision = enemy.x + enemy.width / 2; const enemyCenterYCollision = enemy.y + enemy.height / 2;
                            let pointsGainedCollision = enemy.points * mutableState.scoreMultiplier;
                            if (mutableState.gameTime - mutableState.lastKillTime < CHAIN_KILL_WINDOW_DURATION) mutableState.chainKillCount++; else mutableState.chainKillCount = 1;
                            mutableState.lastKillTime = mutableState.gameTime; mutableState.chainKillTimer = CHAIN_KILL_WINDOW_DURATION;
                            let comboBonusCollision = 0;
                            if (mutableState.chainKillCount > 1) { comboBonusCollision = mutableState.chainKillCount * CHAIN_KILL_BONUS_PER_KILL * mutableState.scoreMultiplier; pointsGainedCollision += comboBonusCollision; floatingTextsToCreateThisFrame.push({text: `COMBO x${mutableState.chainKillCount}`, x: enemyCenterXCollision - 40, y: enemyCenterYCollision - 30, color: FLOATING_TEXT_COMBO_COLOR, isLarge: true, lifeTimer: FLOATING_TEXT_DURATION_COMBO}); if(comboBonusCollision > 0) floatingTextsToCreateThisFrame.push({text: `+${Math.floor(comboBonusCollision)}`, x: enemyCenterXCollision -30, y: enemyCenterYCollision - 5, color: FLOATING_TEXT_COMBO_COLOR, lifeTimer: FLOATING_TEXT_DURATION_COMBO * 0.8}); }
                            mutableState.score += Math.floor(pointsGainedCollision);
                            const isMajorExplosionCollision = enemy.type === EnemyType.MID_TIER || enemy.type === EnemyType.TELEPORTER_ELITE || enemy.type === EnemyType.SPLITTER_DRONE || enemy.isBossPart;
                            explosionsToCreateThisFrame.push({x: enemyCenterXCollision, y: enemyCenterYCollision, size: isMajorExplosionCollision ? EXPLOSION_MAX_SIZE * 1.2 : (enemy.type === EnemyType.SWARM_MINION || enemy.type === EnemyType.MINI_SPLITTER ? EXPLOSION_MAX_SIZE * 0.6 :EXPLOSION_MAX_SIZE), duration: EXPLOSION_DURATION, color: enemy.isBossPart ? EXPLOSION_BOSS_PART_COLOR : EXPLOSION_ENEMY_COLOR, hasDebris: true, hasShockwave: isMajorExplosionCollision});
                            if (isMajorExplosionCollision) { const majorExplosionShake = {intensity: SCREEN_SHAKE_DEFAULT_INTENSITY * 1.5, duration: SCREEN_SHAKE_DURATION_SHORT, gameTimeForStart: mutableState.gameTime}; if (!screenShakeToApplyThisFrame || majorExplosionShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = majorExplosionShake; }
                            if (!enemy.isBossPart) mutableState.currentKillsThisStage++;
                            if (mutableState.gamePhase === GamePhase.CHALLENGE_WAVE_ACTIVE && !enemy.isBossPart && !enemy.countedForChallengeClear) { mutableState.challengeWaveEnemiesRemaining = Math.max(0, mutableState.challengeWaveEnemiesRemaining - 1); enemy.countedForChallengeClear = true; }
                            let dropChance = POWERUP_DROP_CHANCE; if (enemy.type === EnemyType.MID_TIER) dropChance = POWERUP_DROP_CHANCE_MID_TIER; else if (enemy.type === EnemyType.SWARM_MINION) dropChance = POWERUP_DROP_CHANCE_SWARM; else if (enemy.type === EnemyType.TELEPORTER_ELITE) dropChance = POWERUP_DROP_CHANCE_ELITE; else if (enemy.type === EnemyType.SPLITTER_DRONE) dropChance = POWERUP_DROP_CHANCE_SPLITTER; else if (enemy.type === EnemyType.MINI_SPLITTER) dropChance = POWERUP_DROP_CHANCE_MINI_SPLITTER;
                            if (!enemy.isBossPart && Math.random() < dropChance) { let powerUpType: PowerUpType; const randType = Math.random(); if (randType < 0.35 || (mutableState.player.weaponLevel < POWERUP_WEAPON_MAX_LEVEL && randType < 0.55)) powerUpType = PowerUpType.WEAPON_UPGRADE; else if (randType < 0.60) powerUpType = PowerUpType.BOMB_CHARGE; else if (randType < 0.80) powerUpType = PowerUpType.SHIELD; else if (randType < 0.90 && mutableState.stage >= 1) powerUpType = PowerUpType.LASER_BEAM; else powerUpType = PowerUpType.SCORE_MULTIPLIER; newlySpawnedPowerUpsThisFrame.push({id: `pu_${mutableState.gameTime}_${enemy.id}`, type: powerUpType, x: enemyCenterXCollision - POWERUP_WIDTH / 2, y: enemyCenterYCollision - POWERUP_HEIGHT / 2, width: POWERUP_WIDTH, height: POWERUP_HEIGHT, attractionTimer: 300}); }
                            if (enemy.type === EnemyType.SPLITTER_DRONE && !enemy.isSplitting) { enemy.isSplitting = true; enemy.splitAnimTimer = ENEMY_SPLITTER_ANIM_DURATION;}
                            else if (enemy.isBossPart && enemy.type === EnemyType.BOSS_WEAPON_POD && !enemy.isDestroyed) { enemy.isDestroyed = true; mutableState.score += BOSS_WEAPON_POD_POINTS_ON_DESTROY * mutableState.scoreMultiplier; }
                        }
                        break; 
                    }
                }
                 
                if (mutableState.boss && mutableState.boss.isVisible && !bulletHasHit) {
                    const weaponPods = newEnemies.filter(e => e.isBossPart && e.bossParentId === mutableState.boss?.id && e.partType === 'weapon_pod');
                    const corePart = newEnemies.find(e => e.isBossPart && e.bossParentId === mutableState.boss?.id && e.partType === 'core');
                    
                    const allWeaponPodsDestroyed = weaponPods.every(p => p.isDestroyed === true);
                    const coreEffectivelyDestroyed = corePart ? corePart.health <= 0 : true;

                    if (allWeaponPodsDestroyed && coreEffectivelyDestroyed) {
                        if (bullet.x < mutableState.boss.x + mutableState.boss.width &&
                            bullet.x + bullet.width > mutableState.boss.x &&
                            bullet.y < mutableState.boss.y + mutableState.boss.height &&
                            bullet.y + bullet.height > mutableState.boss.y) {
                            
                            bulletHasHit = true;
                            mutableState.boss.currentHealth -= bullet.damage;
                            mutableState.boss.hitFlashTimer = ENEMY_HIT_FLASH_DURATION;
                            playSound('enemy_hit'); 
                            createParticles(bullet.x + bullet.width/2, bullet.y + bullet.height/2, 5, PARTICLE_BOSS_HIT_COLOR, 3, 3, 200, 150);
                            const bossBodyHitShake = {intensity: SCREEN_SHAKE_BOSS_HIT_INTENSITY * 1.2, duration: SCREEN_SHAKE_BOSS_HIT_DURATION, gameTimeForStart: mutableState.gameTime}; if (!screenShakeToApplyThisFrame || bossBodyHitShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = bossBodyHitShake;
                            if (mutableState.boss.currentHealth <= 0) mutableState.boss.currentHealth = 0;
                        }
                    }
                }

                if (bulletHasHit) newPlayerBullets.splice(i, 1);
            }

            if (mutableState.player.isLaserActive && mutableState.player.laserTimer && mutableState.player.laserTimer > 0 && mutableState.gameTime - lastLaserDamageTimeRef.current > POWERUP_LASER_DAMAGE_TICK_RATE) {
                lastLaserDamageTimeRef.current = mutableState.gameTime;
                const laserLeft = playerCenterX - (PLAYER_WIDTH * 0.8 / 2); const laserRight = playerCenterX + (PLAYER_WIDTH * 0.8 / 2);
                newEnemies.forEach(enemy => {
                    if (enemy.health <= 0 || enemy.isSplitting || (enemy.isBossPart && enemy.isDestroyed)) return;
                    if (enemy.x + enemy.width > laserLeft && enemy.x < laserRight && enemy.y < mutableState.player.y) {
                        enemy.hitFlashTimer = ENEMY_HIT_FLASH_DURATION * 0.5;
                        if (!enemy.spawnAnimationTimer || enemy.spawnAnimationTimer <= 0) { 
                            const laserDamage = 1; enemy.health -= laserDamage;
                             if (enemy.isBossPart && mutableState.boss) { mutableState.boss.currentHealth -= laserDamage; if (mutableState.boss.currentHealth <= 0) mutableState.boss.currentHealth = 0; createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 3, PARTICLE_BOSS_HIT_COLOR, 1, 1, 80, 50); }
                             else if (enemy.type === EnemyType.BOSS_HIVE_OVERLORD && mutableState.boss) { createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 3, PARTICLE_BOSS_HIT_COLOR, 1, 1, 80, 50); }
                        }

                        if (enemy.health <= 0 && (!enemy.spawnAnimationTimer || enemy.spawnAnimationTimer <= 0)) { /* Same kill logic as bullets */ const enemyCenterXLaser = enemy.x + enemy.width / 2; const enemyCenterYLaser = enemy.y + enemy.height / 2; let pointsGainedLaser = enemy.points * mutableState.scoreMultiplier; if (mutableState.gameTime - mutableState.lastKillTime < CHAIN_KILL_WINDOW_DURATION) mutableState.chainKillCount++; else mutableState.chainKillCount = 1; mutableState.lastKillTime = mutableState.gameTime; mutableState.chainKillTimer = CHAIN_KILL_WINDOW_DURATION; let comboBonusLaser = 0; if (mutableState.chainKillCount > 1) { comboBonusLaser = mutableState.chainKillCount * CHAIN_KILL_BONUS_PER_KILL * mutableState.scoreMultiplier; pointsGainedLaser += comboBonusLaser; floatingTextsToCreateThisFrame.push({text: `COMBO x${mutableState.chainKillCount}`, x: enemyCenterXLaser - 40, y: enemyCenterYLaser - 30, color: FLOATING_TEXT_COMBO_COLOR, isLarge: true, lifeTimer: FLOATING_TEXT_DURATION_COMBO}); if(comboBonusLaser > 0) floatingTextsToCreateThisFrame.push({text: `+${Math.floor(comboBonusLaser)}`, x: enemyCenterXLaser -30, y: enemyCenterYLaser - 5, color: FLOATING_TEXT_COMBO_COLOR, lifeTimer: FLOATING_TEXT_DURATION_COMBO * 0.8});} mutableState.score += Math.floor(pointsGainedLaser); const isMajorExplosionLaser = enemy.type === EnemyType.MID_TIER || enemy.type === EnemyType.TELEPORTER_ELITE || enemy.type === EnemyType.SPLITTER_DRONE || enemy.isBossPart; explosionsToCreateThisFrame.push({x: enemyCenterXLaser, y: enemyCenterYLaser, size: isMajorExplosionLaser ? EXPLOSION_MAX_SIZE * 1.2 : EXPLOSION_MAX_SIZE, duration: EXPLOSION_DURATION, color: enemy.isBossPart ? EXPLOSION_BOSS_PART_COLOR : EXPLOSION_ENEMY_COLOR, hasDebris: true, hasShockwave: isMajorExplosionLaser}); if (!enemy.isBossPart) mutableState.currentKillsThisStage++; if (mutableState.gamePhase === GamePhase.CHALLENGE_WAVE_ACTIVE && !enemy.isBossPart && !enemy.countedForChallengeClear) { mutableState.challengeWaveEnemiesRemaining = Math.max(0, mutableState.challengeWaveEnemiesRemaining - 1); enemy.countedForChallengeClear = true; } if (enemy.type === EnemyType.SPLITTER_DRONE && !enemy.isSplitting) { enemy.isSplitting = true; enemy.splitAnimTimer = ENEMY_SPLITTER_ANIM_DURATION;} else if (enemy.isBossPart && enemy.type === EnemyType.BOSS_WEAPON_POD && !enemy.isDestroyed) { enemy.isDestroyed = true; mutableState.score += BOSS_WEAPON_POD_POINTS_ON_DESTROY * mutableState.scoreMultiplier;} }
                    }
                });
                 if (mutableState.boss && mutableState.boss.isVisible) {
                    const weaponPods = newEnemies.filter(e => e.isBossPart && e.bossParentId === mutableState.boss?.id && e.partType === 'weapon_pod');
                    const corePart = newEnemies.find(e => e.isBossPart && e.bossParentId === mutableState.boss?.id && e.partType === 'core');
                    const allWeaponPodsDestroyed = weaponPods.every(p => p.isDestroyed === true);
                    const coreEffectivelyDestroyed = corePart ? corePart.health <= 0 : true;
                    if (allWeaponPodsDestroyed && coreEffectivelyDestroyed) {
                        if (mutableState.boss.x + mutableState.boss.width > laserLeft && mutableState.boss.x < laserRight && mutableState.boss.y < mutableState.player.y) {
                            const laserDamageToBossBody = 2; 
                            mutableState.boss.currentHealth -= laserDamageToBossBody;
                            mutableState.boss.hitFlashTimer = ENEMY_HIT_FLASH_DURATION;
                            createParticles(mutableState.boss.x + Math.random()*mutableState.boss.width, mutableState.boss.y + mutableState.boss.height/2, 3, PARTICLE_BOSS_HIT_COLOR, 2, 2, 80, 50);
                            if (mutableState.boss.currentHealth <= 0) mutableState.boss.currentHealth = 0;
                        }
                    }
                 }
            }

            if (!mutableState.player.isInvincible && !mutableState.player.isRolling) {
                for (const bullet of newEnemyBullets) {
                    if (bullet.x < playerCenterX + mutableState.player.width/2 && bullet.x + bullet.width > playerCenterX - mutableState.player.width/2 && bullet.y < playerCenterY + mutableState.player.height/2 && bullet.y + bullet.height > playerCenterY - mutableState.player.height/2) {
                        mutableState.player.lives--; mutableState.player.isInvincible = true; mutableState.player.invincibilityTimer = PLAYER_INVINCIBILITY_DURATION; mutableState.playerTookDamageThisStage = true;
                        mutableState.playerDamageFlashTimer = PLAYER_DAMAGE_FLASH_DURATION;
                        playSound('player_hit');
                        explosionsToCreateThisFrame.push({ x: playerCenterX, y: playerCenterY, size: PLAYER_WIDTH * 1.5, duration: EXPLOSION_DURATION, color: EXPLOSION_PLAYER_COLOR });
                        const playerHitShake = {intensity: SCREEN_SHAKE_HIT_INTENSITY, duration: SCREEN_SHAKE_DURATION_SHORT, gameTimeForStart: mutableState.gameTime}; if (!screenShakeToApplyThisFrame || playerHitShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = playerHitShake;
                        if (mutableState.player.lives <= 0 && !mutableState.gameOver) { mutableState.gameOver = true; playSound('game_over'); } break;
                    }
                }
                if (mutableState.player.lives > 0) {
                    for (const enemy of newEnemies) {
                        if (enemy.health <= 0 || enemy.isSplitting || (enemy.spawnAnimationTimer && enemy.spawnAnimationTimer > 0) || (enemy.type === EnemyType.TELEPORTER_ELITE && (enemy.teleportState === 'phasing_in' || enemy.teleportState === 'phasing_out'))) continue;
                        if (playerCenterX < enemy.x + enemy.width && playerCenterX + mutableState.player.width/2 > enemy.x && playerCenterY < enemy.y + enemy.height && playerCenterY + mutableState.player.height/2 > enemy.y) {
                            mutableState.player.lives--; mutableState.player.isInvincible = true; mutableState.player.invincibilityTimer = PLAYER_INVINCIBILITY_DURATION; mutableState.playerTookDamageThisStage = true;
                            mutableState.playerDamageFlashTimer = PLAYER_DAMAGE_FLASH_DURATION;
                            playSound('player_hit');
                            explosionsToCreateThisFrame.push({ x: playerCenterX, y: playerCenterY, size: PLAYER_WIDTH * 1.5, duration: EXPLOSION_DURATION, color: EXPLOSION_PLAYER_COLOR });
                            const playerCollideShake = {intensity: SCREEN_SHAKE_HIT_INTENSITY, duration: SCREEN_SHAKE_DURATION_MEDIUM, gameTimeForStart: mutableState.gameTime}; if (!screenShakeToApplyThisFrame || playerCollideShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = playerCollideShake;
                            enemy.health = 0; // Enemy also destroyed on collision
                            if (enemy.type !== EnemyType.BOSS_HIVE_OVERLORD && !enemy.isBossPart) { explosionsToCreateThisFrame.push({x: enemy.x + enemy.width/2, y: enemy.y + enemy.height/2, size: enemy.width * 1.2, duration: EXPLOSION_DURATION, color: EXPLOSION_ENEMY_COLOR, hasDebris: true });}
                            if (mutableState.player.lives <= 0 && !mutableState.gameOver) { mutableState.gameOver = true; playSound('game_over'); } break;
                        }
                    }
                }
            }

            for (let i = newPowerUps.length - 1; i >= 0; i--) {
                const powerUp = newPowerUps[i];
                if (!powerUp || powerUp.isCollected) continue;
                if (playerCenterX < powerUp.x + powerUp.width && playerCenterX + mutableState.player.width/2 > powerUp.x && playerCenterY < powerUp.y + powerUp.height && playerCenterY + mutableState.player.height/2 > powerUp.y) {
                    powerUp.isCollected = true; powerUp.collectAnimationTimer = POWERUP_COLLECT_ANIM_DURATION; playSound('powerup_pickup');
                }
            }

            if (mutableState.boss && mutableState.boss.currentHealth <= 0 && !bossDefeatedThisFrame) {
                mutableState.gamePhase = GamePhase.BOSS_DEFEATED;
                bossDefeatedThisFrame = true;
                mutableState.boss.currentHealth = 0;
                mutableState.score += BOSS_HIVE_OVERLORD_POINTS * mutableState.scoreMultiplier;
                explosionsToCreateThisFrame.push({ x: mutableState.boss.x + mutableState.boss.width/2, y: mutableState.boss.y + mutableState.boss.height/2, size: mutableState.boss.width * 1.5, duration: EXPLOSION_DURATION * 2.5, color: EXPLOSION_BOSS_DEATH_COLOR, hasDebris:true, hasShockwave: true});
                floatingTextsToCreateThisFrame.push({text: "OVERLORD ANNIHILATED!", x: GAME_WIDTH/2 - 200, y: GAME_HEIGHT/2 - 60, color: VICTORY_TEXT_COLOR, isHuge: true, lifeTimer: STAGE_TRANSITION_VICTORY_DURATION - 300 });
                mutableState.stageTitle = "VICTORY!";
                mutableState.stageSubtitle = `+${BOSS_HIVE_OVERLORD_POINTS * mutableState.scoreMultiplier} PTS`;
                mutableState.stageTransitionTimer = STAGE_TRANSITION_VICTORY_DURATION;
                const bossDeathShake = {intensity: SCREEN_SHAKE_BOMB_INTENSITY * 2, duration: SCREEN_SHAKE_DURATION_MEDIUM * 2.5, gameTimeForStart: mutableState.gameTime}; if (!screenShakeToApplyThisFrame || bossDeathShake.intensity > screenShakeToApplyThisFrame.intensity) screenShakeToApplyThisFrame = bossDeathShake;
                playSound('boss_explode_final');
            }

            if (mutableState.gamePhase === GamePhase.PLAYING && mutableState.currentKillsThisStage >= mutableState.targetKillsForStage && mutableState.targetKillsForStage > 0) {
                if (mutableState.stage === BOSS_STAGE_TRIGGER) { mutableState.gamePhase = GamePhase.BOSS_BATTLE_INCOMING; mutableState.stageTitle = "WARNING!"; mutableState.stageSubtitle = "HIVE OVERLORD APPROACHING"; mutableState.stageTransitionTimer = STAGE_TRANSITION_WARNING_DURATION; playSound('boss_warning');} 
                else { mutableState.gamePhase = GamePhase.CHALLENGE_WAVE_PENDING; mutableState.stageTitle = "WARNING!"; mutableState.stageSubtitle = "CHALLENGE WAVE INCOMING!"; mutableState.stageTransitionTimer = STAGE_TRANSITION_WARNING_DURATION; playSound('warning_siren');}
            } else if (mutableState.gamePhase === GamePhase.CHALLENGE_WAVE_ACTIVE && mutableState.challengeWaveEnemiesRemaining <= 0) {
                mutableState.gamePhase = GamePhase.STAGE_TRANSITION; mutableState.stage++; mutableState.currentKillsThisStage = 0; mutableState.gruntSpawnCounter = 0;
                if (!mutableState.playerTookDamageThisStage) { mutableState.score += PERFECT_STAGE_BONUS * mutableState.scoreMultiplier; floatingTextsToCreateThisFrame.push({text: "PERFECT!", x: GAME_WIDTH/2 - 100, y: GAME_HEIGHT/2 - 50, color: FLOATING_TEXT_PERFECT_COLOR, isHuge: true, lifeTimer: STAGE_TRANSITION_DEFAULT_DURATION - 300}); playSound('perfect_stage'); }
                mutableState.playerTookDamageThisStage = false;
                if (mutableState.stage === BOSS_STAGE_TRIGGER + 1) { // Completed boss stage
                    mutableState.stageTitle = `STAGE ${mutableState.stage}`; mutableState.stageSubtitle = "AREA CLEAR!"; mutableState.targetKillsForStage = KILLS_PER_STAGE[Math.min(mutableState.stage - 1, KILLS_PER_STAGE.length - 1)] || 1000; mutableState.challengeWaveDefinition = CHALLENGE_WAVES[Math.min(mutableState.stage - 1, CHALLENGE_WAVES.length - 1)];
                } else {
                    mutableState.stageTitle = `STAGE ${mutableState.stage}`; mutableState.stageSubtitle = "GET READY!"; mutableState.targetKillsForStage = KILLS_PER_STAGE[Math.min(mutableState.stage - 1, KILLS_PER_STAGE.length - 1)]; mutableState.challengeWaveDefinition = CHALLENGE_WAVES[Math.min(mutableState.stage - 1, CHALLENGE_WAVES.length - 1)];
                }
                mutableState.stageTransitionTimer = STAGE_TRANSITION_DEFAULT_DURATION;
            }
        }

        newExplosions.push(...explosionsToCreateThisFrame.map(e => ({ ...e, id: `expl_${mutableState.gameTime}_${Math.random()}`, elapsed: 0 })));
        newExplosions = newExplosions.map(exp => ({ ...exp, elapsed: exp.elapsed + deltaTime })).filter(exp => exp.elapsed < exp.duration);
        
        newFloatingTexts.push(...floatingTextsToCreateThisFrame.map(ft => ({ ...ft, id: `ft_${mutableState.gameTime}_${Math.random()}`, initialY: ft.initialY !== undefined ? ft.initialY : ft.y, lifeTimer: ft.lifeTimer || (ft.isHuge ? FLOATING_TEXT_DURATION*1.5 : (ft.isLarge ? FLOATING_TEXT_DURATION*1.2 : FLOATING_TEXT_DURATION))})));
        newFloatingTexts = newFloatingTexts.map(ft => ({ ...ft, lifeTimer: Math.max(0, (ft.lifeTimer || 0) - deltaTime) })).filter(ft => ft.lifeTimer > 0);

        newMuzzleFlashes.push(...muzzleFlashesToCreateThisFrame.map(mf => ({ ...mf, id: `mf_${mutableState.gameTime}_${Math.random()}`, lifeTimer: MUZZLE_FLASH_DURATION })));
        newMuzzleFlashes = newMuzzleFlashes.map(mf => ({...mf, lifeTimer: Math.max(0, (mf.lifeTimer || 0) - deltaTime)})).filter(mf => mf.lifeTimer > 0);
        
        if (screenShakeToApplyThisFrame && (!mutableState.screenShake.active || screenShakeToApplyThisFrame.intensity >= mutableState.screenShake.intensity)) { mutableState.screenShake = { intensity: screenShakeToApplyThisFrame.intensity, duration: screenShakeToApplyThisFrame.duration, active: true, startTime: screenShakeToApplyThisFrame.gameTimeForStart }; }

        mutableState.enemies = newEnemies;
        mutableState.playerBullets = newPlayerBullets;
        mutableState.enemyBullets = newEnemyBullets;
        mutableState.powerUps = [...newPowerUps, ...newlySpawnedPowerUpsThisFrame];
        mutableState.explosions = newExplosions;
        mutableState.floatingTexts = newFloatingTexts;
        mutableState.muzzleFlashes = newMuzzleFlashes;

        if (mutableState.gameOver && !prev.gameOver) { // Check if game over just happened
             onGameOver(mutableState.score);
        }
        return mutableState;
      }); // End of setGameState callback

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }; // End of gameLoop function

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [onGameOver, createInitialGameState, resetGame, spawnChallengeWave, playSound, createParticles, createBossEntity, createBossParts]); // Keep minimal stable dependencies

  const activeExplosions = useMemo(() => gameState.explosions.map(exp => <ExplosionEffect key={exp.id} explosion={exp} />), [gameState.explosions]);
  const activeFloatingTexts = useMemo(() => gameState.floatingTexts.map(ft => <FloatingTextEffect key={ft.id} floatingText={ft} />), [gameState.floatingTexts]);
  const activeMuzzleFlashes = useMemo(() => gameState.muzzleFlashes.map(mf => <MuzzleFlashEffect key={mf.id} flash={mf} />), [gameState.muzzleFlashes]);
  const activeParticles = useMemo(() => particles.map(p => (
    <div key={p.id} className={`absolute pointer-events-none ${p.color} ${p.particleType === 'square' ? '' : 'rounded-full'}`} style={{ left: p.x - p.size/2, top: p.y - p.size/2, width: p.size, height: p.size, opacity: p.opacity, transform: `rotate(${p.rotation || 0}deg)` }} aria-hidden="true"/>
  )), [particles]);

  const shakeX = gameState.screenShake.active ? (Math.random() - 0.5) * gameState.screenShake.intensity * 2 : 0;
  const shakeY = gameState.screenShake.active ? (Math.random() - 0.5) * gameState.screenShake.intensity * 2 : 0;

  const playerDamageFlashOpacity = gameState.playerDamageFlashTimer && gameState.playerDamageFlashTimer > 0 
    ? Math.min(0.4, (gameState.playerDamageFlashTimer / PLAYER_DAMAGE_FLASH_DURATION) * 0.4) 
    : 0;


  return (
    <div 
        className="relative w-full h-full overflow-hidden z-0" 
        style={{ 
            backgroundColor: 'transparent', 
            transform: `translateX(${shakeX}px) translateY(${shakeY}px)`,
            transition: gameState.screenShake.active ? 'transform 0.05s linear' : 'none',
        }}
    >
      <ParallaxBackground starLayers={starLayers} currentStage={gameState.stage} />
      <HUD 
        displayedScore={gameState.displayedScore} 
        lives={gameState.player.lives} 
        bombs={gameState.player.bombs} 
        stage={gameState.stage} 
        weaponLevel={gameState.player.weaponLevel} 
        scoreMultiplier={gameState.scoreMultiplier}
        scoreMultiplierTimer={gameState.scoreMultiplierTimer}
        rollCooldownTimer={gameState.player.rollCooldownTimer}
        currentKillsThisStage={gameState.currentKillsThisStage}
        targetKillsForStage={gameState.targetKillsForStage}
        gamePhase={gameState.gamePhase}
      />
      {gameState.boss && (
        <BossHealthBar 
            currentHealth={gameState.boss.currentHealth} 
            maxHealth={gameState.boss.maxHealth} 
            isVisible={gameState.boss.isVisible} 
            bossName={gameState.boss.type === EnemyType.BOSS_HIVE_OVERLORD ? "HIVE OVERLORD" : "BOSS"}
        />
      )}
      <StageTransitionDisplay 
        isVisible={gameState.stageTransitionTimer > 0 && 
                    (gameState.gamePhase === GamePhase.STAGE_TRANSITION || 
                     gameState.gamePhase === GamePhase.CHALLENGE_WAVE_PENDING ||
                     gameState.gamePhase === GamePhase.BOSS_BATTLE_INCOMING ||
                     gameState.gamePhase === GamePhase.BOSS_DEFEATED
                    )} 
        gamePhase={gameState.gamePhase} 
        stageTitle={gameState.stageTitle} 
        stageSubtitle={gameState.stageSubtitle} 
      />

      {gameState.player.isLaserActive && <LaserBeamEffect player={gameState.player} gameHeight={GAME_HEIGHT} />}
      {gameState.boss && gameState.boss.isLaserSweeping && 
        <BossLaserSweepEffect 
            bossState={gameState.boss} 
            corePart={gameState.enemies.find(e => e.isBossPart && e.partType === 'core' && e.bossParentId === gameState.boss?.id)} 
        />}


      {gameState.enemies.map(enemy => <EnemyUnit key={enemy.id} enemy={enemy} gameTime={gameState.gameTime} />)}
      {gameState.playerBullets.map(bullet => <Projectile key={bullet.id} bullet={bullet} />)}
      {gameState.enemyBullets.map(bullet => <Projectile key={bullet.id} bullet={bullet} />)}
      {gameState.powerUps.map(powerUp => <PowerUpItem key={powerUp.id} powerUp={powerUp} />)}
      {!gameState.gameOver && <PlayerShip player={gameState.player} gameTime={gameState.gameTime} />}
      
      {activeExplosions}
      {activeFloatingTexts}
      {activeMuzzleFlashes}
      {activeParticles}

      {playerDamageFlashOpacity > 0 && (
        <div 
          className="absolute inset-0 bg-red-600 pointer-events-none z-40"
          style={{ opacity: playerDamageFlashOpacity, mixBlendMode: 'screen' }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
// Removed export default to use named export
// export default GameScreenComponent;