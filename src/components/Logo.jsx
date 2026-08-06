import React from "react";

export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="38" height="38" rx="9" fill="#101b2e" stroke="#34d399" strokeWidth="1.5" />
      <rect x="7" y="7" width="26" height="26" rx="5" fill="none" stroke="#34d399" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="7" cy="7" r="1.4" fill="#34d399" />
      <circle cx="33" cy="7" r="1.4" fill="#34d399" />
      <circle cx="7" cy="33" r="1.4" fill="#34d399" />
      <circle cx="33" cy="33" r="1.4" fill="#34d399" />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="700"
        fontSize="14"
        fill="#a7f3d0"
      >
        A+G
      </text>
    </svg>
  );
}
