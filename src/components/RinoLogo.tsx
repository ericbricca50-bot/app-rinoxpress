import React from 'react';

export interface RinoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'splash';
  showSlogan?: boolean;
  showLocation?: boolean;
  variant?: 'red' | 'white' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const RinoLogo: React.FC<RinoLogoProps> = ({
  size = 'md',
  showSlogan = false,
  showLocation = false,
  variant = 'red',
  className = '',
  onClick
}) => {
  // Dimension maps
  const sizeStyles = {
    xs: { iconW: 32, iconH: 38, textSize: 'text-xs', sloganSize: 'text-[9px]' },
    sm: { iconW: 44, iconH: 52, textSize: 'text-sm', sloganSize: 'text-[10px]' },
    md: { iconW: 56, iconH: 66, textSize: 'text-base', sloganSize: 'text-xs' },
    lg: { iconW: 80, iconH: 95, textSize: 'text-xl', sloganSize: 'text-sm' },
    xl: { iconW: 120, iconH: 142, textSize: 'text-2xl', sloganSize: 'text-base' },
    '2xl': { iconW: 160, iconH: 190, textSize: 'text-3xl', sloganSize: 'text-lg' },
    splash: { iconW: 200, iconH: 238, textSize: 'text-4xl', sloganSize: 'text-xl' }
  };

  const currentColor = variant === 'white' 
    ? '#FFFFFF' 
    : variant === 'dark' 
    ? '#111827' 
    : '#EE1D23'; // Official Rinoxpress Red

  const currentCutColor = variant === 'white' ? '#111827' : '#FFFFFF';

  const config = sizeStyles[size] || sizeStyles.md;

  return (
    <div 
      className={`inline-flex flex-col items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Official Rinoxpress Logo Symbol & Wordmark Graphic */}
      <svg
        width={config.iconW}
        height={config.iconH}
        viewBox="0 0 340 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200 hover:scale-[1.02] drop-shadow-sm"
      >
        <g fill={currentColor} stroke={currentColor}>
          {/* --- 1. TOP DIAMOND --- */}
          {/* Diamond outer frame */}
          <path
            d="M 120 40 L 220 40 L 256 74 L 170 120 L 84 74 Z"
            strokeWidth="11"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />

          {/* Table horizontal line */}
          <line x1="84" y1="74" x2="256" y2="74" strokeWidth="8" strokeLinecap="round" />

          {/* Top crown diagonals */}
          <line x1="120" y1="40" x2="134" y2="74" strokeWidth="8" strokeLinecap="round" />
          <line x1="220" y1="40" x2="206" y2="74" strokeWidth="8" strokeLinecap="round" />

          {/* Pavilion diagonals to bottom apex */}
          <line x1="134" y1="74" x2="170" y2="120" strokeWidth="8" strokeLinecap="round" />
          <line x1="206" y1="74" x2="170" y2="120" strokeWidth="8" strokeLinecap="round" />

          {/* --- 2. CIRCLE RING WITH RHINO --- */}
          {/* Upper Ring Arc (R=95, center at 170, 205) */}
          <path
            d="M 92 205 A 95 95 0 0 1 248 205"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />

          {/* Lower Ring Arc */}
          <path
            d="M 92 262 A 95 95 0 0 0 248 262"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />

          {/* --- 3. RHINO SILHOUETTE --- */}
          {/* Solid silhouette inside upper hemisphere facing right */}
          <path
            d="M 144 202
               C 140 197 142 190 146 186
               C 150 182 156 181 162 181
               C 166 177 172 176 178 177
               C 182 172 188 174 193 178
               C 198 179 204 182 208 188
               C 214 189 220 188 224 190
               C 220 192 215 194 212 195
               C 209 197 203 200 198 201
               C 193 202 188 201 185 202
               L 182 207
               L 176 207
               L 177 202
               L 166 202
               L 165 207
               L 160 207
               L 161 202
               L 153 202
               L 151 207
               L 146 207
               Z"
            fill={currentColor}
            stroke="none"
          />

          {/* Front Horn */}
          <path
            d="M 207 185 C 211 181 218 180 221 183 C 216 186 212 188 207 189 Z"
            fill={currentColor}
            stroke="none"
          />

          {/* Characteristic dual vertical body cuts (from the logo mark) */}
          <path
            d="M 162 183 L 163 202 M 167 183 L 168 202"
            stroke={currentCutColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* --- 4. BRAND WORDMARK: RINO XPRESS --- */}
          <text
            x="170"
            y="244"
            fontFamily="'Plus Jakarta Sans', Arial, Helvetica, sans-serif"
            fontSize="31"
            fontWeight="800"
            letterSpacing="2.5"
            textAnchor="middle"
            fill={currentColor}
            stroke="none"
          >
            RINO XPRESS
          </text>
        </g>
      </svg>

      {/* Slogan */}
      {showSlogan && (
        <p className={`font-semibold tracking-wide mt-2 text-[#4B5563] text-center ${config.sloganSize}`}>
          Aromas que dejan huella
        </p>
      )}

      {/* Optional Location */}
      {showLocation && (
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#EE1D23] mt-0.5">
          Córdoba • Argentina
        </span>
      )}
    </div>
  );
};
