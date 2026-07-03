import { useState } from 'react';

interface Props {
  prompt: string;
  options: string[];
  correctIndex: number;
  explain?: string;
}

export default function QuickCheck({ prompt, options, correctIndex, explain }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const revealed = picked !== null;
  return (
    <div className="kc-qc">
      <div className="kc-qc-prompt">{prompt}</div>
      <div className="kc-qc-opts">
        {options.map((opt, i) => {
          let cls = 'kc-qc-opt';
          if (revealed && i === correctIndex) cls += ' correct';
          else if (revealed && i === picked) cls += ' wrong';
          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => picked === null && setPicked(i)}
              disabled={revealed}
              aria-pressed={picked === i}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && explain && <p className="kc-qc-explain">{explain}</p>}
    </div>
  );
}
