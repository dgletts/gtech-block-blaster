
import React from 'react';
import type { Player, Enemy, Bullet, PowerUp, Explosion, FloatingText, MuzzleFlash, BossState } from '../types';
import { EnemyType, PowerUpType, GamePhase } from '../types'; // GamePhase might not be used here but good for consistency
import {
    PLAYER_COLOR, PLAYER_HITBOX_COLOR, PLAYER_BULLET_COLOR, PLAYER_LASER_BEAM_COLOR, PLAYER_MUZZLE_FLASH_COLOR, PLAYER_ROLL_OPACITY, PLAYER_ROLL_TRAIL_COLOR, PLAYER_BULLET_CORE_COLOR,
    ENEMY_GRUNT_COLOR, ENEMY_BULLET_COLOR, ENEMY_MID_TIER_COLOR, ENEMY_MID_TIER_BULLET_COLOR, ENEMY_SWARM_MINION_COLOR, ENEMY_TELEPORTER_ELITE_COLOR, ENEMY_ELITE_BULLET_COLOR, ENEMY_SPLITTER_DRONE_COLOR, ENEMY_MINI_SPLITTER_COLOR, ENEMY_MINI_SPLITTER_BULLET_COLOR,
    BOSS_HIVE_OVERLORD_COLOR, BOSS_CORE_COLOR, BOSS_WEAPON_POD_COLOR, BOSS_CORE_HIT_FLASH_COLOR, BOSS_WEAPON_POD_HIT_FLASH_COLOR, BOSS_BULLET_COLOR, BOSS_LASER_COLOR,
    POWERUP_WEAPON_COLOR, POWERUP_BOMB_COLOR, POWERUP_SHIELD_COLOR, POWERUP_LASER_COLOR, POWERUP_SCORE_MULTIPLIER_COLOR,
    ENEMY_HIT_FLASH_COLOR, ENEMY_SPAWN_ANIMATION_DURATION, ENEMY_MUZZLE_FLASH_COLOR,
    FLOATING_TEXT_COLOR, FLOATING_TEXT_DURATION, FLOATING_TEXT_RISE_AMOUNT,
    PLAYER_THRUSTER_COLOR_1, PLAYER_THRUSTER_COLOR_2, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_IDLE_BOB_AMPLITUDE, PLAYER_IDLE_BOB_SPEED,
    MUZZLE_FLASH_DURATION, PLAYER_ROLL_DURATION, POWERUP_COLLECT_ANIM_DURATION, POWERUP_COLLECT_ANIM_SCALE,
    EXPLOSION_SHOCKWAVE_COLOR, EXPLOSION_SHOCKWAVE_DURATION, EXPLOSION_SHOCKWAVE_MAX_SCALE, ENEMY_SPLITTER_ANIM_DURATION,
    ENEMY_TELEPORTER_ELITE_PHASE_IN_DURATION, ENEMY_TELEPORTER_ELITE_PHASE_OUT_DURATION, BOSS_CORE_LASER_SWEEP_DURATION, GAME_HEIGHT
} from '../constants';

interface PlayerShipProps {
  player: Player;
  gameTime: number;
}

