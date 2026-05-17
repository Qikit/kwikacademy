import { createStore } from './store';

/** Update course-card outlines (.kc-fill) from stored progress, per course. */
export function hydrateCourseCards() {
  const store = createStore();
  document.querySelectorAll<HTMLElement>('[data-course][data-lesson-slugs]').forEach((slot) => {
    const slugs = (slot.dataset.lessonSlugs || '').split(',').filter(Boolean);
    if (slugs.length === 0) return;
    const pct = store.getCourseProgress(slugs);
    const fill = slot.querySelector<SVGRectElement>('.kc-fill');
    const label = slot.querySelector<HTMLElement>('.kc-pct');
    if (fill) fill.style.strokeDasharray = `${pct} 100`;
    if (label) label.textContent = `${pct}%`;
  });
}

/** Update roadmap node states from stored progress. */
export function hydrateRoadmap() {
  const store = createStore();
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('.rnode'));
  let currentSet = false;
  nodes.forEach((node) => {
    const slug = node.dataset.lesson;
    const dot = node.querySelector<HTMLElement>('.dot');
    if (!slug || !dot) return;
    if (store.isLessonDone(slug)) {
      dot.dataset.state = 'done';
    } else if (!currentSet) {
      dot.dataset.state = 'current';
      currentSet = true;
    }
  });
}
