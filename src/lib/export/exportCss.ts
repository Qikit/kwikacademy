// Self-contained stylesheet for exported lessons. Mirrors the site's lesson look,
// both themes, tuned to feel like a web-app on phones (iPhone safe areas included).
export const EXPORT_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --r-sm:8px;--r-md:14px;--r-lg:22px;--r-full:9999px;
  --grad-aurora:linear-gradient(120deg,#6c7cf0,#a16cf0,#f06cc0);
  --grad-blue-purple:linear-gradient(135deg,#6c7cf0,#a16cf0);
  --grad-purple-pink:linear-gradient(135deg,#a16cf0,#f06cc0);
  --c-purple:#7c6cf0;--c-pink:#f06cc0;
}
:root[data-theme='light']{
  --bg-grad:linear-gradient(160deg,#f3f1fc 0%,#eaf1ff 55%,#fdf0f8 100%);
  --text:#1a1825;--text-2:#5a5670;--text-3:#8b88a0;
  --glass-bg:rgba(255,255,255,.62);--glass-border:rgba(124,108,240,.18);
}
:root[data-theme='dark']{
  --bg-grad:radial-gradient(circle at 30% 0%,#231d36,#120f1c 70%);
  --text:#f0eef8;--text-2:#b8b0d0;--text-3:#9a92b8;
  --glass-bg:rgba(40,33,62,.55);--glass-border:rgba(255,255,255,.1);
}
html{-webkit-text-size-adjust:100%}
body{
  font-family:'Manrope',system-ui,-apple-system,'Segoe UI',sans-serif;
  background:var(--bg-grad);background-attachment:fixed;color:var(--text);
  line-height:1.7;min-height:100vh;
  padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  -webkit-font-smoothing:antialiased;transition:background .3s,color .3s;
}
.doc{max-width:760px;margin:0 auto;padding:48px 22px 96px}
h1{font-family:'Unbounded','Manrope',sans-serif;font-size:clamp(28px,7vw,44px);font-weight:800;line-height:1.12;margin-bottom:10px}
.eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--c-purple);font-weight:700;margin-bottom:14px}
.prose h2{font-family:'Unbounded','Manrope',sans-serif;font-size:22px;margin:34px 0 14px;line-height:1.2}
.prose h3{font-family:'Unbounded','Manrope',sans-serif;font-size:16px;margin:22px 0 10px}
.prose p{color:var(--text-2);margin:12px 0}
.prose strong{color:var(--text);font-weight:600}
.prose em{font-style:italic}
.prose ul,.prose ol{color:var(--text-2);margin:12px 0 12px 20px}
.prose li{margin:4px 0}
.prose{overflow-wrap:break-word}
.prose code{font-family:'Space Mono',ui-monospace,monospace;font-size:.9em;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:6px;padding:2px 6px}
.prose pre{overflow-x:auto;-webkit-overflow-scrolling:touch;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-md);padding:14px 16px;margin:16px 0;font-size:13px;line-height:1.55}
.prose pre code{background:none;border:none;padding:0;font-size:inherit}
.prose table{width:100%;border-collapse:collapse;font-size:13px;margin:16px 0}
.prose th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-3);padding:10px 12px;border-bottom:1px solid var(--glass-border)}
.prose td{padding:10px 12px;border-bottom:1px solid var(--glass-border);color:var(--text-2);vertical-align:top}
.prose td:first-child{color:var(--text);font-weight:500}
.prose blockquote{border-left:3px solid var(--c-purple);padding-left:16px;margin:16px 0;color:var(--text-2)}
.callout{border-left:3px solid;border-radius:0 var(--r-md) var(--r-md) 0;padding:13px 16px;margin:14px 0;font-size:14px;color:var(--text-2)}
.callout strong{display:block;margin-bottom:4px}
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0}
.side{border:1px solid var(--glass-border);border-radius:var(--r-md);padding:16px;background:var(--glass-bg);font-size:14px;color:var(--text)}
.lbl{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
.ok .lbl{color:#34d399}.no .lbl{color:#f87171}
.ex{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-md);padding:12px 14px;margin:8px 0}
.ex .en{font-size:14px;color:var(--text)}.ex .ru{font-size:12px;color:var(--text-3);margin-top:4px}
.rules{list-style:none;display:flex;flex-direction:column;gap:8px;margin:12px 0}
.rules li{display:flex;gap:12px;align-items:flex-start;font-size:13px;color:var(--text-2);padding:12px 14px;background:var(--glass-bg);border-radius:var(--r-md)}
.rules .n{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;background:var(--grad-blue-purple);color:#fff;flex-shrink:0}
.tree{display:flex;flex-direction:column;gap:10px;margin:14px 0}
.tree .node{border:1px solid var(--glass-border);border-radius:var(--r-md);padding:14px;background:var(--glass-bg)}
.tree .q{font-weight:600;color:var(--text);margin-bottom:8px;font-size:14px}
.tree .branch{font-size:13px;padding:6px 10px;border-radius:var(--r-sm);margin-top:4px}
.tree .yes{background:#34d39922;color:#34d399}.tree .no{background:#f8717122;color:#f87171}
.pron{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}
.pron .row{padding:12px;border-radius:var(--r-sm);background:var(--glass-bg);border:1px solid var(--glass-border);font-size:13px;color:var(--text-2)}
.pron .plabel{display:block;font-size:11px;text-transform:uppercase;color:var(--c-purple);margin-bottom:4px}
.vocab{width:100%;border-collapse:collapse;font-size:13px;margin:12px 0}
.vocab td{padding:11px 12px;border-bottom:1px solid var(--glass-border);color:var(--text-2)}
.vocab td:first-child{font-weight:600;color:var(--text);width:38%}
.themebtn{position:fixed;top:calc(env(safe-area-inset-top) + 14px);right:14px;z-index:10;width:42px;height:42px;border-radius:50%;border:1px solid var(--glass-border);background:var(--glass-bg);backdrop-filter:blur(10px);color:var(--text-2);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center}
.brand{display:block;text-align:center;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-3);margin-top:64px}
.bm{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-md);padding:18px 20px;margin:18px 0}
.bm-caption{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);margin-bottom:14px}
.bm-rows{display:flex;flex-direction:column;gap:12px}
.bm-row{display:grid;grid-template-columns:minmax(90px,190px) 1fr auto;align-items:center;gap:12px}
.bm-label{font-size:13px;color:var(--text)}.bm-note{font-size:11px;color:var(--text-3)}
.bm-track{height:9px;background:rgba(124,108,240,.14);border-radius:9999px;overflow:hidden}
.bm-fill{display:block;height:100%;transform-origin:left;border-radius:inherit}
.bm-val{font-size:12px;color:var(--text-2);text-align:right}
.st{display:flex;flex-direction:column;gap:8px;margin:18px 0}
.st-step{border:1px solid var(--glass-border);border-radius:var(--r-md);background:var(--glass-bg);padding:12px 16px}
.st-sum{list-style:none;display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text)}
.st-num{width:22px;height:22px;border-radius:9999px;background:rgba(124,108,240,.14);color:#7c5cf0;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.st-title{flex:1;font-weight:500}.st-badge{font-size:10px;text-transform:uppercase;color:#7c5cf0;background:rgba(124,108,240,.14);padding:2px 8px;border-radius:var(--r-sm)}
.st-body{margin-top:10px;padding-left:32px;font-size:13px;color:var(--text-2)}
.kc-tp{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-md);padding:16px 18px;margin:18px 0}
.kc-tp-head{display:flex;justify-content:space-between;margin-bottom:10px}.kc-tp-label{font-size:13px;color:var(--text);font-weight:500}
.kc-tp-val{font-size:15px;color:#7c5cf0;font-weight:600}.kc-tp-range{width:100%;accent-color:#7c5cf0;margin:4px 0 12px}
.kc-tp-band{background:rgba(124,108,240,.14);border-radius:var(--r-sm);padding:10px 14px}
.kc-tp-band-title{display:block;font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px}
.kc-tp-band-text{display:block;font-size:12px;color:var(--text-2)}
.kc-qc{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-md);padding:16px 18px;margin:18px 0}
.kc-qc-prompt{font-size:14px;color:var(--text);font-weight:500;margin-bottom:12px}
.kc-qc-opts{display:flex;flex-direction:column;gap:8px}
.kc-qc-opt{text-align:left;padding:11px 14px;border-radius:var(--r-sm);border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text);font-size:13px}
.kc-qc-opt.correct{border-color:#34b56a;background:rgba(52,181,106,.14)}.kc-qc-opt.wrong{border-color:#ec4c8c;background:rgba(236,76,140,.12)}
.kc-qc-explain{margin-top:10px;font-size:13px;color:var(--text-2)}
.kc-an{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-md);padding:16px 18px;margin:18px 0}
.kc-an-text{font-size:14px;color:var(--text);line-height:1.95}
.kc-an-mark{color:#7c5cf0;background:rgba(124,108,240,.14);border:none;border-bottom:2px solid #7c5cf0;border-radius:3px;padding:1px 4px}
.kc-an-note{margin-top:12px;padding:10px 14px;background:rgba(124,108,240,.14);border-radius:var(--r-sm);font-size:13px;color:var(--text-2)}
.kc-qd-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.kc-qd-cell{min-height:74px;display:flex;align-items:center;justify-content:center;text-align:center;padding:14px;border-radius:var(--r-md);border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text);font-size:13px;font-weight:600}
.kc-qd-axes{display:flex;flex-direction:column;gap:2px;margin-top:10px;font-size:11px;color:var(--text-3)}
.kc-qd-note{margin-top:10px;padding:10px 14px;background:rgba(124,108,240,.14);border-radius:var(--r-sm);font-size:13px;color:var(--text-2)}
.kc-tr{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-md);padding:16px 18px;margin:18px 0}
.kc-tr-caption{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);margin-bottom:12px}
.kc-tr-steps{display:flex;flex-direction:column;gap:8px}.kc-tr-step{display:flex;gap:10px;align-items:flex-start}
.kc-tr-badge{font-size:10px;text-transform:uppercase;padding:3px 8px;border-radius:var(--r-sm);color:#5a5cf0;background:rgba(124,108,240,.14);flex-shrink:0}
.kc-tr-label{font-size:13px;color:var(--text)}.kc-tr-detail{font-size:12px;color:var(--text-3);margin-top:2px}
.kc-tr-nav{display:flex;align-items:center;gap:8px;margin-top:14px;flex-wrap:wrap}.kc-tr-progress{font-size:12px;color:var(--text-3);margin-right:auto}
.kc-tok{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-md);padding:16px 18px;margin:18px 0}
.kc-tok-label{display:block;font-size:13px;color:var(--text-2);margin-bottom:8px}
.kc-tok-input{width:100%;font-size:16px;color:var(--text);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-sm);padding:10px 12px}
.kc-tok-out{display:flex;flex-wrap:wrap;gap:3px;margin:12px 0}
.kc-tok-chip{font-size:12px;padding:3px 5px;border-radius:4px;white-space:pre}
.kc-tok-lat{background:rgba(108,156,240,.16);color:#6c9cf0}.kc-tok-cyr{background:rgba(236,76,140,.14);color:#ec4c8c}
.kc-tok-num{background:rgba(230,169,43,.18);color:#e6a92b}.kc-tok-punct,.kc-tok-space{background:rgba(124,108,240,.14);color:var(--text-3)}
.kc-tok-other{background:rgba(124,92,240,.16);color:#7c5cf0}
.kc-tok-stats{font-size:13px;color:var(--text-2)}.kc-tok-stats strong{color:#7c5cf0}
.kc-tok-note{margin-top:10px;font-size:12px;color:var(--text-3)}
@media(max-width:600px){.cmp,.pron{grid-template-columns:1fr}.doc{padding:40px 18px 80px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
`;
