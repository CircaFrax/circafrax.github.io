/** CircaFrax EPROM - search.js v2 multi-mots */
const RESULTS = document.getElementById('results');
const STATS = document.getElementById('stats');
const DEBUG = document.getElementById('debug');
const Q = document.getElementById('q');

let FICHES = [];

function log(msg){ if(DEBUG) DEBUG.textContent += msg + "\n"; }

function render(list){
  RESULTS.innerHTML = '';
  if(!list.length){
    RESULTS.innerHTML = '<p>Aucune fiche pour cette recherche.</p>';
    STATS.textContent = `0 / ${FICHES.length} fiches`;
    return;
  }
  for(const f of list){
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between">
        <strong>${f.nom || f.id}</strong>
        <span class="score">${f.score||''}</span>
      </div>
      <div style="font-size:12px;color:#6b7280;margin:4px 0">${f.url||''}</div>
      <p style="font-size:13px;line-height:1.5">${f.resume||''}</p>
      <div style="margin-top:8px">${(f.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div style="margin-top:8px"><a href="fiches/${f.id}.json" target="_blank" style="font-size:11px">voir fiche JSON</a> • <a href="${f.url}" target="_blank" style="font-size:11px">ouvrir site</a></div>
    `;
    RESULTS.appendChild(div);
  }
  STATS.textContent = `${list.length} / ${FICHES.length} fiches`;
}

function filter(){
  const raw = (Q.value||'').toLowerCase().trim();
  if(!raw){ render(FICHES); return; }
  
  // coupe sur espaces ET virgules, enlève les mots vides
  const mots = raw.split(/[\s,]+/).filter(Boolean);
  
  const out = FICHES.filter(f=>{
    const hay = `${f.id} ${f.nom} ${f.resume} ${f.url} ${(f.tags||[]).join(' ')}`.toLowerCase();
    // ET logique : tous les mots doivent être présents
    return mots.every(m => hay.includes(m));
  });
  render(out);
  log(`recherche: "${raw}" → mots: [${mots.join(', ')}] → ${out.length} résultats`);
}

async function load(){
  log('Chargement fiches/index.json ...');
  try{
    const r = await fetch('./fiches/index.json?v=' + Date.now(), {cache:'no-store'});
    log(`fetch status: ${r.status}`);
    if(!r.ok) throw new Error('HTTP '+r.status);
    const data = await r.json();
    FICHES = Array.isArray(data) ? data : (data.fiches || []);
    log(`OK ${FICHES.length} fiches: ${FICHES.map(f=>f.id).join(', ')}`);
    render(FICHES);
  }catch(e){
    log('ERREUR: ' + e.message);
    STATS.textContent = 'Erreur chargement index.json — ' + e.message;
  }
}

Q.addEventListener('input', filter);
load();
