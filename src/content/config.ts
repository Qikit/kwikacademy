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
  caseSensitive: z.boolean().default(false),
  items: z
    .array(
      z
        .object({
          text: z.string(),
          // per-blank answer: a single string, or an array of accepted variants
          answers: z.array(z.union([z.string(), z.array(z.string().min(1)).min(1)])).min(1),
          explain: z.string().optional(),
          hint: z.string().optional(),
        })
        .superRefine((item, ctx) => {
          const blanks = item.text.split('___').length - 1;
          if (blanks !== item.answers.length) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `cloze «${item.text}»: пропусков ${blanks} != answers ${item.answers.length}`,
            });
          }
        }),
    )
    .min(1),
});
const matchData = z.object({
  type: z.literal('match'),
  pairs: z
    .array(z.object({ left: z.string(), right: z.string(), explain: z.string().optional() }))
    .min(2),
});
const categorizeData = z.object({
  type: z.literal('categorize'),
  categories: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .min(2)
    .max(4),
  items: z
    .array(
      z.object({
        text: z.string().min(1),
        category: z.string().min(1),
        explain: z.string().optional(),
      }),
    )
    .min(10),
});
const orderingData = z.object({
  type: z.literal('ordering'),
  code: z.boolean().default(false),
  items: z
    .array(
      z.object({
        task: z.string().optional(),
        words: z.array(z.string().min(1)).min(3),
        answer: z.array(z.string().min(1)).min(3),
        hint: z.string().optional(),
        translation: z.string().optional(),
        explain: z.string().optional(),
      }),
    )
    .min(6),
});

const trainers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/trainers' }),
  schema: z.object({
    course: z.string(),
    lesson: z.string().optional(),
    title: z.string(),
    description: z.string().default(''),
    data: z.discriminatedUnion('type', [
      quizData,
      flashData,
      clozeData,
      matchData,
      categorizeData,
      orderingData,
    ]),
  }),
});

export const collections = { courses, lessons, trainers };
