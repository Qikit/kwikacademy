import { getCollection, type CollectionEntry } from 'astro:content';

const isVisible = (lesson: CollectionEntry<'lessons'>) => import.meta.env.DEV || !lesson.data.draft;

export async function getLessons() {
  return getCollection('lessons', isVisible);
}

export async function getTrainers() {
  const hidden = new Set(
    (await getCollection('lessons')).filter((lesson) => !isVisible(lesson)).map((lesson) => lesson.id),
  );
  return getCollection('trainers', (trainer) => !trainer.data.lesson || !hidden.has(trainer.data.lesson));
}
