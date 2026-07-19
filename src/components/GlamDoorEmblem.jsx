import React from 'react';

export default function GlamDoorEmblem({ size = 320 }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Cream circle background */}
      <div className="absolute inset-0 rounded-full bg-[#f5efe8] border border-[#e8dfd3] shadow-2xl" />

      {/* Rotating curved text */}
      <div className="absolute inset-0 animate-[spin_25s_linear_infinite]">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <path id="glamDoorCircle" d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0" />
          </defs>
          <text
            fill="#262626"
            fontSize="8.5"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            letterSpacing="2.5"
            fontWeight="500"
          >
            <textPath href="#glamDoorCircle" startOffset="0">
              GLAM * DOOR * SPA &amp; SALON * BEAUTY * WELLNESS * GLAM * DOOR * SPA &amp; SALON * BEAUTY * WELLNESS *
            </textPath>
          </text>
        </svg>
      </div>

      {/* Inner decorative ring */}
      <div className="absolute inset-7 rounded-full border border-[#e0d5c8]" />

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-heading font-bold tracking-[0.12em] text-[#262626] leading-none">GLAM</div>
        <div className="text-4xl font-heading font-bold tracking-[0.12em] text-[#262626] leading-none mt-1">DOOR</div>
        <div className="mt-3 text-[10px] font-heading tracking-[0.35em] uppercase text-[#a39587]">Spa &amp; Salon</div>
      </div>
    </div>
  );
}