import { cn } from '@/lib/cn';

type ProductArtworkProps = {
  kind: 'camera' | 'sensor' | 'plan' | 'accessory';
  /** Product photo path (served from /public). Falls back to drawn artwork when absent. */
  src?: string;
  /** Extra classes for the image element (e.g. object-fit / inset tweaks). */
  imgClassName?: string;
  compact?: boolean;
};

export function ProductArtwork({ kind, src, imgClassName, compact = false }: ProductArtworkProps) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={cn('h-full w-full object-contain', imgClassName)}
      />
    );
  }

  const base = compact ? 'h-[46px] w-[46px]' : 'h-[92px] w-[92px]';

  return (
    <div className={cn('relative', base)} aria-hidden="true">
      {kind === 'camera' ? <CameraArtwork compact={compact} /> : null}
      {kind === 'sensor' ? <SensorArtwork compact={compact} /> : null}
      {kind === 'plan' ? <PlanArtwork compact={compact} /> : null}
      {kind === 'accessory' ? <AccessoryArtwork compact={compact} /> : null}
    </div>
  );
}

function CameraArtwork({ compact }: { compact: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="19" y="33" width="82" height="48" rx="18" fill="#E7EEF9" />
      <rect x="30" y="43" width="60" height="28" rx="14" fill="#FFFFFF" stroke="#CAD7EA" />
      <circle cx="60" cy="57" r="12" fill="#4E2FD2" opacity="0.18" />
      <circle cx="60" cy="57" r="7" fill="#4E2FD2" />
      <circle cx="60" cy="57" r="2.6" fill="#FFFFFF" />
      <path d="M48 81H72" stroke="#9DB1CC" strokeWidth="6" strokeLinecap="round" />
      <path d="M60 81V98" stroke="#7E93AE" strokeWidth="6" strokeLinecap="round" />
      {!compact ? <circle cx="84" cy="42" r="4" fill="#7EE2B8" /> : null}
    </svg>
  );
}

function SensorArtwork({ compact }: { compact: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="28" width="76" height="64" rx="20" fill="#EFF5F8" />
      <rect x="35" y="40" width="50" height="40" rx="14" fill="#FFFFFF" stroke="#D8E2EA" />
      <circle cx="60" cy="60" r="11" fill="#0AA288" opacity="0.15" />
      <circle cx="60" cy="60" r="5" fill="#0AA288" />
      <path d="M38 26C44 20 52 16 60 16C68 16 76 20 82 26" stroke="#B6C6D4" strokeWidth="5" strokeLinecap="round" />
      <path d="M28 18C37 9 49 4 60 4C71 4 83 9 92 18" stroke="#DCE5EA" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      {!compact ? <rect x="50" y="88" width="20" height="6" rx="3" fill="#B0C3D4" /> : null}
    </svg>
  );
}

function PlanArtwork({ compact }: { compact: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="22" width="84" height="76" rx="24" fill="#EEF3FF" />
      <path d="M43 64L55 76L79 48" stroke="#4E2FD2" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="60" r="36" stroke="#4E2FD2" strokeOpacity="0.14" strokeWidth="8" />
      {!compact ? <circle cx="86" cy="36" r="4" fill="#0AA288" /> : null}
    </svg>
  );
}

function AccessoryArtwork({ compact }: { compact: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="28" width="76" height="64" rx="18" fill="#F4F6F8" />
      <rect x="32" y="38" width="56" height="44" rx="12" fill="#FFFFFF" stroke="#D7DFE8" />
      <path d="M40 52H80" stroke="#7E93AE" strokeWidth="6" strokeLinecap="round" />
      <path d="M40 64H72" stroke="#B8C4D2" strokeWidth="6" strokeLinecap="round" />
      <circle cx="84" cy="66" r="8" fill="#FFBE55" opacity="0.35" />
      {!compact ? <path d="M30 88H90" stroke="#D6DFE8" strokeWidth="6" strokeLinecap="round" /> : null}
    </svg>
  );
}
