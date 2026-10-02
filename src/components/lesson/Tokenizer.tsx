import { useState } from 'react';
import { tokenize } from '../../lib/lesson/tokenize';

const DEFAULT = 'The cat sat on the mat.\nКот сидел на коврике.\n4813  def f(x): return x*2';

export default function Tokenizer({ default: def = DEFAULT }: { default?: string }) {
  const [text, setText] = useState(def);
  const tokens = tokenize(text);
  return (
    <div className="kc-tok">
      <label className="kc-tok-label" htmlFor="kc-tok-in">
        Введи текст — увидишь, как он бьётся на токены:
      </label>
      <textarea
        id="kc-tok-in"
        className="kc-tok-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        spellCheck={false}
      />
      <div className="kc-tok-out" aria-live="polite">
        {tokens.map((t, i) => (
          <span key={i} className={`kc-tok-chip kc-tok-${t.kind}`}>
            {t.text === ' ' ? '␣' : t.text === '\n' ? '↵' : t.text}
          </span>
        ))}
      </div>
      <div className="kc-tok-stats">
        <strong>{tokens.length}</strong> токенов · {[...text].length} символов
      </div>
      <p className="kc-tok-note">
        Упрощённая демонстрация принципа: текст делится на кусочки меньше слова, и на один и тот же
        смысл их может уйти разное число. Правило здесь условное, это не токенизатор конкретной
        модели — реальное число даёт <code>count_tokens</code> вендора.
      </p>
    </div>
  );
}
