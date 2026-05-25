import { useState } from 'react';
import { Download, FileText, FileType } from 'lucide-react';
import { buildLessonHtml } from '../../lib/export/lessonHtml';

function getProse(): string {
  return document.querySelector('.lesson .prose')?.innerHTML ?? '';
}

function download(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

export default function ExportMenu({
  title,
  eyebrow,
  slug,
}: {
  title: string;
  eyebrow: string;
  slug: string;
}) {
  const [busy, setBusy] = useState(false);

  function exportHtml() {
    const html = buildLessonHtml(title, eyebrow, getProse());
    download(new Blob([html], { type: 'text/html;charset=utf-8' }), `${slug}.html`);
  }

  async function exportDocx() {
    setBusy(true);
    try {
      const { asBlob } = await import('html-docx-js-typescript');
      const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        body{font-family:Georgia,serif;line-height:1.5}
        h1{font-family:Arial,sans-serif}h2{font-family:Arial,sans-serif;margin-top:18px}
        table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px;font-size:12px}
        .callout{border-left:3px solid #7c6cf0;padding:8px 12px;margin:10px 0;background:#f4f1fc}
      </style></head><body><h1>${title}</h1>${getProse()}</body></html>`;
      const out = await asBlob(doc);
      const blob = out instanceof Blob ? out : new Blob([out as BlobPart]);
      download(blob, `${slug}.docx`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="kc-export">
      <span className="kc-export-label">
        <Download size={14} /> Скачать урок
      </span>
      <div className="kc-export-btns">
        <button onClick={exportHtml} className="kc-export-btn">
          <FileText size={15} /> HTML
        </button>
        <button onClick={exportDocx} className="kc-export-btn" disabled={busy}>
          <FileType size={15} /> {busy ? '…' : 'DOCX'}
        </button>
      </div>
    </div>
  );
}
