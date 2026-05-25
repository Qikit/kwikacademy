import { EXPORT_CSS } from './exportCss';

const FONTS =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&family=Manrope:wght@400;600;700&family=Space+Mono&display=swap";

/** Build a fully self-contained, themeable, mobile-ready HTML document for a lesson. */
export function buildLessonHtml(title: string, eyebrow: string, innerHtml: string): string {
  const theme = (document.documentElement.dataset.theme as 'light' | 'dark') || 'light';
  return `<!doctype html>
<html lang="ru" data-theme="${theme}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="KwikAcademy">
<meta name="theme-color" content="#eef0f6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#120f1c" media="(prefers-color-scheme: dark)">
<title>${escapeHtml(title)} — KwikAcademy</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<style>${EXPORT_CSS}</style>
</head>
<body>
<button class="themebtn" id="tt" aria-label="Тема">◐</button>
<main class="doc">
<p class="eyebrow">${escapeHtml(eyebrow)}</p>
<h1>${escapeHtml(title)}</h1>
<div class="prose">${innerHtml}</div>
<span class="brand">KwikAcademy</span>
</main>
<script>
(function(){
  var root=document.documentElement;
  try{var s=localStorage.getItem('kwik-export-theme');if(s)root.dataset.theme=s;}catch(e){}
  document.getElementById('tt').addEventListener('click',function(){
    var next=root.dataset.theme==='dark'?'light':'dark';
    root.dataset.theme=next;
    try{localStorage.setItem('kwik-export-theme',next);}catch(e){}
  });
})();
</script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
