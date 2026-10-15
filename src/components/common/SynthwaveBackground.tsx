import React from "react";

export interface SynthwaveBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

export const SynthwaveBackground: React.FC<SynthwaveBackgroundProps> = ({
  className,
  style,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={style}
    >
      <defs>
        {/* Sky Gradient */}
        <linearGradient id="sky-grad-default" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0c0714" />
          <stop offset="45%" stopColor="#160924" />
          <stop offset="70%" stopColor="#260b38" />
          <stop offset="100%" stopColor="#460d4a" />
        </linearGradient>

        {/* Retro Sun Gradient */}
        <linearGradient id="sun-grad-default" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe600" />
          <stop offset="35%" stopColor="#ff7700" />
          <stop offset="75%" stopColor="#ff0066" />
          <stop offset="100%" stopColor="#b0006d" />
        </linearGradient>

        {/* Sun Glow / Halo (Perfect Smooth Circular Falloff) */}
        <radialGradient id="sun-halo-default" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff0066" stopOpacity="0.85" />
          <stop offset="30%" stopColor="#ff4400" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#ff0055" stopOpacity="0.2" />
          <stop offset="85%" stopColor="#b00055" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#0c0714" stopOpacity="0" />
        </radialGradient>

        {/* Horizon Atmospheric Glow */}
        <radialGradient id="horizon-glow-default" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ff3388" stopOpacity="0.65" />
          <stop offset="35%" stopColor="#ff1166" stopOpacity="0.3" />
          <stop offset="75%" stopColor="#800060" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#1a0429" stopOpacity="0" />
        </radialGradient>

        {/* Floor Deep Gradient Fade */}
        <linearGradient id="floor-grad-default" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a0529" />
          <stop offset="30%" stopColor="#12031c" />
          <stop offset="100%" stopColor="#07010a" />
        </linearGradient>

        {/* Sun Rim Glow Filter (Generous bounds to prevent rectangular clipping) */}
        <filter id="sun-rim-glow-default" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="grid-glow-default" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Sun Venetian Blinds Mask (Classic Synthwave Stripes, localized bounds) */}
        <mask id="sun-stripes-mask-default">
          <circle cx="960" cy="520" r="190" fill="#ffffff" />
          <g fill="#000000">
            <rect x="750" y="500" width="420" height="4" />
            <rect x="750" y="512" width="420" height="6" />
            <rect x="750" y="526" width="420" height="8" />
            <rect x="750" y="542" width="420" height="10" />
            <rect x="750" y="560" width="420" height="13" />
            <rect x="750" y="580" width="420" height="16" />
            <rect x="750" y="602" width="420" height="20" />
          </g>
        </mask>

        <style>{`
          @keyframes sunBreatheDef {
            0%, 100% { transform: scale(1); opacity: 0.96; }
            50% { transform: scale(1.02); opacity: 1; }
          }
          @keyframes haloPulseDef {
            0%, 100% { transform: scale(0.96); opacity: 0.75; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          @keyframes starBlinkDef {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.95; }
          }
          .sun-element-def {
            transform-origin: 960px 520px;
            animation: sunBreatheDef 6s ease-in-out infinite;
          }
          .halo-element-def {
            transform-origin: 960px 520px;
            animation: haloPulseDef 6s ease-in-out infinite;
          }
          .stars-layer-1-def { animation: starBlinkDef 4s ease-in-out infinite; }
          .stars-layer-2-def { animation: starBlinkDef 5.5s ease-in-out infinite 1.5s; }
          .stars-layer-3-def { animation: starBlinkDef 3.2s ease-in-out infinite 0.8s; }
        `}</style>
      </defs>

      {/* 1. NIGHT SKY BACKGROUND */}
      <rect x="0" y="0" width="1920" height="600" fill="url(#sky-grad-default)" />

      {/* 2. RETRO PIXEL STARS */}
      <g fill="#ffffff" className="stars-layer-1-def">
        <circle cx="120" cy="80" r="1.5" />
        <circle cx="340" cy="140" r="1.2" />
        <circle cx="520" cy="95" r="1.8" />
        <circle cx="780" cy="65" r="1" />
        <circle cx="1140" cy="85" r="1.6" />
        <circle cx="1380" cy="120" r="1.2" />
        <circle cx="1620" cy="70" r="1.8" />
        <circle cx="1810" cy="110" r="1" />
        <circle cx="260" cy="220" r="1.4" />
        <circle cx="890" cy="180" r="1.5" />
        <circle cx="1520" cy="210" r="1.3" />
        <circle cx="1740" cy="260" r="1.1" />
      </g>
      <g fill="#ff88bb" className="stars-layer-2-def">
        <circle cx="80" cy="190" r="1.2" />
        <circle cx="220" cy="110" r="1.5" />
        <circle cx="450" cy="200" r="1.1" />
        <circle cx="680" cy="130" r="1.7" />
        <circle cx="1020" cy="110" r="1.3" />
        <circle cx="1260" cy="170" r="1.5" />
        <circle cx="1460" cy="90" r="1.2" />
        <circle cx="1690" cy="160" r="1.6" />
        <circle cx="1860" cy="230" r="1.2" />
      </g>
      <g fill="#ffdd66" className="stars-layer-3-def">
        <circle cx="180" cy="270" r="1.2" />
        <circle cx="610" cy="230" r="1" />
        <circle cx="840" cy="240" r="1.4" />
        <circle cx="1190" cy="210" r="1.2" />
        <circle cx="1340" cy="250" r="1.1" />
        <circle cx="1780" cy="190" r="1.3" />
      </g>

      {/* 3. RETRO SYNTHWAVE SUN (CURATED ORIGINAL RETRO PALETTE) */}
      <circle className="halo-element-def" cx="960" cy="520" r="340" fill="url(#sun-halo-default)" />
      <g className="sun-element-def">
        <circle
          cx="960"
          cy="520"
          r="190"
          fill="url(#sun-grad-default)"
          mask="url(#sun-stripes-mask-default)"
          filter="url(#sun-rim-glow-default)"
        />
      </g>

      {/* 4. HORIZON ATMOSPHERIC GLOW */}
      <rect x="0" y="440" width="1920" height="240" fill="url(#horizon-glow-default)" pointerEvents="none" />
      <line x1="0" y1="600" x2="1920" y2="600" stroke="#ff2a85" strokeWidth="2.5" filter="url(#grid-glow-default)" />
      <line x1="0" y1="600" x2="1920" y2="600" stroke="#ffffff" strokeWidth="1" opacity="0.85" />

      {/* 5. PERSPECTIVE NEON WIREFRAME FLOOR */}
      <rect x="0" y="600" width="1920" height="480" fill="url(#floor-grad-default)" />

      {/* Perspective Radial Lines */}
      <g stroke="#ff0088" strokeWidth="1.6" filter="url(#grid-glow-default)" opacity="0.82">
        <line x1="960" y1="600" x2="960" y2="1080" strokeWidth="2" />
        <line x1="960" y1="600" x2="880" y2="1080" />
        <line x1="960" y1="600" x2="800" y2="1080" />
        <line x1="960" y1="600" x2="700" y2="1080" />
        <line x1="960" y1="600" x2="580" y2="1080" />
        <line x1="960" y1="600" x2="430" y2="1080" />
        <line x1="960" y1="600" x2="250" y2="1080" />
        <line x1="960" y1="600" x2="30" y2="1080" />
        <line x1="960" y1="600" x2="-220" y2="1080" />
        <line x1="960" y1="600" x2="-500" y2="1080" />
        <line x1="960" y1="600" x2="-850" y2="1080" />
        <line x1="960" y1="600" x2="1040" y2="1080" />
        <line x1="960" y1="600" x2="1120" y2="1080" />
        <line x1="960" y1="600" x2="1220" y2="1080" />
        <line x1="960" y1="600" x2="1340" y2="1080" />
        <line x1="960" y1="600" x2="1490" y2="1080" />
        <line x1="960" y1="600" x2="1670" y2="1080" />
        <line x1="960" y1="600" x2="1890" y2="1080" />
        <line x1="960" y1="600" x2="2140" y2="1080" />
        <line x1="960" y1="600" x2="2420" y2="1080" />
        <line x1="960" y1="600" x2="2770" y2="1080" />
      </g>

      {/* ALL Animated Perspective Horizontal Distance Lines (Continuous Forward Motion) */}
      <g stroke="#ff0088" filter="url(#grid-glow-default)">
        <line x1="0" x2="1920" y1="604.1" y2="604.1" strokeWidth="0.75" opacity="0.21">
          <animate attributeName="y1" from="604.1" to="605" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="604.1" to="605" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.75" to="0.75" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.21" to="0.21" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="605" y2="605" strokeWidth="0.75" opacity="0.21">
          <animate attributeName="y1" from="605" to="606.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="605" to="606.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.75" to="0.75" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.21" to="0.21" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="606.1" y2="606.1" strokeWidth="0.75" opacity="0.21">
          <animate attributeName="y1" from="606.1" to="607.4" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="606.1" to="607.4" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.75" to="0.76" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.21" to="0.21" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="607.4" y2="607.4" strokeWidth="0.76" opacity="0.21">
          <animate attributeName="y1" from="607.4" to="609.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="607.4" to="609.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.76" to="0.76" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.21" to="0.22" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="609.1" y2="609.1" strokeWidth="0.76" opacity="0.22">
          <animate attributeName="y1" from="609.1" to="611.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="609.1" to="611.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.76" to="0.77" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.22" to="0.22" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="611.1" y2="611.1" strokeWidth="0.77" opacity="0.22">
          <animate attributeName="y1" from="611.1" to="613.5" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="611.1" to="613.5" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.77" to="0.78" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.22" to="0.22" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="613.5" y2="613.5" strokeWidth="0.78" opacity="0.22">
          <animate attributeName="y1" from="613.5" to="616.4" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="613.5" to="616.4" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.78" to="0.79" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.22" to="0.23" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="616.4" y2="616.4" strokeWidth="0.79" opacity="0.23">
          <animate attributeName="y1" from="616.4" to="620.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="616.4" to="620.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.79" to="0.80" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.23" to="0.23" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="620.1" y2="620.1" strokeWidth="0.80" opacity="0.23">
          <animate attributeName="y1" from="620.1" to="624.5" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="620.1" to="624.5" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.80" to="0.82" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.23" to="0.24" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="624.5" y2="624.5" strokeWidth="0.82" opacity="0.24">
          <animate attributeName="y1" from="624.5" to="629.8" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="624.5" to="629.8" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.82" to="0.84" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.24" to="0.25" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="629.8" y2="629.8" strokeWidth="0.84" opacity="0.25">
          <animate attributeName="y1" from="629.8" to="636.4" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="629.8" to="636.4" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.84" to="0.86" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.25" to="0.26" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="636.4" y2="636.4" strokeWidth="0.86" opacity="0.26">
          <animate attributeName="y1" from="636.4" to="644.4" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="636.4" to="644.4" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.86" to="0.89" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.26" to="0.27" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="644.4" y2="644.4" strokeWidth="0.89" opacity="0.27">
          <animate attributeName="y1" from="644.4" to="654.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="644.4" to="654.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.89" to="0.93" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.27" to="0.29" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="654.1" y2="654.1" strokeWidth="0.93" opacity="0.29">
          <animate attributeName="y1" from="654.1" to="666" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="654.1" to="666" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.93" to="0.97" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.29" to="0.31" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="666" y2="666" strokeWidth="0.97" opacity="0.31">
          <animate attributeName="y1" from="666" to="680.5" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="666" to="680.5" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="0.97" to="1.03" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.31" to="0.33" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="680.5" y2="680.5" strokeWidth="1.03" opacity="0.33">
          <animate attributeName="y1" from="680.5" to="698.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="680.5" to="698.1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="1.03" to="1.09" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.33" to="0.36" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="698.1" y2="698.1" strokeWidth="1.09" opacity="0.36">
          <animate attributeName="y1" from="698.1" to="719.7" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="698.1" to="719.7" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="1.09" to="1.17" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.36" to="0.40" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="719.7" y2="719.7" strokeWidth="1.17" opacity="0.40">
          <animate attributeName="y1" from="719.7" to="745.9" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="719.7" to="745.9" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="1.17" to="1.27" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.40" to="0.44" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="745.9" y2="745.9" strokeWidth="1.27" opacity="0.44">
          <animate attributeName="y1" from="745.9" to="778" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="745.9" to="778" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="1.27" to="1.39" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.44" to="0.50" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="778" y2="778" strokeWidth="1.39" opacity="0.50">
          <animate attributeName="y1" from="778" to="817" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="778" to="817" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="1.39" to="1.54" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.50" to="0.56" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="817" y2="817" strokeWidth="1.54" opacity="0.56">
          <animate attributeName="y1" from="817" to="864.7" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="817" to="864.7" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="1.54" to="1.72" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.56" to="0.64" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="864.7" y2="864.7" strokeWidth="1.72" opacity="0.64">
          <animate attributeName="y1" from="864.7" to="922.8" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="864.7" to="922.8" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="1.72" to="1.96" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.64" to="0.74" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="922.8" y2="922.8" strokeWidth="1.96" opacity="0.74">
          <animate attributeName="y1" from="922.8" to="993.6" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="922.8" to="993.6" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="1.96" to="2.23" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.74" to="0.86" dur="1.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" x2="1920" y1="993.6" y2="993.6" strokeWidth="2.23" opacity="0.86">
          <animate attributeName="y1" from="993.6" to="1080" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="y2" from="993.6" to="1080" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" from="2.23" to="2.55" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.86" to="1.00" dur="1.8s" repeatCount="indefinite" />
        </line>
      </g>

      {/* 6. VIGNETTE OVERLAY */}
      <linearGradient id="vignette-default" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#050208" stopOpacity="0.45" />
        <stop offset="50%" stopColor="#000000" stopOpacity="0.0" />
        <stop offset="100%" stopColor="#040107" stopOpacity="0.75" />
      </linearGradient>
      <rect width="100%" height="100%" fill="url(#vignette-default)" pointerEvents="none" />
    </svg>
  );
};

export default SynthwaveBackground;
