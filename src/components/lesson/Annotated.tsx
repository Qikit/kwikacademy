import { useState } from 'react';

interface Part {
  text: string;
  note?: string;
}
interface Props {
  parts: Part[];
}

export default function Annotated({ parts }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="kc-an">
      <p className="kc-an-text">
        {parts.map((p, i) =>
          p.note ? (
            <button
              key={i}
              type="button"
              className={`kc-an-mark${open === i ? ' active' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              {p.text}
            </button>
          ) : (
            <span key={i}>{p.text}</span>
          ),
        )}
      </p>
      {open !== null && parts[open].note && <div className="kc-an-note">{parts[open].note}</div>}
    </div>
  );
}