export const PlayerShip: React.FC<PlayerShipProps> = React.memo(({ player, gameTime }) => {
  const thrusterSize = PLAYER_WIDTH * 0.25;
  const thrusterBaseY = PLAYER_HEIGHT * 0.85;
  const thrusterToggle = Math.floor(gameTime / 100) % 2 === 0;

  const rollBaseTransform = player.isRolling ?
    `rotate(${ (player.rollTimer || 0) / PLAYER_ROLL_DURATION * 360 * (player.rollDirection === 'left' ? -1: 1)}deg) scale(0.9)` :
    'scale(1)';
  const rollOpacity = player.isRolling ? PLAYER_ROLL_OPACITY : (player.isInvincible ? 0.7 : 1);

  const idleBobOffset = player.isRolling ? 0 : Math.sin((player.idleBobTimer || 0) * PLAYER_IDLE_BOB_SPEED) * PLAYER_IDLE_BOB_AMPLITUDE;

  return (
    <div
      className={`absolute ${PLAYER_COLOR} ${player.isInvincible && !player.isRolling ? 'opacity-70 custom-pulse' : ''} rounded-sm shadow-lg shadow-cyan-500/50`}
      style={{
        left: player.x,
        top: player.y + idleBobOffset,
        width: player.width,
        height: player.height,
        transition: 'opacity 0.1s linear, transform 0.05s ease-out', 
        opacity: rollOpacity,
        transform: rollBaseTransform,
      }}
      role="img"
      aria-label="Player ship"
    >
      {player.isRolling && player.rollTimer && player.rollTimer > PLAYER_ROLL_DURATION * 0.2 && (
        <div
            className={`absolute ${PLAYER_ROLL_TRAIL_COLOR} rounded-sm`}
            style={{ inset: 0, transform: `translateX(${player.rollDirection === 'left' ? 7 : (player.rollDirection === 'right' ? -7 : 0)}px) translateY(${player.rollDirection === 'forward' ? 7 : 0}px) scale(0.95)`, opacity:0.7 }}
            aria-hidden="true"
        />
      )}
      <div
        className={`absolute ${PLAYER_HITBOX_COLOR} rounded-full`}
        style={{ width: player.width * 0.2, height: player.height * 0.2, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        aria-hidden="true"
      />
      <div
        className={`absolute ${thrusterToggle ? PLAYER_THRUSTER_COLOR_1 : PLAYER_THRUSTER_COLOR_2} rounded-b-sm`}
        style={{ width: thrusterSize, height: thrusterSize * (thrusterToggle ? 1.5 : 1.2), left: `calc(50% - ${thrusterSize * 1.1}px)`, top: thrusterBaseY, transformOrigin: 'top center', opacity: 0.8 }}
        aria-hidden="true"
      />
      <div
        className={`absolute ${!thrusterToggle ? PLAYER_THRUSTER_COLOR_1 : PLAYER_THRUSTER_COLOR_2} rounded-b-sm`}
        style={{ width: thrusterSize, height: thrusterSize * (!thrusterToggle ? 1.5 : 1.2), left: `calc(50% + ${thrusterSize * 0.1}px)`, top: thrusterBaseY, transformOrigin: 'top center', opacity: 0.8 }}
        aria-hidden="true"
      />
    </div>
  );
});

interface EnemyUnitProps {
  enemy: Enemy;
  gameTime: number;
}

export const EnemyUnit: React.FC<EnemyUnitProps> = React.memo(({ enemy, gameTime }) => {
  let baseColor = ENEMY_GRUNT_COLOR;
  let enemyClass = "rounded-sm";
  let shadowClass = "shadow-md shadow-rose-500/50";
  let content = null;
  let finalOpacity = 1;
  let transformParts: string[] = [];


  switch(enemy.type) {
    case EnemyType.GRUNT: baseColor = ENEMY_GRUNT_COLOR; enemyClass = "rounded-sm"; shadowClass = "shadow-md shadow-rose-500/50"; break;
    case EnemyType.MID_TIER: baseColor = ENEMY_MID_TIER_COLOR; enemyClass = "rounded-md border-2 border-purple-400"; shadowClass = "shadow-lg shadow-purple-500/50"; break;
    case EnemyType.SWARM_MINION: baseColor = ENEMY_SWARM_MINION_COLOR; enemyClass = "rounded-full"; shadowClass = "shadow-sm shadow-lime-500/50"; break;
    case EnemyType.TELEPORTER_ELITE:
      baseColor = ENEMY_TELEPORTER_ELITE_COLOR; enemyClass = "rounded-lg border-2 border-indigo-400"; shadowClass = "shadow-xl shadow-indigo-500/60";
      transformParts.push('skew-y-3');

      if (enemy.teleportState === 'phasing_in' || enemy.teleportState === 'phasing_out') {
        const phaseDuration = enemy.teleportState === 'phasing_in' ? ENEMY_TELEPORTER_ELITE_PHASE_IN_DURATION : ENEMY_TELEPORTER_ELITE_PHASE_OUT_DURATION;
        const currentTimer = Math.max(0, enemy.teleportTimer || 0);
        const phaseProgress = Math.min(1, 1 - (currentTimer / Math.max(1, phaseDuration)));
        finalOpacity = enemy.teleportState === 'phasing_in' ? phaseProgress : 1 - phaseProgress;
        transformParts = transformParts.filter(tp => !tp.startsWith('scale')); 
        transformParts.push(`scale(${enemy.teleportState === 'phasing_in' ? phaseProgress : 1 - phaseProgress})`);
        transformParts.push(`rotate(${phaseProgress * (enemy.teleportState === 'phasing_in' ? 180 : -180)}deg)`);
      } else if (enemy.teleportState === 'telegraphing') {
        enemyClass += ` border-4 ${Math.floor(gameTime / 100) % 2 === 0 ? 'border-pink-500' : 'border-fuchsia-600' }`;
      }
      break;
    case EnemyType.SPLITTER_DRONE:
      baseColor = ENEMY_SPLITTER_DRONE_COLOR; enemyClass = "border-2 border-teal-300"; shadowClass = "shadow-lg shadow-teal-500/50";
      if (enemy.isSplitting && enemy.splitAnimTimer) {
        const progress = Math.max(0, Math.min(1, 1 - (enemy.splitAnimTimer / ENEMY_SPLITTER_ANIM_DURATION)));
        transformParts = transformParts.filter(tp => !tp.startsWith('scale')); 
        transformParts.push(`scale(${1 + progress * 0.5})`); transformParts.push(`rotate(${progress * 90}deg)`); finalOpacity = 1 - progress;
      }
      break;
    case EnemyType.MINI_SPLITTER: baseColor = ENEMY_MINI_SPLITTER_COLOR; enemyClass = "border border-teal-200"; shadowClass = "shadow-md shadow-teal-400/50"; break;
    case EnemyType.BOSS_HIVE_OVERLORD:
        baseColor = BOSS_HIVE_OVERLORD_COLOR;
        enemyClass = "rounded-xl border-4 border-slate-500";
        shadowClass = "shadow-2xl shadow-slate-600/50";
        const bossEntityState = enemy as unknown as BossState;
        finalOpacity = (bossEntityState.hitFlashTimer && bossEntityState.hitFlashTimer > 0) ? 0.7 : 1;
        // Main boss body does not use spawnAnimationTimer for opacity/scale here
        break;
    case EnemyType.BOSS_CORE: baseColor = BOSS_CORE_COLOR; enemyClass = "rounded-full border-4 border-red-400 custom-pulse"; shadowClass = "shadow-xl shadow-red-500/70"; content = <div className="absolute inset-1 rounded-full bg-red-900 opacity-50 animate-ping"></div>; break;
    case EnemyType.BOSS_WEAPON_POD: baseColor = BOSS_WEAPON_POD_COLOR; enemyClass = "rounded-lg border-2 border-indigo-400"; shadowClass = "shadow-lg shadow-indigo-500/60"; content = <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1/3 h-1/4 bg-indigo-800 rounded-sm"></div>; break;
  }

  // Spawn animation, except for specific states or types
  if (enemy.spawnAnimationTimer && enemy.spawnAnimationTimer > 0 && 
      enemy.type !== EnemyType.TELEPORTER_ELITE && 
      !(enemy.type === EnemyType.SPLITTER_DRONE && enemy.isSplitting) &&
      !enemy.isBossPart && 
      enemy.type !== EnemyType.BOSS_HIVE_OVERLORD
  ) {
    const progress = Math.max(0, Math.min(1, 1 - (enemy.spawnAnimationTimer / ENEMY_SPAWN_ANIMATION_DURATION)));
    finalOpacity = progress;
    if (!transformParts.some(tp => tp.startsWith('scale'))) {
      transformParts.push(`scale(${0.5 + 0.5 * progress})`);
    }
  } else if (enemy.isBossPart && enemy.spawnAnimationTimer && enemy.spawnAnimationTimer > 0) {
    const progress = Math.max(0, Math.min(1, 1 - (enemy.spawnAnimationTimer / ENEMY_SPAWN_ANIMATION_DURATION)));
    finalOpacity = progress;
    if (!transformParts.some(tp => !tp.startsWith('scale'))) { // Check if scale is NOT already present
        transformParts = transformParts.filter(tp => !tp.startsWith('scale')); // Remove any existing scale
        transformParts.push(`scale(${0.5 + 0.5 * progress})`);
    }
  }


  if (transformParts.length === 0 || (transformParts.length === 1 && transformParts[0].startsWith('skew'))) {
    if (!transformParts.some(tp => tp.startsWith('scale'))) {
        transformParts.push('scale(1)');
    }
  }

  let displayColor = baseColor;
  if (enemy.hitFlashTimer && enemy.hitFlashTimer > 0) {
    if (enemy.type === EnemyType.BOSS_CORE) displayColor = BOSS_CORE_HIT_FLASH_COLOR;
    else if (enemy.type === EnemyType.BOSS_WEAPON_POD) displayColor = BOSS_WEAPON_POD_HIT_FLASH_COLOR;
    else if (enemy.type === EnemyType.BOSS_HIVE_OVERLORD) {
        const bossEntityForHitFlash = enemy as unknown as BossState;
        if (bossEntityForHitFlash.hitFlashTimer && bossEntityForHitFlash.hitFlashTimer > 0) {
             displayColor = ENEMY_HIT_FLASH_COLOR; 
        }
    } else displayColor = ENEMY_HIT_FLASH_COLOR;
  }

  const style: React.CSSProperties = {
    left: enemy.x,
    top: enemy.y,
    width: enemy.width,
    height: enemy.height,
    opacity: finalOpacity,
    transform: transformParts.join(' ') || 'scale(1)',
    zIndex: enemy.isBossPart || enemy.type === EnemyType.BOSS_HIVE_OVERLORD ? 1 : 0 
  };

  if (enemy.type === EnemyType.SPLITTER_DRONE || enemy.type === EnemyType.MINI_SPLITTER) {
    style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'; 
    enemyClass = `${enemyClass.replace(/rounded-(sm|md|lg|full)/g, '')} rounded-none`;
  }
  
  if (enemy.isBossPart || enemy.type === EnemyType.BOSS_HIVE_OVERLORD) {
      const healthToLog = enemy.type === EnemyType.BOSS_HIVE_OVERLORD ? (enemy as unknown as BossState).currentHealth : enemy.health;
      const spawnTmrToLog = enemy.type === EnemyType.BOSS_HIVE_OVERLORD ? 'N/A_Body' : (enemy.spawnAnimationTimer != null ? enemy.spawnAnimationTimer.toFixed(2) : 'UndefS');
      console.log(`DEBUG_RENDER: EnemyUnit ${enemy.id} (Type: ${enemy.type}, BossPart: ${enemy.isBossPart ? enemy.partType : 'N/A'}): X=${enemy.x.toFixed(2)}, Y=${enemy.y.toFixed(2)}, Opacity=${finalOpacity.toFixed(2)}, Transform='${style.transform}', Health=${healthToLog !== undefined ? healthToLog : 'UndefH'}, SpawnTmr=${spawnTmrToLog}`);
  }

  return (
    <div className={`absolute ${displayColor} ${enemyClass} ${shadowClass}`} style={style} role="img" aria-label={`Enemy ${enemy.type}`}>
      {content}
    </div>
  );
});

interface ProjectileProps {
  bullet: Bullet;
}
export const Projectile: React.FC<ProjectileProps> = React.memo(({ bullet }) => {
  const isPlayer = bullet.isPlayerBullet;
  let color = isPlayer ? PLAYER_BULLET_COLOR : ENEMY_BULLET_COLOR;
  if (!isPlayer) {
    if (bullet.type === EnemyType.MID_TIER) color = ENEMY_MID_TIER_BULLET_COLOR;
    else if (bullet.type === EnemyType.TELEPORTER_ELITE || bullet.isEliteVisual) color = ENEMY_ELITE_BULLET_COLOR;
    else if (bullet.type === EnemyType.MINI_SPLITTER) color = ENEMY_MINI_SPLITTER_BULLET_COLOR;
    else if (bullet.type === EnemyType.BOSS_CORE || bullet.type === EnemyType.BOSS_WEAPON_POD) color = BOSS_BULLET_COLOR;
  }
  const shadow = isPlayer ? "shadow-cyan-400/70" : (bullet.isFast || bullet.isEliteVisual ? "shadow-fuchsia-400/80" : (bullet.type === EnemyType.MINI_SPLITTER ? "shadow-cyan-500/70" : (bullet.type === EnemyType.BOSS_CORE || bullet.type === EnemyType.BOSS_WEAPON_POD ? "shadow-purple-400/80" : "shadow-amber-400/70")));
  const glowClass = isPlayer ? "shadow-[0_0_8px_1px_rgba(0,255,255,0.7)]" : (bullet.isFast || bullet.isEliteVisual ? "shadow-[0_0_10px_2px_rgba(255,0,255,0.8)]" : (bullet.type === EnemyType.MINI_SPLITTER ? "shadow-[0_0_8px_1px_rgba(0,200,200,0.7)]" : (bullet.type === EnemyType.BOSS_CORE || bullet.type === EnemyType.BOSS_WEAPON_POD ? "shadow-[0_0_10px_2px_rgba(160,30,200,0.8)]" : "shadow-[0_0_8px_1px_rgba(255,165,0,0.6)]")));
  const bulletShapeClass = (bullet.isFast || bullet.isEliteVisual || bullet.type === EnemyType.BOSS_CORE || bullet.type === EnemyType.BOSS_WEAPON_POD) ? 'rounded-sm' : 'rounded-xs';

  return (
    <div className={`absolute ${color} ${bulletShapeClass} ${shadow} ${glowClass}`} style={{ left: bullet.x, top: bullet.y, width: bullet.width, height: bullet.height }} role="img" aria-label={isPlayer ? "Player bullet" : "Enemy bullet"}>
      {isPlayer && bullet.hasCore && (<div className={`absolute ${PLAYER_BULLET_CORE_COLOR} rounded-full`} style={{ width: '50%', height: '20%', left: '25%', top: '40%', opacity: 0.8 }} aria-hidden="true"/>)}
      {bullet.isEliteVisual && !isPlayer && (<div className={`absolute bg-white rounded-full`} style={{ width: '40%', height: '40%', left: '30%', top: '30%', opacity: 0.7 }} aria-hidden="true"/>)}
    </div>
  );
});

interface MuzzleFlashEffectProps {
  flash: MuzzleFlash;
}
export const MuzzleFlashEffect: React.FC<MuzzleFlashEffectProps> = React.memo(({ flash }) => {
  const progress = 1 - (flash.lifeTimer / MUZZLE_FLASH_DURATION);
  const opacity = Math.max(0, 1 - progress * progress);
  const scale = 1 + progress * 0.5;
  const color = flash.isPlayerFlash ? PLAYER_MUZZLE_FLASH_COLOR : ENEMY_MUZZLE_FLASH_COLOR;
  return <div className={`absolute ${color} rounded-full pointer-events-none`} style={{ left: flash.x - (flash.size * scale) / 2, top: flash.y - (flash.size * scale) / 2, width: flash.size * scale, height: flash.size * scale, opacity: opacity, transform: `rotate(${flash.rotation}deg) scale(${scale})`, mixBlendMode: 'screen' }} aria-hidden="true"/>;
});

interface LaserBeamEffectProps {
  player: Player;
  gameHeight: number;
}
export const LaserBeamEffect: React.FC<LaserBeamEffectProps> = React.memo(({ player, gameHeight }) => {
  if (!player.isLaserActive || !player.laserTimer || player.laserTimer <= 0) return null;
  const beamWidth = PLAYER_WIDTH * 0.8; const beamX = player.x + (player.width / 2) - (beamWidth / 2);
  return <div className={`absolute ${PLAYER_LASER_BEAM_COLOR} opacity-80 rounded-t-lg`} style={{ left: beamX, top: 0, width: beamWidth, height: player.y, boxShadow: `0 0 15px 5px rgba(255,0,0,0.7), inset 0 0 10px rgba(255,255,100,0.5)`, mixBlendMode: 'screen' }} aria-hidden="true"/>;
});

interface PowerUpItemProps {
  powerUp: PowerUp;
}
export const PowerUpItem: React.FC<PowerUpItemProps> = React.memo(({ powerUp }) => {
  let color = ''; let symbol = ''; let shadow = ''; let baseShapeClass = 'rounded-md';
  switch (powerUp.type) {
    case PowerUpType.WEAPON_UPGRADE: color = POWERUP_WEAPON_COLOR; symbol = 'W'; shadow = 'shadow-emerald-500/50'; baseShapeClass = 'rounded-md'; break;
    case PowerUpType.BOMB_CHARGE: color = POWERUP_BOMB_COLOR; symbol = 'B'; shadow = 'shadow-orange-500/50'; baseShapeClass = 'rounded-full'; break;
    case PowerUpType.SHIELD: color = POWERUP_SHIELD_COLOR; symbol = 'S'; shadow = 'shadow-violet-500/50'; baseShapeClass = 'rounded-sm'; break;
    case PowerUpType.LASER_BEAM: color = POWERUP_LASER_COLOR; symbol = 'L'; shadow = 'shadow-yellow-500/50'; baseShapeClass = 'rounded-sm'; break;
    case PowerUpType.SCORE_MULTIPLIER: color = POWERUP_SCORE_MULTIPLIER_COLOR; symbol = 'x2'; shadow = 'shadow-pink-500/50'; baseShapeClass = 'rounded-full'; break;
  }
  const style: React.CSSProperties = {
    left: powerUp.x,
    top: powerUp.y,
    width: powerUp.width,
    height: powerUp.height,
    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out' 
  };
  if (powerUp.isCollected && powerUp.collectAnimationTimer) {
    const progress = 1 - (powerUp.collectAnimationTimer / POWERUP_COLLECT_ANIM_DURATION);
    style.transform = `scale(${1 + progress * (POWERUP_COLLECT_ANIM_SCALE - 1)})`; style.opacity = 1 - progress;
  }
  let textSymbolStyle: React.CSSProperties = { fontSize: '0.8rem', lineHeight: '1' };
  if (powerUp.type === PowerUpType.SCORE_MULTIPLIER) textSymbolStyle.fontSize = '0.7rem';
  return <div className={`absolute ${color} ${baseShapeClass} flex items-center justify-center custom-pulse shadow-lg ${shadow} overflow-hidden`} style={style} role="button" aria-label={`Power-up: ${powerUp.type}`}><span className="text-white font-bold" style={textSymbolStyle}>{symbol}</span></div>;
});

interface ExplosionEffectProps {
  explosion: Explosion;
}
export const ExplosionEffect: React.FC<ExplosionEffectProps> = React.memo(({ explosion }) => {
  const progress = Math.min(1, explosion.elapsed / explosion.duration);
  const currentSize = explosion.size * progress; const opacity = 1 - progress * progress;
  const coreSize = currentSize * 0.4; const coreOpacity = opacity * 0.8;
  const outerBlastSize = currentSize; const outerBlastOpacity = opacity * 0.5;
  let shockwaveElement = null;
  if (explosion.hasShockwave) {
    const shockwaveProgress = Math.min(1, explosion.elapsed / EXPLOSION_SHOCKWAVE_DURATION);
    const shockwaveScale = 1 + shockwaveProgress * (EXPLOSION_SHOCKWAVE_MAX_SCALE - 1);
    const shockwaveOpacity = 0.5 * (1 - shockwaveProgress * shockwaveProgress);
    shockwaveElement = (<div className="absolute rounded-full border-2" style={{ left: explosion.x - (explosion.size * shockwaveScale) / 2, top: explosion.y - (explosion.size * shockwaveScale) / 2, width: explosion.size * shockwaveScale, height: explosion.size * shockwaveScale, borderColor: EXPLOSION_SHOCKWAVE_COLOR, opacity: shockwaveOpacity, mixBlendMode: 'screen' }} aria-hidden="true"/>);
  }
  return (
    <div className="absolute pointer-events-none" style={{ left: 0, top: 0 }} aria-hidden="true">
      <div className={`absolute ${explosion.color} rounded-full blur-[3px]`} style={{ left: explosion.x - outerBlastSize / 2, top: explosion.y - outerBlastSize / 2, width: outerBlastSize, height: outerBlastSize, opacity: outerBlastOpacity, transform: `scale(${progress})` }}/>
      <div className={`absolute bg-white rounded-full`} style={{ left: explosion.x - coreSize / 2, top: explosion.y - coreSize / 2, width: coreSize, height: coreSize, opacity: coreOpacity, transform: `scale(${progress * 0.8})`, mixBlendMode: 'screen' }}/>
      {shockwaveElement}
    </div>
  );
});

interface FloatingTextEffectProps {
  floatingText: FloatingText;
}
export const FloatingTextEffect: React.FC<FloatingTextEffectProps> = React.memo(({ floatingText }) => {
  const baseDuration = floatingText.isHuge ? FLOATING_TEXT_DURATION * 1.5 : (floatingText.isLarge ? FLOATING_TEXT_DURATION * 1.2 : FLOATING_TEXT_DURATION);
  const lifeTimer = floatingText.lifeTimer || baseDuration;
  const lifeProgress = Math.max(0, lifeTimer / baseDuration);
  const opacity = Math.sin(lifeProgress * Math.PI); 
  const riseAmount = floatingText.isHuge ? FLOATING_TEXT_RISE_AMOUNT * 1.5 : FLOATING_TEXT_RISE_AMOUNT;
  const rise = (1 - lifeProgress) * riseAmount;
  let textSizeClass = 'text-lg';
  if (floatingText.isLarge) textSizeClass = 'text-2xl';
  if (floatingText.isHuge) textSizeClass = 'text-4xl font-bold';
  return <div className={`absolute pointer-events-none font-bold ${textSizeClass}`} style={{ left: floatingText.x, top: floatingText.initialY - rise, color: floatingText.color, opacity: opacity, textShadow: `1px 1px 3px rgba(0,0,0,0.7)`, transition: 'top 0.05s linear, opacity 0.05s linear' }} aria-hidden="true">{floatingText.text}</div>;
});

interface BossLaserSweepEffectProps {
  bossState?: BossState; 
  corePart?: Enemy; 
}

export const BossLaserSweepEffect: React.FC<BossLaserSweepEffectProps> = React.memo(({ bossState, corePart }) => {
  if (!bossState || !bossState.isLaserSweeping || !corePart || !bossState.laserSweepTimer || bossState.laserSweepTimer <= 0) {
    return null;
  }

  const laserOriginX = corePart.x + corePart.width / 2;
  const laserOriginY = corePart.y + corePart.height / 2;
  const laserLength = GAME_HEIGHT * 1.2; // Ensure it covers the screen
  
  // Ensure laserSweepAngle is defined before using it
  const currentLaserAngle = bossState.laserSweepAngle !== undefined ? bossState.laserSweepAngle : Math.PI / 2; // Default to pointing down if undefined
  const laserAngleDegrees = currentLaserAngle * (180 / Math.PI) - 90; // Convert to degrees and adjust for CSS 0 = right

  const beamProgress = bossState.laserSweepTimer / BOSS_CORE_LASER_SWEEP_DURATION;
  const beamOpacity = 0.4 + Math.sin(beamProgress * Math.PI) * 0.5; 
  const beamWidth = 15 + Math.sin(beamProgress * Math.PI) * 10; 

  // Telegraph effect
  let telegraphElement = null;
  if (bossState.laserTelegraphTimer && bossState.laserTelegraphTimer > 0) {
    const telegraphProgress = bossState.laserTelegraphTimer / 1000; // Assuming 1s telegraph
    const telegraphOpacity = 0.2 + Math.sin(telegraphProgress * Math.PI) * 0.3;
    telegraphElement = (
        <div
            className={`absolute ${BOSS_LASER_COLOR} pointer-events-none`}
            style={{
                left: laserOriginX,
                top: laserOriginY,
                width: beamWidth * 0.5, // Thinner telegraph line
                height: laserLength,
                opacity: telegraphOpacity,
                transformOrigin: 'top center',
                transform: `rotate(${laserAngleDegrees}deg) translateY(-${(beamWidth * 0.5)/2}px)`,
                borderRadius: '2px',
                filter: 'blur(2px)',
            }}
            aria-hidden="true"
        />
    );
  }


  return (
    <>
      {telegraphElement}
      {bossState.isLaserSweeping && bossState.laserSweepTimer > 0 && (
         <div
          className={`absolute ${BOSS_LASER_COLOR} pointer-events-none`}
          style={{
            left: laserOriginX,
            top: laserOriginY,
            width: beamWidth,
            height: laserLength,
            opacity: beamOpacity,
            transformOrigin: 'top center',
            transform: `rotate(${laserAngleDegrees}deg) translateY(-${beamWidth/2}px)`,
            borderRadius: '5px',
            boxShadow: `0 0 20px 10px ${BOSS_LASER_COLOR}90, inset 0 0 8px ${BOSS_LASER_COLOR}50`, // Enhanced glow
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
});
