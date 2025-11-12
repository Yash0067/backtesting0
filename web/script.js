const API_BASE = 'http://127.0.0.1:8000';

const el = (id) => document.getElementById(id);
const show = (id, v=true) => el(id).classList.toggle('hidden', !v);

let lastBacktestId = null;
let tradesCsvUrl = null;
let metricsCsvUrl = null;
let tradesData = []; // parsed trades rows for table
let currentPage = 1;
const pageSize = 20;

// Charts
let equityChart = null;
let monthlyChart = null;

function formatBytes(bytes){
  if(bytes === 0) return '0 B';
  const k = 1024, sizes = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes)/Math.log(k));
  return (bytes/Math.pow(k,i)).toFixed(2)+' '+sizes[i];
}

function requiredColsPresent(cols){
  const lc = cols.map(c => c.trim().toLowerCase());
  const sets = [
    ['date_time','open','high','low','close'],
    ['datetime','open','high','low','close'],
    ['date time','open','high','low','close'],
  ];
  return sets.some(req => req.every(c => lc.includes(c)));
}

function renderPreviewTable(data){
  const table = el('preview-table');
  table.innerHTML = '';
  if(!data || !data.length) return;
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  data[0].forEach(h => {
    const th = document.createElement('th'); th.textContent = h; headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  const tbody = document.createElement('tbody');
  for(let i=1;i<data.length;i++){
    const tr = document.createElement('tr');
    data[i].forEach(v => { const td = document.createElement('td'); td.textContent = v; tr.appendChild(td);});
    tbody.appendChild(tr);
  }
  table.appendChild(thead); table.appendChild(tbody);
}

el('file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const info = el('file-info');
  tradesData = []; currentPage = 1; // reset
  if(!file){ info.textContent = ''; el('run').disabled = true; show('preview',false); return; }
  info.textContent = `${file.name} • ${formatBytes(file.size)}`;
  if(file.size > 220*1024*1024){
    info.textContent += ' — Too large (limit 220MB)';
    el('run').disabled = true;
    return;
  }
  Papa.parse(file, {
    header: false,
    preview: 11,
    complete: (res) => {
      const rows = res.data.filter(r=>r.length>1);
      if(rows.length){
        const headers = rows[0];
        if(!requiredColsPresent(headers)){
          info.textContent += ' — Missing required columns (date_time|datetime|"date time", open, high, low, close)';
          el('run').disabled = true; show('preview',false);
          return;
        }
        renderPreviewTable(rows);
        show('preview', true);
        el('run').disabled = false;
      }
    }
  });
});

function collectParams(){
  const pct = parseFloat(el('risk_percentage').value)/100.0;
  return {
    starting_balance: parseFloat(el('starting_balance').value),
    tp_ticks: parseInt(el('tp_ticks').value),
    sl_ticks: parseInt(el('sl_ticks').value),
    risk_percentage: pct,
    trailing_stop: el('trailing_stop').checked,
    trailing_stop_ticks: parseInt(el('trailing_stop_ticks').value),
    tick_size: parseFloat(el('tick_size').value),
    tick_value: parseFloat(el('tick_value').value),
    commission_per_trade: parseFloat(el('commission_per_trade').value),
    slippage_ticks: parseInt(el('slippage_ticks').value),
    contract_margin: parseFloat(el('contract_margin').value)
  };
}

function renderMetrics(m){
  const container = el('metrics');
  container.innerHTML = '';
  const asTiles = [
    ['Total Trades', m.total_trades],
    ['Win Rate', (m.win_rate*100).toFixed(2)+'%'],
    ['Total P&L', m.total_pnl.toFixed(2)],
    ['Average P&L', m.avg_pnl.toFixed(2)],
    ['Sharpe Ratio', m.sharpe_ratio.toFixed(2)],
    ['Max Drawdown', m.max_drawdown.toFixed(2)],
    ['Best Trade', m.best_trade.toFixed(2)],
    ['Worst Trade', m.worst_trade.toFixed(2)],
  ];
  asTiles.forEach(([k,v]) => {
    const div = document.createElement('div'); div.className='tile';
    div.innerHTML = `<div class="muted">${k}</div><div style="font-size:1.2em;">${v}</div>`;
    container.appendChild(div);
  });
}

function renderEquityChart(dates, balance){
  const ctx = el('equityChart');
  if(equityChart) equityChart.destroy();
  equityChart = new Chart(ctx, {
    type: 'line',
    data: { labels: dates, datasets: [{ label: 'Balance', data: balance, borderColor:'#2a6cf0', tension:0.1 }]},
    options: { scales: { x: { display: true}, y:{ display:true }}, plugins:{ legend:{display:false}}}
  });
}

function renderMonthlyChart(months, pnl){
  const ctx = el('monthlyChart');
  if(monthlyChart) monthlyChart.destroy();
  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: months, datasets: [{ label: 'PnL', data: pnl, backgroundColor: pnl.map(v=> v>=0?'#2dd36f':'#ef4444') }]},
    options: { plugins:{ legend:{display:false}} }
  });
}

