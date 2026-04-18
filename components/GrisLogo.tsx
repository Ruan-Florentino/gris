import React from 'react';

interface GrisLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export default function GrisLogo({ size = 40, className = '', glow = true }: GrisLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        filter: glow ? 'drop-shadow(0 0 8px rgba(0,255,156,0.6))' : 'none',
      }}
    >
      {/* Outer bracket frame */}
      <path
        d="M4 4 L4 12 M4 4 L12 4"
        stroke="#00FF9C"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M36 4 L36 12 M36 4 L28 4"
        stroke="#00FF9C"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M4 36 L4 28 M4 36 L12 36"
        stroke="#00FF9C"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M36 36 L36 28 M36 36 L28 36"
        stroke="#00FF9C"
        strokeWidth="1.5"
        strokeLinecap="square"
      />

      {/* Central circle (globe) */}
      <circle
        cx="20"
        cy="20"
        r="10"
        stroke="#00FF9C"
        strokeWidth="1.2"
        fill="rgba(0,255,156,0.08)"
      />

      {/* Meridians */}
      <ellipse
        cx="20"
        cy="20"
        rx="4"
        ry="10"
        stroke="#00FF9C"
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      <line
        x1="10"
        y1="20"
        x2="30"
        y2="20"
        stroke="#00FF9C"
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* Center dot - target */}
      <circle cx="20" cy="20" r="2" fill="#00FF9C" />
      <circle cx="20" cy="20" r="1" fill="#FFFFFF" />

      {/* Crosshair extensions */}
      <line x1="20" y1="6" x2="20" y2="10" stroke="#00FF9C" strokeWidth="1" />
      <line x1="20" y1="30" x2="20" y2="34" stroke="#00FF9C" strokeWidth="1" />
      <line x1="6" y1="20" x2="10" y2="20" stroke="#00FF9C" strokeWidth="1" />
      <line x1="30" y1="20" x2="34" y2="20" stroke="#00FF9C" strokeWidth="1" />
    </svg>
  );
}
