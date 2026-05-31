import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = '— выбери —',
  disabled = false,
  ariaLabel,
  status,
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  status?: 'ok' | 'no';
}) {
  const baseId = useId();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : '';
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  function openList() {
    if (disabled) return;
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function closeList(refocus = true) {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }

  function selectAt(i: number) {
    const opt = options[i];
    if (!opt) return;
    onChange(opt.value);
    closeList();
  }

  // Переносим фокус в список при открытии и держим активный пункт в зоне видимости.
  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  // Закрытие по клику вне компонента.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function onTriggerKey(e: React.KeyboardEvent) {
    if (open) return;
    if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  }

  function onListKey(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        selectAt(active);
        break;
      case 'Escape':
        e.preventDefault();
        closeList();
        break;
      case 'Tab':
        closeList(false);
        break;
    }
  }

  const statusClass = status ? ` is-${status}` : '';

  return (
    <div ref={wrapRef} className={`kc-select${open ? ' is-open' : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`kc-select-trigger${statusClass}`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? closeList(false) : openList())}
        onKeyDown={onTriggerKey}
      >
        <span className={`kc-select-value${selectedLabel ? '' : ' is-placeholder'}`}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown size={16} className="kc-select-caret" aria-hidden="true" />
      </button>

      {open && (
        <ul
          ref={listRef}
          className="kc-select-panel"
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={optionId(active)}
          aria-label={ariaLabel}
          onKeyDown={onListKey}
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                className={`kc-select-option${i === active ? ' is-active' : ''}${
                  isSelected ? ' is-selected' : ''
                }`}
                onMouseEnter={() => setActive(i)}
                onClick={() => selectAt(i)}
              >
                <span className="kc-select-option-label">{opt.label}</span>
                {isSelected && <Check size={15} className="kc-select-tick" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
