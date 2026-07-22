type ChevronDirection = 'up' | 'down' | 'right';

const categoryIconFile: Record<'camera' | 'plan' | 'sensor' | 'shield', string> = {
  camera: '/icons/cat-cameras.svg',
  plan: '/icons/cat-plan.svg',
  sensor: '/icons/cat-sensors.svg',
  shield: '/icons/cat-accessories.svg',
};

/** Small solid "carrot" triangle used in the accordion headers. */
export function ChevronIcon({ direction }: { direction: ChevronDirection }) {
  const rotation = {
    up: 'rotate-0',
    down: 'rotate-180',
    right: '-rotate-90',
  }[direction];

  return (
    <svg
      viewBox="0 0 10 7"
      className={`h-[7px] w-[10px] shrink-0 transition-transform ${rotation}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 0L9.33 6.75H0.67L5 0Z" fill="currentColor" />
    </svg>
  );
}

export function CategoryIcon({ kind }: { kind: 'camera' | 'plan' | 'sensor' | 'shield' }) {
  return (
    <span className="flex size-[26px] shrink-0 items-center justify-center" aria-hidden="true">
      <img src={categoryIconFile[kind]} alt="" className="h-full w-full object-contain" />
    </span>
  );
}
