import { useEffect, useRef, useState } from 'react';
import { createStore } from '../../lib/progress/store';
import type { ProgressState } from '../../lib/progress/types';

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 40,
          fontWeight: 800,
          background: 'var(--grad-aurora)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [snap, setSnap] = useState<ProgressState | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const store = useRef(createStore());

  useEffect(() => {
    setSnap(store.current.snapshot());
  }, []);

  function doExport() {
    const blob = new Blob([store.current.exportAll()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'kwikacademy-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function doImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((txt) => {
      try {
        store.current.importAll(txt);
        setSnap(store.current.snapshot());
      } catch {
        alert('Не удалось прочитать файл прогресса.');
      }
    });
  }

  function reset() {
    if (confirm('Стереть весь прогресс на этом устройстве?')) {
      localStorage.clear();
      store.current = createStore();
      setSnap(store.current.snapshot());
    }
  }

  if (!snap) return null;

  return (
    <div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
        <Stat label="Уроков пройдено" value={snap.lessonsDone.length} />
        <Stat label="Тренажёров сдано" value={Object.keys(snap.trainerResults).length} />
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="kc-retry" style={{ marginTop: 0 }} onClick={doExport}>
          Экспорт JSON
        </button>
        <button className="kc-retry" style={{ marginTop: 0 }} onClick={() => fileRef.current?.click()}>
          Импорт JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          onChange={doImport}
          style={{ display: 'none' }}
        />
        <button className="kc-retry" style={{ marginTop: 0, background: '#f87171' }} onClick={reset}>
          Сбросить
        </button>
      </div>
    </div>
  );
}
