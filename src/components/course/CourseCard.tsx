import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createStore } from '../../lib/progress/store';

export interface CourseCardProps {
  href: string;
  title: string;
  eyebrow: string;
  glyph: string;
  meta: string; // e.g. "17 уроков"
  gradient: string; // token name, e.g. "blue", "green"
  size?: 'lg' | 'md' | 'sm';
  lessonSlugs: string[];
  trainerSlugs: string[];
}

export default function CourseCard({
  href,
  title,
  eyebrow,
  glyph,
  meta,
  gradient,
  size = 'md',
  lessonSlugs,
  trainerSlugs,
}: CourseCardProps) {
  const spot = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const s = createStore();
    s.ready.then(() => setPct(s.getOverallProgress(lessonSlugs, trainerSlugs)));
  }, [lessonSlugs, trainerSlugs]);

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = spot.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.left = `${e.clientX - r.left}px`;
    el.style.top = `${e.clientY - r.top}px`;
  }

  const style = {
    '--card-grad': `var(--grad-${gradient})`,
    '--card-accent': `var(--c-${gradient})`,
  } as CSSProperties;

  return (
    <a className="kc-stack" href={href} data-size={size} style={style} onMouseMove={onMove}>
      <span className="kc-l kc-la" />
      <span className="kc-l kc-lb" />
      <div className="kc-card">
        <div className="kc-spot" ref={spot} aria-hidden="true" />
        <svg className="kc-peri" viewBox="0 0 260 210" preserveAspectRatio="none" aria-hidden="true">
          <rect className="kc-track" x="2.5" y="2.5" width="255" height="205" rx="21" pathLength={100} />
          <rect
            className="kc-fill"
            x="2.5"
            y="2.5"
            width="255"
            height="205"
            rx="21"
            pathLength={100}
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
