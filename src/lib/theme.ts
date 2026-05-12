import { STORAGE_KEY } from './progress/types';

/** Inline script for the document head — runs before first paint to avoid a theme flash. */
export function themeInitScript(): string {
  return `(() => {
    try {
      var raw = localStorage.getItem('${STORAGE_KEY}');
      var saved = raw ? JSON.parse(raw).theme : null;
      var sys = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = saved || sys;
    } catch (e) {
      document.documentElement.dataset.theme = 'light';
    }
  })();`;
}

export function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
}
