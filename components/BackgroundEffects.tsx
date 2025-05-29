import React from 'react';
import type { Star } from '../types';
import { STAR_LAYER_SPECS, NEBULA_COLORS_PER_STAGE } from '../constants';

/** Props for the StarElement component. */
interface StarProps {
  /** The star object containing its properties (position, size, color, opacity). */
  star: Star;
}

/**
 * Renders a single star element for the parallax background.
 * Utilizes `React.memo` for performance optimization.
 * @param {StarProps} props - The properties for the StarElement component.
 * @returns {JSX.Element} The rendered star element.
 */
const StarElement: React.FC<StarProps> = React.memo(({ star }) => (
  <div
    className={`absolute rounded-full ${star.colorClass}`}
    style={{
      left: star.x,
      top: star.y,
      width: star.size,
      height: star.size,
      opacity: star.opacity,
      boxShadow: `0 0 ${star.size * 1.5}px ${star.size * 0.5}px ${star.colorClass.replace('bg-', 'shadow-')}/30`, // Dynamic shadow color based on star color
    }}
    aria-hidden="true" 
  />
));

/** Props for the ParallaxBackground component. */
interface ParallaxBackgroundProps {
  /** An array of star arrays, each representing a layer with different speeds/appearances. */
  starLayers: Star[][];
  /** The current game stage, used to select nebula colors dynamically. */
  currentStage: number; 
}

/**
 * Renders a multi-layered parallax starfield background with distant nebulae.
 * The nebula colors can change based on the current game stage, providing visual progression.
 * Utilizes `React.memo` for performance optimization.
 * @param {ParallaxBackgroundProps} props - The properties for the ParallaxBackground component.
 * @returns {JSX.Element} The rendered parallax background.
 */
export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = React.memo(({ starLayers, currentStage }) => {
  const nebulaColorIndex = Math.max(0, Math.min(currentStage - 1, NEBULA_COLORS_PER_STAGE.length - 1));
  const nebulaColorSet = NEBULA_COLORS_PER_STAGE[nebulaColorIndex] || NEBULA_COLORS_PER_STAGE[0];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Distant Nebula Effect */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-1000 ease-in-out"
        style={{
            background: `
              radial-gradient(circle at 15% 25%, ${nebulaColorSet.color1} 0%, transparent 30%), 
              radial-gradient(circle at 85% 65%, ${nebulaColorSet.color2} 0%, transparent 35%),
              radial-gradient(ellipse at 50% 50%, ${nebulaColorSet.color1} 0%, transparent 50%)
            `,
            mixBlendMode: 'screen', // 'screen' or 'overlay' can produce nice nebula effects
        }}
      />
      {/* Star Layers */}
      {starLayers.map((starsInLayer, layerIndex) => (
        <div key={`star-layer-${layerIndex}`} className="absolute inset-0">
          {starsInLayer.map((star) => (
            <StarElement key={star.id} star={star} />
          ))}
        </div>
      ))}
    </div>
  );
});