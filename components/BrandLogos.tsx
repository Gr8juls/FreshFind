import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'color' | 'monochrome' | 'white';
}

/**
 * Official FreshFind Logo (Concept A: Discovery Monogram)
 * - Interlocking Double-F Architecture
 * - Rescue Carryout Tote Silhouette with Top Handle
 * - Discovery Pin / Compass Beacon Centerpiece
 * - Tagline: "Connecting Food. Saving Money. Reducing Waste."
 */
export function FreshFindLogo({ className = "w-10 h-10", variant = 'color' }: LogoProps) {
  const primaryEmerald = variant === 'monochrome' ? 'currentColor' : variant === 'white' ? '#FFFFFF' : '#10B981';
  const deepForest = variant === 'monochrome' ? 'currentColor' : variant === 'white' ? '#CBD5E1' : '#047857';
  const beaconColor = variant === 'monochrome' ? 'currentColor' : variant === 'white' ? '#FFFFFF' : '#34D399';
  const bagBgColor = variant === 'monochrome' ? 'currentColor' : variant === 'white' ? '#FFFFFF' : '#10B981';

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="FreshFind Official Logo"
    >
      <defs>
        <linearGradient id="ffBagGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="ffMonogramGrad" x1="30" y1="35" x2="70" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="0.5" stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Bag Handle (Top Arch) */}
      <path 
        d="M38 32V20C38 13.3726 43.3726 8 50 8C56.6274 8 62 13.3726 62 20V32" 
        stroke={variant === 'color' ? '#10B981' : primaryEmerald}
        strokeWidth="6" 
        strokeLinecap="round" 
      />

      {/* Outer Tote Body with Rounded Bevel Corner */}
      <path 
        d="M22 34C19.7909 34 18.0691 35.8856 18.2323 38.0891L21.4916 82.0891C21.637 84.0526 23.2787 85.5714 25.2472 85.5714H74.7528C76.7213 85.5714 78.363 84.0526 78.5084 82.0891L81.7677 38.0891C81.9309 35.8856 80.2091 34 78 34H22Z" 
        fill={variant === 'color' ? 'url(#ffBagGrad)' : bagBgColor}
        fillOpacity={variant === 'color' ? '0.15' : '0.12'}
        stroke={variant === 'color' ? '#059669' : primaryEmerald}
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Symmetrical Double-F Monogram forming Rescue Pin Center */}
      {/* Left 'F' Branch */}
      <path 
        d="M32 44H47V50H38V56H45V62H38V70H32V44Z" 
        fill={variant === 'color' ? 'url(#ffMonogramGrad)' : primaryEmerald} 
      />

      {/* Right Mirrored 'F' Branch */}
      <path 
        d="M68 44H53V50H62V56H55V62H62V70H68V44Z" 
        fill={variant === 'color' ? 'url(#ffMonogramGrad)' : primaryEmerald} 
      />

      {/* Central Stem & Pinpoint Arrow Wedge */}
      <path 
        d="M47 42H53V64L50 72L47 64V42Z" 
        fill={variant === 'color' ? deepForest : primaryEmerald} 
      />

      {/* Central Discovery Focal Beacon */}
      <circle 
        cx="50" 
        cy="56" 
        r="4.5" 
        fill={beaconColor} 
        stroke={variant === 'color' ? '#064E3B' : 'none'}
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Wordmark Lockup Component with User's Tagline:
 * "Connecting Food. Saving Money. Reducing Waste."
 */
export function FreshFindWordmark({ 
  className = "", 
  showTagline = true,
  variant = 'color',
  concept = 'A'
}: { 
  className?: string; 
  showTagline?: boolean;
  variant?: 'color' | 'monochrome' | 'white';
  concept?: 'A' | 'B';
}) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <FreshFindLogo className="w-9 h-9 shrink-0" variant={variant} />
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
          Fresh<span className="text-emerald-500 dark:text-emerald-400">Find</span>
        </span>
        {showTagline && (
          <span className="text-[9.5px] font-semibold tracking-normal text-slate-500 dark:text-slate-400 mt-1">
            Connecting Food. Saving Money. Reducing Waste.
          </span>
        )}
      </div>
    </div>
  );
}

// Backward-compatible exports for preview and older references
export const LogoConceptA = FreshFindLogo;
export function LogoConceptB({ className = "w-10 h-10" }: LogoProps) {
  return <FreshFindLogo className={className} />;
}
