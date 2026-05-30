import { createStore, ready } from './store';

/** Mark finished trainers in a topic's trainer list with a badge and best score. */
export async function hydrateTrainerList() {
  await ready;
  const store = createStore();
  document.querySelectorAll<HTMLElement>('[data-trainer]').forEach((el) => {
    const slug = el.dataset.trainer;
    if (!slug) return;
    const result = store.getTrainerResult(slug);
    if (!result) return;
    el.dataset.done = 'true';
    const score = el.querySelector<HTMLElement>('.tscore');
    if (score) score.textContent = `${result.score}/${result.total}`;
  });
}

/** Update roadmap node states from stored progress. */
export async function hydrateRoadmap() {
  await ready;
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
