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
  const card = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const s = createStore();
    s.ready.then(() => setPct(s.getOverallProgress(lessonSlugs, trainerSlugs)));
  }, [lessonSlugs, trainerSlugs]);

  const reduce =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (spot.current) {
      spot.current.style.left = `${x}px`;
      spot.current.style.top = `${y}px`;
    }
    if (card.current && !reduce) {
      const rx = ((y / r.height) * 2 - 1) * -4;
      const ry = ((x / r.width) * 2 - 1) * 4;
      card.current.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    }
  }

  function onLeave() {
    if (card.current) card.current.style.transform = '';
  }

  const style = {
    '--card-grad': `var(--grad-${gradient})`,
    '--card-accent': `var(--c-${gradient})`,
  } as CSSProperties;

  return (
    <a
      className="kc-stack"
      href={href}
      data-size={size}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span className="kc-l kc-la" />
      <span className="kc-l kc-lb" />
      <div className="kc-card" ref={card}>
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
