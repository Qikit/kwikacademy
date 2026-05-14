import { useId, useRef } from 'react';

export interface CourseCardProps {
  href: string;
  title: string;
  eyebrow: string;
  glyph: string;
  meta: string; // e.g. "17 уроков"
  progress: number; // 0..100
}

export default function CourseCard({ href, title, eyebrow, glyph, meta, progress }: CourseCardProps) {
  const spot = useRef<HTMLDivElement>(null);
  const gradId = useId().replace(/:/g, '');

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = spot.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.left = `${e.clientX - r.left}px`;
    el.style.top = `${e.clientY - r.top}px`;
  }

  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <a className="kc-stack" href={href} onMouseMove={onMove}>
      <span className="kc-l kc-la" />
      <span className="kc-l kc-lb" />
      <div className="kc-card">
        <div className="kc-spot" ref={spot} aria-hidden="true" />
        <svg className="kc-peri" viewBox="0 0 260 210" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--c-purple)" />
              <stop offset=".5" stopColor="#b07cf0" />
              <stop offset="1" stopColor="var(--c-pink)" />
            </linearGradient>
          </defs>
          <rect className="kc-track" x="2.5" y="2.5" width="255" height="205" rx="21" pathLength={100} />
          <rect
            className="kc-fill"
            x="2.5"
            y="2.5"
            width="255"
            height="205"
            rx="21"
            pathLength={100}
            stroke={`url(#${gradId})`}
            style={{ strokeDasharray: `${pct} 100` }}
          />
        </svg>
        <span className="kc-glyph">{glyph}</span>
        <span className="kc-eyebrow">{eyebrow}</span>
        <span className="kc-title">{title}</span>
        <span className="kc-meta">{meta}</span>
        <span className="kc-pct">{pct}%</span>
      </div>
    </a>
  );
}