function setDownloads(links){
  tradesCsvUrl = links.trades_csv ? (API_BASE + links.trades_csv) : null;
  metricsCsvUrl = links.metrics_csv ? (API_BASE + links.metrics_csv) : null;
  const btnT = el('download-trades');
  const btnM = el('download-metrics');
  btnT.disabled = !tradesCsvUrl; btnM.disabled = !metricsCsvUrl;
  btnT.onclick = ()=> tradesCsvUrl && window.open(tradesCsvUrl, '_blank');
  btnM.onclick = ()=> metricsCsvUrl && window.open(metricsCsvUrl, '_blank');
}

async function fetchBacktestDetail(id){
  const r = await fetch(`${API_BASE}/backtests/${id}`);
  if(!r.ok) throw new Error('Failed to fetch detail');
  return r.json();
}

function renderTradesTablePage(){
  const table = el('trades-table');
  table.innerHTML='';
  const start = (currentPage-1)*pageSize;
  const pageRows = tradesData.slice(start, start+pageSize);
  if(!pageRows.length){ table.innerHTML = '<tr><td>No trades loaded</td></tr>'; return; }
  const headers = Object.keys(pageRows[0]);
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  headers.forEach(h=>{ const th = document.createElement('th'); th.textContent=h; trh.appendChild(th)});
  thead.appendChild(trh);
  const tbody = document.createElement('tbody');
  pageRows.forEach(r=>{
    const tr = document.createElement('tr');
    headers.forEach(h=>{
      const td = document.createElement('td');
      td.textContent = r[h];
      if(h.toLowerCase().includes('p&l') || h.toLowerCase()==='pnl'){
        const v = parseFloat(r[h]);
        if(!isNaN(v)) td.style.color = v>=0 ? '#2dd36f' : '#ef4444';
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(thead); table.appendChild(tbody);
  el('page-info').textContent = `Page ${currentPage} / ${Math.max(1, Math.ceil(tradesData.length/pageSize))}`;
}

async function loadTradesCsvToTable(filterSide='both', filterPnl='all'){
  if(!tradesCsvUrl) return;
  const res = await fetch(tradesCsvUrl);
  const text = await res.text();
  const parsed = Papa.parse(text, { header: true });
  let rows = parsed.data.filter(r=>Object.keys(r).length>1);
  // Optional filtering
  if(filterSide !== 'both') rows = rows.filter(r => (r['Position']||'').toLowerCase() === filterSide);
  if(filterPnl === 'wins') rows = rows.filter(r => parseFloat(r['P&L']||r['PNL']||0) > 0);
  if(filterPnl === 'losses') rows = rows.filter(r => parseFloat(r['P&L']||r['PNL']||0) < 0);
  tradesData = rows;
  currentPage = 1;
  renderTradesTablePage();
}

el('prev-page').onclick = ()=>{ if(currentPage>1){ currentPage--; renderTradesTablePage(); }};
el('next-page').onclick = ()=>{ const maxp = Math.max(1, Math.ceil(tradesData.length/pageSize)); if(currentPage<maxp){ currentPage++; renderTradesTablePage(); }};
el('load-trades').onclick = ()=>{
  const side = el('side-filter').value; const pf = el('pnl-filter').value;
  loadTradesCsvToTable(side, pf);
};

el('upload-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const file = el('file').files[0];
  if(!file){ alert('Select a CSV file first'); return; }
  el('status').textContent = 'Uploading and running backtest...';
  el('run').disabled = true;

  const params = collectParams();
  const fd = new FormData();
  fd.append('file', file);
  fd.append('params_json', JSON.stringify(params));
  try{
    const r = await fetch(`${API_BASE}/backtests`, { method: 'POST', body: fd });
    if(!r.ok){ throw new Error(await r.text()); }
    const { id } = await r.json();
    lastBacktestId = id;
    el('status').textContent = 'Backtest completed. Loading results...';

    const detail = await fetchBacktestDetail(id);
    if(detail.status && detail.status !== 'completed'){
      el('status').textContent = `Status: ${detail.status}`;
      return;
    }

    // Render metrics & charts
    renderMetrics(detail.metrics);
    const ec = detail.chart_data?.equity_curve || { dates: [], balance: [] };
    renderEquityChart(ec.dates, ec.balance);
    const mr = detail.chart_data?.monthly_returns || { months: [], pnl: [] };
    renderMonthlyChart(mr.months, mr.pnl);

    // Downloads
    setDownloads(detail.download_links || {});

    // Show results section
    show('results', true);
    el('status').textContent = 'Done';
  }catch(err){
    console.error(err);
    el('status').textContent = 'Error: '+ err;
  }finally{
    el('run').disabled = false;
  }
});

/* ===== Chart Zoom (equityChart + monthlyChart) — auto-applied ===== */
(function () {
  const IDS = ["equityChart", "monthlyChart"]; // add/remove chart canvas IDs here
  const PLUGIN_SRC = "https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.1/dist/chartjs-plugin-zoom.umd.min.js";

  function loadPlugin(cb){
    if (window["chartjs-plugin-zoom"]) return cb();
    const s = document.createElement("script");
    s.src = PLUGIN_SRC;
    s.onload = cb;
    s.onerror = () => console.warn("[zoom] failed to load plugin");
    document.head.appendChild(s);
  }

  function registerZoom(){
    const Zoom = (window["chartjs-plugin-zoom"]?.default) || window["chartjs-plugin-zoom"];
    if (Zoom && !Chart.registry.plugins.get("zoom")) Chart.register(Zoom);
  }

  function applyZoomToId(id){
    const chart = Chart.getChart(id);
    if (!chart) return false;

    chart.options = chart.options || {};
    chart.options.interaction = chart.options.interaction || { mode: "index", intersect: false };
    chart.options.plugins = chart.options.plugins || {};
    chart.options.plugins.zoom = {
      zoom: {
        wheel: { enabled: true },   // mouse wheel / trackpad
        pinch: { enabled: true },   // touch pinch
        drag: { enabled: true },    // drag-rectangle to zoom
        mode: "xy"
      },
      pan: { enabled: true, mode: "xy" },
      limits: { x: { min: "original", max: "original" }, y: { min: "original", max: "original" } }
    };
    chart.update();

    // Double-click or press R to reset
    const canvas = document.getElementById(id);
    if (canvas && chart.resetZoom) {
      canvas.addEventListener("dblclick", () => chart.resetZoom());
      document.addEventListener("keydown", (e)=> (e.key === "r" || e.key === "R") && chart.resetZoom());
    }

    // Tiny + / − / Reset controls (auto-injected under each chart)
    injectControls(id);
    return true;
  }

  function injectControls(id){
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent || parent.querySelector(`.zoom-controls[data-for="${id}"]`)) return;

    if (!document.getElementById("zoom-controls-style")) {
      const st = document.createElement("style");
      st.id = "zoom-controls-style";
      st.textContent = `
        .zoom-controls{display:flex;gap:6px;margin-top:8px}
        .zoom-controls button{padding:6px 10px;border:1px solid rgba(148,163,184,.2);border-radius:10px;background:#0b1426;color:#e2e8f0;cursor:pointer}
        .zoom-controls button:hover{background:#0e1a34}
      `;
      document.head.appendChild(st);
    }

    const box = document.createElement("div");
    box.className = "zoom-controls";
    box.setAttribute("data-for", id);
    box.innerHTML = `
      <button data-act="in">+</button>
      <button data-act="out">-</button>
      <button data-act="reset">Reset</button>
    `;
    parent.appendChild(box);

    box.addEventListener("click", (e)=>{
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;
      const chart = Chart.getChart(id);
      if (!chart) return;
      const act = btn.dataset.act;
      if (act === "reset" && chart.resetZoom) chart.resetZoom();
      if (act === "in") chart.zoom(1.2);
      if (act === "out") chart.zoom(0.8);
    });
  }

  function applyAll(){
    registerZoom();
    let appliedAny = false;
    IDS.forEach(id => { appliedAny = applyZoomToId(id) || appliedAny; });
    return appliedAny;
  }

  function init(){
    loadPlugin(() => {
      if (applyAll()) return;
      // Poll briefly until charts exist
      let tries = 0;
      const iv = setInterval(() => {
        tries++;
        if (applyAll() || tries > 80) clearInterval(iv); // ~20s max
      }, 250);
    });
  }

  // Re-run if your app recreates charts later
  const mo = new MutationObserver(() => init());
  mo.observe(document.body, { childList: true, subtree: true });

  init();
})();
