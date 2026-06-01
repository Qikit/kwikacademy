import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createStore } from '../../lib/progress/store';

export interface CourseCardProps {
  href: string;
  title: string;
  eyebrow: string;
  glyph: string;
  meta: string;
  gradient: string; // token name
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
  const cardEl = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [dim, setDim] = useState({ w: 260, h: 210 });

  useEffect(() => {
    const s = createStore();
    s.ready.then(() => setPct(s.getOverallProgress(lessonSlugs, trainerSlugs)));
  }, [lessonSlugs, trainerSlugs]);

  // Track actual card pixel size so the SVG outline geometry stays correct at any aspect.
  useEffect(() => {
    const el = cardEl.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setDim({ w: Math.max(8, Math.round(r.width)), h: Math.max(8, Math.round(r.height)) });
    };
    const obs = new ResizeObserver(update);
    obs.observe(el);
    update();
    return () => obs.disconnect();
  }, []);

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

  const done = pct >= 100;

  return (
    <a
      className="kc-stack"
      href={href}
      data-size={size}
      data-progress={done ? '100' : undefined}
      style={style}
      onMouseMove={onMove}
    >
      <div className="kc-card" ref={cardEl}>
        <div className="kc-spot" ref={spot} aria-hidden="true" />
        <svg
          className="kc-peri"
          viewBox={`0 0 ${dim.w} ${dim.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect
            className="kc-track"
            x="2"
            y="2"
            width={dim.w - 4}
            height={dim.h - 4}
            rx="22"
            pathLength={100}
            vectorEffect="non-scaling-stroke"
          />
          <rect
            className="kc-fill"
            x="2"
            y="2"
            width={dim.w - 4}
            height={dim.h - 4}
            rx="22"
            pathLength={100}
            vectorEffect="non-scaling-stroke"
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
