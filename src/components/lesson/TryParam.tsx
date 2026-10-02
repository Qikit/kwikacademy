import { useState } from 'react';
import { bandFor } from '../../lib/lesson/bands';

interface Band {
  upTo: number;
  title: string;
  text: string;
}
interface Props {
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
  bands: Band[];
}

export default function TryParam({ label, min, max, step, default: def, unit, bands }: Props) {
  const [value, setValue] = useState(def);
  const idx = bandFor(value, bands);
  const band = idx >= 0 ? bands[idx] : undefined;
  return (
    <div className="kc-tp">
      <div className="kc-tp-head">
        <span className="kc-tp-label">{label}</span>
        <span className="kc-tp-val">
          {String(value).replace('.', ',')}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        type="range"
        className="kc-tp-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        aria-label={label}
      />
      {band && (
        <div className="kc-tp-band">
          <span className="kc-tp-band-title">{band.title}</span>
          <span className="kc-tp-band-text">{band.text}</span>
        </div>
      )}
    </div>
  );
}
