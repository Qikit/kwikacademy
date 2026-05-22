import { createStore } from './store';

const split = (v: string | undefined) => (v || '').split(',').filter(Boolean);

/** Update course-card outlines (.kc-fill) from stored progress: lessons + trainers. */
export function hydrateCourseCards() {
  const store = createStore();
  document.querySelectorAll<HTMLElement>('[data-course][data-lesson-slugs]').forEach((slot) => {
    const lessonSlugs = split(slot.dataset.lessonSlugs);
    const trainerSlugs = split(slot.dataset.trainerSlugs);
    if (lessonSlugs.length + trainerSlugs.length === 0) return;
    const pct = store.getOverallProgress(lessonSlugs, trainerSlugs);
    const fill = slot.querySelector<SVGRectElement>('.kc-fill');
    const label = slot.querySelector<HTMLElement>('.kc-pct');
    if (fill) fill.style.strokeDasharray = `${pct} 100`;
    if (label) label.textContent = `${pct}%`;
  });
}

/** Mark finished trainers in a topic's trainer list with a badge and best score. */
export function hydrateTrainerList() {
  const store = createStore();
  document.querySelectorAll<HTMLElement>('[data-trainer]').forEach((el) => {
    const slug = el.dataset.trainer;
    if (!slug) return;
    const result = store.getTrainerResult(slug);
    if (!result) return;
    el.dataset.done = 'true';
    const badge = el.querySelector<HTMLElement>('.tbadge');
    if (badge) badge.textContent = `✓ ${result.score}/${result.total}`;
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
