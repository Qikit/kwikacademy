# KwikAcademy

Открытая некоммерческая платформа обучающих материалов и тренажёров. Без регистрации —
весь прогресс хранится в браузере (LocalStorage) и переносится через экспорт/импорт.

## Стек

- **Astro** — статический сайт, контент-коллекции, MDX-уроки.
- **React-острова** — интерактивные тренажёры и виджеты.
- **TypeScript + Zod** — типобезопасность и валидация контента на сборке.
- **Vitest** — модульные тесты логики (прогресс, скоринг, ссылки).
- Деплой — **GitHub Pages** через GitHub Actions.

## Структура контента

| Что | Где | Формат |
| --- | --- | --- |
| Темы (курсы) | `src/content/courses/*.json` | данные |
| Уроки | `src/content/lessons/*.mdx` | проза + компоненты |
| Тренажёры | `src/content/trainers/*.json` | данные |

Уроки пишутся в MDX с библиотекой компонентов (`Callout`, `Compare`, `DecisionTree`,
`Vocab`, `RuleList`, `Cheatsheet`, `Pronunciation`, `Example`) и возможностью вставить
произвольную разметку. Тренажёры — data-driven: `quiz`, `flashcards`, `cloze`, `match`.

## Команды

```bash
npm install      # установка
npm run dev      # дев-сервер
npm run build    # сборка в dist/
npm run preview  # предпросмотр сборки
npm test         # модульные тесты
```

## Деплой

Репозиторий назван `kwikacademy`, поэтому в `astro.config.mjs` задан `base: '/kwikacademy/'`.
Перед публикацией укажите свой `site` (например `https://username.github.io`). В настройках
репозитория: **Settings → Pages → Source = GitHub Actions**.
