import { useEffect, useState } from 'react';
import { createStore } from '../../lib/progress/store';
import { applyTheme } from '../../lib/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as 'light' | 'dark') || 'light';
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
    createStore().setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Переключить тему"
      style={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        border: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer',
        color: 'var(--text-2)',
        fontSize: 16,
        lineHeight: 1,
      }}
    >
      {theme === 'light' ? '☾' : '☀'}
    </button>
  );
}
