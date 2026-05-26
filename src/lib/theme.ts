import { THEME_KEY } from './progress/types';

/** Inline script for the document head — runs before first paint to avoid a theme flash. */
export function themeInitScript(): string {
  return `(() => {
    function apply() {
      try {
        var saved = localStorage.getItem('${THEME_KEY}');
        var sys = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.dataset.theme = saved || sys;
      } catch (e) {
        document.documentElement.dataset.theme = 'light';
      }
    }
    apply();
    // ClientRouter strips html attributes on swap — reapply synchronously before paint.
    if (!window.__kwikThemeBound) {
      window.__kwikThemeBound = true;
      document.addEventListener('astro:after-swap', apply);
    }
  })();`;
}

export function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
}
