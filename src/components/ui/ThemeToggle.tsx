import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
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
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer',
        color: 'var(--text-2)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}
