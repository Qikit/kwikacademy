import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const courses = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    icon: z.string(), // lucide-react icon key, e.g. "book-open", "code"
    gradient: z.enum([
      'aurora',
      'blue-purple',
      'purple-pink',
      'teal-blue',
      'amber-coral',
      'blue',
      'sky',
      'cyan',
      'teal',
      'green',
      'gold',
      'orange',
      'rose',
      'violet',
      'indigo',
    ]),
    order: z.number().int(),
    accent: z.enum(['light', 'dark']).default('light'),
    estimatedHours: z.number().nonnegative().default(0),
    tags: z.array(z.string()).default([]),
    hidden: z.boolean().default(false),
  }),
});

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    course: z.string(),
    order: z.number().int(),
    title: z.string(),
    eyebrow: z.string().default(''),
    phase: z.string().default(''),
    readingMinutes: z.number().int().positive().default(5),
    summary: z.string().default(''),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    placeholder: z.boolean().default(false),
  }),
});

const quizData = z.object({
  type: z.literal('quiz'),
  questions: z
    .array(
      z.object({
        prompt: z.string(),
        options: z.array(z.string()).min(2),
        correctIndex: z.number().int().nonnegative(),
        explain: z.string().optional(),
      }),
    )
    .min(1),
});
const flashData = z.object({
  type: z.literal('flashcards'),
  cards: z.array(z.object({ front: z.string(), back: z.string(), hint: z.string().optional() })).min(1),
});
const clozeData = z.object({
  type: z.literal('cloze'),
  items: z.array(z.object({ text: z.string(), answers: z.array(z.string()).min(1) })).min(1),
});
const matchData = z.object({
  type: z.literal('match'),
  pairs: z.array(z.object({ left: z.string(), right: z.string() })).min(2),
});

const trainers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/trainers' }),
  schema: z.object({
    course: z.string(),
    lesson: z.string().optional(),
    title: z.string(),
    description: z.string().default(''),
    data: z.discriminatedUnion('type', [quizData, flashData, clozeData, matchData]),
  }),
});

export const collections = { courses, lessons, trainers };
