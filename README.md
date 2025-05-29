
# gTech Block Blaster

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Pilot your starfighter in gTech Block Blaster! A fast-paced, vertical-scrolling bullet-hell shooter. Annihilate alien invaders, conquer stages, and top the leaderboard.**

![gTech Block Blaster Gameplay Screenshot/GIF](https://via.placeholder.com/600x400.png?text=Gameplay+Screenshot+Here)
*(Replace placeholder image with an actual screenshot or GIF of the game)*

## Table of Contents

*   [🚀 Game Overview](#-game-overview)
    *   [Concept](#concept)
    *   [Gameplay Loop](#gameplay-loop)
    *   [Key Features](#key-features)
*   [🎮 Core Systems & Mechanics](#-core-systems--mechanics)
    *   [Player Controls & Abilities](#player-controls--abilities)
    *   [Enemy Types & Behaviors](#enemy-types--behaviors)
    *   [Combat & Weapons](#combat--weapons)
    *   [Power-ups](#power-ups)
    *   [Scoring & Progression](#scoring--progression)
    *   [Game Flow (Stages, Challenges, Boss)](#game-flow-stages-challenges-boss)
    *   [Visuals & Effects](#visuals--effects)
    *   [UI & HUD](#ui--hud)
    *   [Leaderboard & Settings](#leaderboard--settings)
*   [🔧 Technical Stack](#-technical-stack)
*   [🛠️ Getting Started & Deployment](#️-getting-started--deployment)
    *   [Prerequisites](#prerequisites)
    *   [Running Locally](#running-locally)
    *   [Deployment](#deployment)
*   [✨ Future Enhancements (Ideas)](#-future-enhancements-ideas)
*   [🤝 Contributing](#-contributing)
*   [📄 License](#-license)

## 🚀 Game Overview

### Concept

gTech Block Blaster is a modern take on classic arcade vertical-scrolling shooters. Players take control of an advanced starfighter, battling hordes of alien enemies, dodging intense bullet patterns, and collecting powerful upgrades to survive and achieve the highest score.

### Gameplay Loop

1.  **Navigate:** Control the player's starfighter through waves of enemies.
2.  **Shoot & Destroy:** Annihilate diverse alien invaders with upgradable weaponry.
3.  **Dodge:** Evade enemy projectiles and hazardous attack patterns.
4.  **Power-Up:** Collect various power-ups to enhance firepower, defense, and scoring potential.
5.  **Progress:** Advance through increasingly challenging stages, each culminating in intense encounters.
6.  **Conquer:** Face formidable challenge waves and a multi-stage boss battle.
7.  **Achieve:** Aim for the highest score and secure a coveted spot on the local leaderboard.

### Key Features

*   **Dynamic Enemy Roster:** Encounter a variety of enemies, each with unique movement, attack patterns, and resilience.
*   **Powerful Upgrades:** Collect distinct power-ups including weapon enhancements, devastating bombs, protective shields, a high-damage laser beam, and score multipliers.
*   **Structured Progression:** Battle through multiple stages, face intense pre-boss "Challenge Waves," and confront a formidable multi-part end-stage Boss.
*   **Immersive Visuals:** Experience a retro-inspired aesthetic brought to life with a dynamic parallax starfield, vibrant nebula effects that change per stage, and impactful particle effects.
*   **Advanced Player Abilities:** Master rapid-fire shooting, screen-clearing bombs, and a tactical dodge/roll maneuver for temporary invincibility and quick repositioning.
*   **Persistent High Scores:** Compete for glory on the local leaderboard, saving your best achievements.
*   **Rich Special Effects:** Witness dazzling explosions, satisfying muzzle flashes, impactful screen shakes, and clear visual feedback for game events.

## 🎮 Core Systems & Mechanics

### Player Controls & Abilities

*   **Movement:** Arrow Keys / WASD.
*   **Shoot:** Spacebar (Hold for continuous fire).
*   **Bomb:** Q key (Limited stock, clears enemy bullets and damages all enemies).
*   **Dodge/Roll:** Shift key (Provides brief invincibility and a quick dash. Directional based on last movement input. Has a cooldown).

**Player Stats & Mechanics:**
*   **Lives:** Starts with `PLAYER_INITIAL_LIVES`. Game over when lives reach zero.
*   **Bombs:** Starts with `PLAYER_INITIAL_BOMBS`. Replenished via power-ups.
*   **Weapon Level:** Starts at 1, upgradable to `POWERUP_WEAPON_MAX_LEVEL` via power-ups, increasing bullet count and spread.
*   **Invincibility:** Temporary immunity to damage, triggered by:
    *   Taking a hit (`PLAYER_INVINCIBILITY_DURATION`).
    *   Performing a dodge/roll (`PLAYER_ROLL_DURATION`).
    *   Collecting a Shield power-up.
*   **Laser Beam:** A temporary, powerful continuous beam weapon activated by a power-up (`POWERUP_LASER_BEAM_DURATION`).
*   **Damage Sparks:** Visual indicator when the player is down to their last life.
*   **Idle Bob & Thrusters:** Subtle visual animations for the player ship.

### Enemy Types & Behaviors

The game features a diverse cast of alien adversaries:

*   **Grunt:** Basic enemy, moves downwards, fires single shots.
*   **Mid-Tier:** More resilient, fires volleys and a spread shot special attack.
*   **Swarm Minion:** Appears in groups, follows an oscillating path while descending.
*   **Teleporter Elite:** Phases in and out of combat, telegraphs and fires aimed, fast projectiles.
*   **Splitter Drone:** Upon destruction, splits into several `Mini-Splitter` enemies.
*   **Mini-Splitter:** Smaller, faster remnants of a Splitter Drone, fires single shots.
*   **Boss (Hive Overlord):** A large, multi-part boss with distinct attack phases.
    *   **Main Body:** The primary target once sub-components are dealt with.
    *   **Core:** A vulnerable central part.
    *   **Weapon Pods:** Destructible side turrets that fire projectiles.

Enemies have varying health, movement speeds, firing patterns (`ENEMY_*_FIRE_COOLDOWN`), and point values. Spawning logic becomes more complex as stages progress. Enemies flash white (`ENEMY_HIT_FLASH_DURATION`) when damaged.

### Combat & Weapons

*   **Player Bullets:** Fast-moving projectiles. Damage and configuration change with `weaponLevel`. Visual core element for enhanced visibility.
*   **Enemy Bullets:** Vary in appearance, speed (`ENEMY_BULLET_SPEED`, `ENEMY_ELITE_BULLET_SPEED`), and damage based on the firing enemy.
*   **Damage Model:** Projectiles reduce the health of their targets. Player loses a life when health (implicitly 1 per hit) is depleted. Enemies are destroyed when their health reaches zero.
*   **Hit Detection:** Based on 2D bounding box collisions between game objects.
*   **Muzzle Flashes:** Visual feedback (`MUZZLE_FLASH_DURATION`) for player and enemy weapon fire.

### Power-ups

Collectibles dropped by defeated enemies that provide temporary advantages:

*   **Weapon Upgrade (W):** Increases player's `weaponLevel`, enhancing firepower.
*   **Bomb Charge (B):** Adds one bomb to the player's stock.
*   **Shield (S):** Grants temporary invincibility.
*   **Laser Beam (L):** Activates a powerful, continuous laser weapon for a short duration.
*   **Score Multiplier (x2):** Doubles points earned from all sources for `POWERUP_SCORE_MULTIPLIER_DURATION`.

Power-ups descend the screen and are attracted to the player (`POWERUP_ATTRACT_RADIUS`, `POWERUP_ATTRACT_SPEED`) after a short delay. Drop chances (`POWERUP_DROP_CHANCE_*`) vary per enemy type.

### Scoring & Progression

*   **Base Points:** Awarded for destroying each enemy type (`ENEMY_*_POINTS`).
*   **Score Multiplier:** Active via the 'x2' power-up, doubling all points earned.
*   **Chain Kills:** Rapidly defeating enemies within `CHAIN_KILL_WINDOW_DURATION` builds a combo, awarding bonus points (`CHAIN_KILL_BONUS_PER_KILL`) multiplied by the chain count.
*   **Perfect Stage Bonus:** A significant point reward (`PERFECT_STAGE_BONUS`) for completing a stage without taking any damage.

### Game Flow (Stages, Challenges, Boss)

*   **Stages:** The game progresses through numbered stages. Enemy difficulty and density increase with each stage.
*   **Kill Quotas:** Players must defeat a target number of enemies (`KILLS_PER_STAGE`) to advance the stage's objective.
*   **Challenge Waves:** Upon meeting the kill quota (before the boss stage), a "Challenge Wave" is triggered. This is a pre-defined, intense wave of enemies (`CHALLENGE_WAVES`) that must be cleared.
*   **Boss Battle:** Stage `BOSS_STAGE_TRIGGER` features the Hive Overlord boss. The boss has multiple attack patterns, destructible parts (Weapon Pods, Core), and phases. Defeating the boss clears the stage and awards a large point bonus.
*   **Game Over:** Occurs when the player loses all lives. The final score is then eligible for the leaderboard.

### Visuals & Effects

*   **Parallax Background:** A multi-layered starfield scrolls downwards, creating a sense of depth. Nebula colors (`NEBULA_COLORS_PER_STAGE`) change with each stage, providing visual variety.
*   **Explosions:** Dynamic and varied explosions (`EXPLOSION_DURATION`, `EXPLOSION_MAX_SIZE`) for player death, enemy destruction, and boss parts. Includes particle debris and shockwave effects.
*   **Particles:** Used extensively for bullet impacts, power-up collection bursts, player thrusters, player damage sparks, and teleportation effects.
*   **Muzzle Flashes:** Bright flashes at weapon barrels upon firing.
*   **Screen Shake:** Adds impact to major events like bomb explosions, player taking hits, and boss attacks (`SCREEN_SHAKE_*` constants).
*   **Floating Text:** Displays score pop-ups, combo counters, and power-up messages (e.g., "PERFECT!", "COMBO x5", "+WPN LVL 2").
*   **Player Damage Flash:** A brief, full-screen red overlay (`PLAYER_DAMAGE_FLASH_DURATION`) when the player takes damage.

### UI & HUD

The Heads-Up Display (HUD) provides critical game information:

*   **Score:** Current player score (animates up to the true score).
*   **Lives:** Remaining player lives.
*   **Bombs:** Remaining player bombs.
*   **Stage:** Current stage number.
*   **WPN Level:** Current player weapon power level.
*   **Roll Cooldown:** Visual indicator for the dodge/roll ability's readiness.
*   **Stage Progress Bar:** Shows progress towards the current stage's kill quota (visible during normal play before challenge/boss).
*   **Boss Health Bar:** Displays the current health of the active boss.
*   **Stage Transition Messages:** Full-screen animated text for "STAGE X", "WARNING!", "VICTORY!", etc.

### Leaderboard & Settings

*   **Leaderboard:** High scores are saved locally in the browser's `localStorage`. The top `MAX_LEADERBOARD_ENTRIES` scores (name, score, date) are displayed.
*   **Settings:** Players can toggle Sound Effects and Music via the Options screen. (Note: Audio playback functionality is not fully implemented in the current demo version). Settings are managed globally via React Context.

## 🔧 Technical Stack

*   **Language:** TypeScript
*   **Framework/Library:** React (using functional components and hooks)
*   **Styling:** Tailwind CSS (utility-first CSS framework)
*   **Module System:** Native ES Modules, with dependencies (React, ReactDOM) loaded via `esm.sh` CDN through an import map in `index.html`.
*   **Game Loop:** `requestAnimationFrame` for smooth animations and game updates.
*   **State Management:** Primarily React's `useState`, `useRef`, and Context API for global settings.

## 🛠️ Getting Started & Deployment

### Prerequisites

*   A modern web browser that supports ES Modules and Import Maps (e.g., Chrome, Firefox, Edge, Safari).
*   (Optional) Node.js and npm/yarn if you plan to use a local development server or introduce build tools.

### Running Locally

This project is designed to be simple to run:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gtech-block-blaster.git
    cd gtech-block-blaster
    ```
2.  **Open `index.html`:**
    *   The easiest way is to directly open the `index.html` file in your web browser.
3.  **(Optional) Use a simple HTTP server:**
    *   For a more robust local development experience (e.g., to avoid potential issues with file path resolving or to prepare for future tooling), you can use a lightweight HTTP server.
    *   If you have Node.js installed, you can use `npx serve`:
        ```bash
        npx serve .
        ```
        Then open the provided URL (usually `http://localhost:3000`) in your browser.
    *   Alternatively, if you have Python installed:
        ```bash
        python -m http.server
        ```
        Then open `http://localhost:8000` in your browser.

No build step (like Webpack or Vite) is currently configured or required due to the direct use of ES Modules and `esm.sh`.

### Deployment

Since gTech Block Blaster is a static web application, deploying it is straightforward:

1.  **Gather Files:** All necessary files are already in the project directory. These include:
    *   `index.html`
    *   `index.tsx`
    *   `types.ts`
    *   `constants.ts`
    *   `metadata.json`
    *   The `components/` directory
    *   The `screens/` directory
    *   The `services/` directory
2.  **Host Statically:** Upload all these files and directories to any static web hosting provider. Popular free/easy options include:
    *   **GitHub Pages:** Host directly from your GitHub repository.
    *   **Netlify:** Drag and drop your project folder or link your Git repository.
    *   **Vercel:** Similar to Netlify, excellent for frontend projects.
    *   **AWS S3:** Configure an S3 bucket for static website hosting.
    *   Other cloud providers (Azure Static Web Apps, Google Cloud Storage) also offer similar services.

Ensure the file structure is maintained on the server as it is in the project. The `index.html` file will be the entry point.

## ✨ Future Enhancements (Ideas)

This game has a solid foundation, and here are some ideas for future expansion:

*   **Audio Integration:** Implement actual sound effects for shooting, explosions, power-ups, hits, UI interactions, and background music themes per stage/boss.
*   **More Content:**
    *   Additional enemy types with more complex behaviors and attack patterns.
    *   New power-ups (e.g., homing missiles, drones, temporary firerate boost).
    *   More diverse boss battles with unique mechanics.
    *   Environmental hazards or interactive stage elements.
*   **Expanded Player Abilities:** Introduce new mechanics like a charged shot, a temporary defensive barrier, or alternate weapon modes.
*   **Online Leaderboard:** Implement a backend service to store and retrieve high scores globally.
*   **Gamepad Support:** Add controls for gamepads.
*   **Story Mode:** Introduce narrative elements, character interactions, or animated cutscenes between stages.
*   **Visual Polish:** Further enhance animations, add more detailed sprites, or introduce more complex particle systems.
*   **Difficulty Levels:** Allow players to choose a difficulty setting.
*   **Mobile Responsiveness:** Adapt UI and controls for touch devices (though this is primarily a desktop-style game).

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to gTech Block Blaster, please follow these general steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:
    `git checkout -b feature/your-feature-name` or `bugfix/issue-description`.
3.  **Make your changes.** Ensure your code is clean, well-commented, and follows the existing project structure.
4.  **Test your changes thoroughly.**
5.  **Commit your changes** with a clear and descriptive commit message.
6.  **Push your branch** to your forked repository.
7.  **Open a Pull Request** to the main repository, detailing the changes you've made.

Please ensure any new features or significant changes are discussed via issues first.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details (you would create this file with the MIT license text).
(Currently, no LICENSE.md file is present. If you wish to use MIT, you can add one.)

---

Happy Blasting! 🚀
