// ================================================================
// TibiaVault — Application Logic
// Dual API: TibiaData (live) + TibiaWiki (rich creature data)
// ================================================================
const API = 'https://api.tibiadata.com/v4';
const WIKI_API = 'https://tibiawiki.dev/api';
const MAP_URL = f => `https://tibiamaps.github.io/tibia-map-data/floor-${String(f).padStart(2,'0')}-map.png`;
const MAP_W = 2560, MAP_H = 2048;
const MAP_X0 = 31744, MAP_X1 = 34304, MAP_Y0 = 30976, MAP_Y1 = 33024;
const PER_PAGE = 60;
const VOC_SHORT = {knight:'EK',paladin:'RP',sorcerer:'MS',druid:'ED',monk:'MO'};
const vocAbbr = v => VOC_SHORT[v] || v.substring(0,2).toUpperCase();

// Caches
const cache = { creatures: null, creatureDetail: {}, wikiDetail: {}, spells: null, worlds: null, news: null };

// State
const state = {
  panel: 'news', bestiary: { list: [], filtered: [], page: 0, search: '', detail: null },
  hunting: { voc: 'all', levelMin: 0, levelMax: 9999, myVoc: 'knight', myLevel: 150, huntMode: 'solo' },
  equip: { voc: 'knight', bracket: '8-30' },
  quests: { search: '', level: 0, premium: 'all' },
  spells: { voc: 'all', type: 'all', search: '' },
  worlds: { search: '', sort: 'name', asc: true },
  map: null, mapFloor: 7
};

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGlobalSearch();
  loadBoosted();
  showPanel('news');
});

// ================================================================
// NAVIGATION
// ================================================================
function initNav() {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => showPanel(el.dataset.panel));
  });
}

function showPanel(id) {
  state.panel = id;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.panel === id));
  document.querySelectorAll('.panel').forEach(el => el.classList.toggle('active', el.id === 'p-' + id));
  const loaders = {
    news: loadNews, bestiary: loadBestiary, hunting: initHuntingPanel,
    equipment: renderEquipment, quests: renderQuests, spells: loadSpells,
    map: initMap, character: () => {}, worlds: loadWorlds, calculators: initCalcs
  };
  if (loaders[id]) loaders[id]();
}

// ================================================================
// GLOBAL SEARCH
// ================================================================
function initGlobalSearch() {
  const input = document.getElementById('globalSearch');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim().toLowerCase();
      if (!q) return;
      // Try creature first
      if (cache.creatures) {
        const found = cache.creatures.find(c => c.name.toLowerCase() === q);
        if (found) { showPanel('bestiary'); setTimeout(() => showCreatureDetail(found.name), 300); return; }
      }
      // Try quest
      const quest = QUESTS.find(qst => qst.name.toLowerCase().includes(q));
      if (quest) { showPanel('quests'); return; }
      // Default to bestiary search
      showPanel('bestiary');
      state.bestiary.search = q;
      const si = document.getElementById('bestiarySearch');
      if (si) si.value = q;
      filterBestiary();
    }
  });
}

// ================================================================
// BOOSTED CREATURE & BOSS
// ================================================================
async function loadBoosted() {
  try {
    const [crRes, bossRes] = await Promise.all([
      fetch(`${API}/creatures`).then(r => r.json()),
      fetch(`${API}/boostablebosses`).then(r => r.json())
    ]);
    const bc = crRes?.creatures?.boosted;
    const bb = bossRes?.boostablebosses?.boosted;
    if (bc) {
      document.getElementById('boostedCreature').innerHTML =
        `<img src="${WIKI_IMG(bc.name)}" alt="${bc.name}" onerror="this.src='${TIBIA_IMG(bc.race || bc.name)}'">` +
        `<div class="boosted-info"><span class="blabel">Boosted</span><span class="bname" title="${bc.name}">${bc.name}</span></div>`;
    }
    if (bb) {
      document.getElementById('boostedBoss').innerHTML =
        `<img src="${WIKI_IMG(bb.name)}" alt="${bb.name}" onerror="this.src='${TIBIA_IMG(bb.name)}'">` +
        `<div class="boosted-info"><span class="blabel">Boss</span><span class="bname" title="${bb.name}">${bb.name}</span></div>`;
    }
    // Also update news sidebar widgets
    if (bc) {
      const nbc = document.getElementById('newsBoostedCreature');
      if (nbc) nbc.innerHTML = `<img src="${WIKI_IMG(bc.name)}" alt="${bc.name}" class="timg-lg" style="margin:0 auto 6px" onerror="this.src='${TIBIA_IMG(bc.race || bc.name)}'"><div class="bn">${bc.name}</div>`;
    }
    if (bb) {
      const nbb = document.getElementById('newsBoostedBoss');
      if (nbb) nbb.innerHTML = `<img src="${WIKI_IMG(bb.name)}" alt="${bb.name}" class="timg-lg" style="margin:0 auto 6px" onerror="this.src='${TIBIA_IMG(bb.name)}'"><div class="bn">${bb.name}</div>`;
    }
  } catch (e) { console.warn('Boosted load failed:', e); }
}

// ================================================================
// NEWS
// ================================================================
async function loadNews() {
  const container = document.getElementById('newsList');
  if (!container) return;
  if (cache.news) { renderNews(cache.news); return; }
  container.innerHTML = '<div class="loading"><span class="spinner"></span> Loading news...</div>';
  try {
    const res = await fetch(`${API}/news/latest`).then(r => r.json());
    cache.news = res?.news || [];
    renderNews(cache.news);
  } catch (e) { container.innerHTML = '<div class="empty">Failed to load news. Try refreshing.</div>'; }
}

function renderNews(items) {
  const container = document.getElementById('newsList');
  if (!items.length) { container.innerHTML = '<div class="empty">No news available.</div>'; return; }
  container.innerHTML = items.slice(0, 15).map(n => `
    <div class="news-item" data-id="${n.id}" onclick="toggleNews(this, ${n.id})">
      <div class="news-head">
        <span class="badge bg-gold">${n.category || 'news'}</span>
        <span class="news-date">${n.date || ''}</span>
      </div>
      <div class="news-title">${esc(n.news || n.title || 'Untitled')}</div>
      <div class="news-preview">${esc((n.news || n.content || '').substring(0, 120))}...</div>
      <div class="news-body"></div>
    </div>`).join('');
}

async function toggleNews(el, id) {
  if (el.classList.contains('expanded')) { el.classList.remove('expanded'); return; }
  const body = el.querySelector('.news-body');
  if (!body.innerHTML) {
    body.innerHTML = '<span class="spinner"></span>';
    try {
      const res = await fetch(`${API}/news/id/${id}`).then(r => r.json());
      body.innerHTML = res?.news?.content_html || res?.news?.content || 'No content available.';
    } catch (e) { body.innerHTML = 'Failed to load full article.'; }
  }
  el.classList.add('expanded');
}

// ================================================================
// BESTIARY
// ================================================================
async function loadBestiary() {
  if (state.bestiary.detail) return;
  const grid = document.getElementById('bestiaryGrid');
  if (!grid) return;
  if (cache.creatures) { filterBestiary(); return; }
  grid.innerHTML = '<div class="loading"><span class="spinner"></span> Loading creatures...</div>';
  try {
    const res = await fetch(`${API}/creatures`).then(r => r.json());
    const list = (res?.creatures?.creature_list || []).map(c => ({ name: c.name, race: c.race }));
    list.sort((a, b) => a.name.localeCompare(b.name));
    cache.creatures = list;
    state.bestiary.list = list;
    state.bestiary.filtered = list;
    filterBestiary();
  } catch (e) { grid.innerHTML = '<div class="empty">Failed to load creatures.</div>'; }
}

function filterBestiary() {
  const q = state.bestiary.search.toLowerCase();
  state.bestiary.filtered = state.bestiary.list.filter(c => c.name.toLowerCase().includes(q));
  state.bestiary.page = 0;
  renderBestiaryPage();
}

function renderBestiaryPage() {
  const { filtered, page } = state.bestiary;
  const grid = document.getElementById('bestiaryGrid');
  const start = page * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  grid.innerHTML = pageItems.map(c => `
    <div class="cc" onclick="showCreatureDetail('${esc(c.name)}')">
      <img src="${WIKI_IMG(c.name)}" alt="${esc(c.name)}" class="timg" onerror="this.src='${TIBIA_IMG(c.race || c.name)}'">
      <div class="cn" title="${esc(c.name)}">${esc(c.name)}</div>
    </div>`).join('');

  document.getElementById('bestiaryCount').textContent = `${filtered.length} creatures`;
  const pagEl = document.getElementById('bestiaryPag');
  if (totalPages <= 1) { pagEl.innerHTML = ''; return; }
  let pag = `<button class="pg" onclick="bestiaryPage(${page - 1})" ${page === 0 ? 'disabled' : ''}>&lt;</button>`;
  for (let i = 0; i < totalPages; i++) {
    if (totalPages > 10 && Math.abs(i - page) > 2 && i !== 0 && i !== totalPages - 1) {
      if (i === 1 && page > 3) pag += '<span class="pg">...</span>';
      if (i === totalPages - 2 && page < totalPages - 4) pag += '<span class="pg">...</span>';
      continue;
    }
    pag += `<button class="pg ${i === page ? 'active' : ''}" onclick="bestiaryPage(${i})">${i + 1}</button>`;
  }
  pag += `<button class="pg" onclick="bestiaryPage(${page + 1})" ${page >= totalPages - 1 ? 'disabled' : ''}>&gt;</button>`;
  pagEl.innerHTML = pag;
}

function bestiaryPage(p) {
  const totalPages = Math.ceil(state.bestiary.filtered.length / PER_PAGE);
  if (p < 0 || p >= totalPages) return;
  state.bestiary.page = p;
  renderBestiaryPage();
  document.getElementById('bestiaryGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ================================================================
// CREATURE DETAIL
// ================================================================
async function showCreatureDetail(name) {
  state.bestiary.detail = name;
  document.getElementById('bestiaryList').style.display = 'none';
  const cd = document.getElementById('creatureDetail');
  cd.classList.add('active');
  cd.innerHTML = '<div class="loading"><span class="spinner"></span> Loading creature data...</div>';

  const [tibiaData, wikiData] = await Promise.all([
    fetchCreatureData(name),
    fetchWikiCreature(name)
  ]);

  const d = tibiaData || {};
  const w = wikiData || {};
  const hp = w.hitpoints || d.hitpoints || '?';
  const xp = w.experiencepoints || d.experience_points || '?';
  const armor = w.armor || '?';
  const speed = w.speed || '?';
  const img = WIKI_IMG(name);
  const fallback = TIBIA_IMG(d.race || name);

  let html = `
    <button class="cd-back" onclick="backToBestiary()">&#9664; Back to Bestiary</button>
    <div class="cd-top">
      <div class="cd-sprite"><img src="${img}" alt="${esc(name)}" onerror="this.src='${fallback}'"></div>
      <div class="cd-info">
        <h3>${esc(name)}</h3>
        <p class="cd-desc">${esc(w.bestiaryclass || d.description || '')}</p>
      </div>
    </div>
    <div class="cd-stats">
      <div class="cd-stat"><div class="v">${formatNum(hp)}</div><div class="l">Hit Points</div></div>
      <div class="cd-stat"><div class="v">${formatNum(xp)}</div><div class="l">Experience</div></div>
      <div class="cd-stat"><div class="v">${armor}</div><div class="l">Armor</div></div>
      <div class="cd-stat"><div class="v">${speed}</div><div class="l">Speed</div></div>
      <div class="cd-stat"><div class="v">${w.isboss === true ? 'Yes' : 'No'}</div><div class="l">Boss</div></div>
    </div>`;

  // Resistances
  html += renderResistances(w);

  // Abilities
  if (w.abilities) {
    html += `<div class="cd-sec"><h4>Abilities</h4><p style="font-size:13px;color:var(--parch-dim);line-height:1.6">${esc(w.abilities)}</p></div>`;
  }

  // Loot
  html += renderLoot(w);

  // Location
  if (w.location) {
    html += `<div class="cd-sec"><h4>Location</h4><p style="font-size:13px;color:var(--parch-dim)">${esc(w.location)}</p></div>`;
  }

  // Behavior
  let behavior = [];
  if (d.immune_to?.length) behavior.push(`<strong>Immune:</strong> ${d.immune_to.join(', ')}`);
  if (d.strong_against?.length) behavior.push(`<strong>Strong vs:</strong> ${d.strong_against.join(', ')}`);
  if (d.weakness?.length) behavior.push(`<strong>Weak vs:</strong> ${d.weakness.join(', ')}`);
  if (d.be_convinced !== undefined) behavior.push(`<strong>Convinceable:</strong> ${d.be_convinced ? 'Yes' : 'No'}`);
  if (d.be_summoned !== undefined) behavior.push(`<strong>Summonable:</strong> ${d.be_summoned ? 'Yes' : 'No'}`);
  if (behavior.length) {
    html += `<div class="cd-sec"><h4>Behavior</h4><div style="font-size:12px;color:var(--parch-dim);line-height:1.8">${behavior.join('<br>')}</div></div>`;
  }

  cd.innerHTML = html;
}

function backToBestiary() {
  state.bestiary.detail = null;
  document.getElementById('bestiaryList').style.display = '';
  const cd = document.getElementById('creatureDetail');
  cd.classList.remove('active');
  cd.innerHTML = '';
}

function renderResistances(w) {
  const fields = [
    { key: 'physicalDmgMod', name: 'Physical', css: 'physical', abbr: 'Phy' },
    { key: 'fireDmgMod', name: 'Fire', css: 'fire', abbr: 'Fir' },
    { key: 'iceDmgMod', name: 'Ice', css: 'ice', abbr: 'Ice' },
    { key: 'energyDmgMod', name: 'Energy', css: 'energy', abbr: 'Ene' },
    { key: 'earthDmgMod', name: 'Earth', css: 'earth', abbr: 'Ear' },
    { key: 'holyDmgMod', name: 'Holy', css: 'holy', abbr: 'Hol' },
    { key: 'deathDmgMod', name: 'Death', css: 'death', abbr: 'Dea' },
    { key: 'drownDmgMod', name: 'Drown', css: 'drown', abbr: 'Drw' },
    { key: 'hpDrainDmgMod', name: 'Life Drain', css: 'lifedrain', abbr: 'HP' },
    { key: 'healMod', name: 'Heal', css: 'manadrain', abbr: 'Hea' }
  ];
  const hasRes = fields.some(f => w[f.key] !== undefined && w[f.key] !== null);
  if (!hasRes) return '';

  let html = '<div class="cd-sec"><h4>Elemental Resistances</h4><div class="res-grid">';
  fields.forEach(f => {
    const val = w[f.key];
    if (val === undefined || val === null) return;
    const pct = typeof val === 'number' ? val : parseInt(val) || 100;
    let cls = 'res-neutral';
    if (pct === 0) cls = 'res-immune';
    else if (pct < 100) cls = 'res-strong';
    else if (pct > 100) cls = 'res-weak';
    const label = pct === 0 ? 'Immune' : pct + '%';
    html += `<div class="res-item ${cls}"><span class="elem elem-${f.css}">${f.abbr}</span><div class="res-info"><div class="rn">${f.name}</div><div class="rv">${label}</div></div></div>`;
  });
  html += '</div></div>';
  return html;
}

function renderLoot(w) {
  const loot = w.loot || w.lootlist;
  if (!loot || !loot.length) return '';

  const rarityMap = {
    'always': 'common', 'common': 'common', 'uncommon': 'uncommon',
    'semi-rare': 'semi-rare', 'semi rare': 'semi-rare', 'rare': 'rare',
    'very rare': 'very-rare', 'very_rare': 'very-rare'
  };

  let html = '<div class="cd-sec"><h4>Loot</h4><div class="loot-grid">';
  loot.forEach(item => {
    const name = item.itemName || item.name || item.item || 'Unknown';
    const amount = item.amount || '';
    const rarity = item.rarity || 'common';
    const rcls = rarityMap[rarity.toLowerCase()] || 'common';
    html += `<div class="loot-card loot-${rcls}">
      <img src="${WIKI_IMG(name)}" alt="${esc(name)}" onerror="this.style.display='none'">
      <span class="loot-name">${esc(name)}</span>
      ${amount ? `<span class="loot-amount">×${amount}</span>` : ''}
      <span class="lr lr-${rcls}">${esc(rarity)}</span>
    </div>`;
  });
  html += '</div></div>';
  return html;
}

async function fetchCreatureData(name) {
  if (cache.creatureDetail[name]) return cache.creatureDetail[name];
  try {
    const res = await fetch(`${API}/creature/${encodeURIComponent(name.toLowerCase().replace(/ /g, '+'))}`).then(r => r.json());
    const d = res?.creature || res?.creatures || {};
    cache.creatureDetail[name] = d;
    return d;
  } catch (e) { return null; }
}

async function fetchWikiCreature(name) {
  if (cache.wikiDetail[name]) return cache.wikiDetail[name];
  try {
    const res = await fetch(`${WIKI_API}/creatures/${encodeURIComponent(name)}`).then(r => r.json());
    cache.wikiDetail[name] = res || {};
    return res;
  } catch (e) {
    // Fallback: try with different casing
    try {
      const res2 = await fetch(`${WIKI_API}/creatures/${encodeURIComponent(name.toLowerCase())}`).then(r => r.json());
      cache.wikiDetail[name] = res2 || {};
      return res2;
    } catch (e2) { return {}; }
  }
}

// ================================================================
// HUNTING SYSTEM — Panel Init & Welcome
// ================================================================
function initHuntingPanel() {
  // Load saved build from localStorage
  const saved = localStorage.getItem('tv_build');
  if (saved) {
    try {
      const b = JSON.parse(saved);
      if (b.voc) state.hunting.myVoc = b.voc;
      if (b.level) state.hunting.myLevel = b.level;
      // Update UI to match saved build
      document.querySelectorAll('.my-build .bv').forEach(btn => {
        const voc = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
        btn.classList.toggle('active', voc === state.hunting.myVoc);
      });
      const lvlInput = document.getElementById('myLevel');
      if (lvlInput) lvlInput.value = state.hunting.myLevel;
      const nameInput = document.getElementById('myCharName');
      if (nameInput && b.name) nameInput.value = b.name;
      if (b.name) {
        // Show cached data immediately (instant, no flicker)
        const savedCh = { name: b.name, world: b.world, vocation: b.voc, level: b.level, guild: { name: b.guild }, achievement_points: b.achiev, last_login: b.lastLogin, account_status: b.acctStatus, residence: b.residence, sex: b.sex };
        const savedAcct = { created: b.acctCreated, loyalty_title: b.loyalty };
        updateBuildCharInfo(savedCh, savedAcct, null, b.otherChars || []);
        // Auto-refresh with live API data in background
        lookupMyBuild();
      }
    } catch(e) {}
  }

  // Check if CTA was closed
  if (localStorage.getItem('tv_cta_closed') === '1') {
    const cta = document.getElementById('huntCta');
    if (cta) cta.style.display = 'none';
  }

  // Show welcome modal if first visit
  if (!localStorage.getItem('tv_build')) {
    const w = document.getElementById('huntWelcome');
    if (w) w.style.display = 'flex';
  }

  renderHunting();
}

function hwPickVoc(btn) {
  document.querySelectorAll('.hw-voc').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function hwSave() {
  const name = document.getElementById('hwName')?.value.trim() || '';
  const level = parseInt(document.getElementById('hwLevel')?.value) || 150;
  const vocBtn = document.querySelector('.hw-voc.active');
  const voc = vocBtn ? vocBtn.dataset.voc : 'knight';

  // Save to localStorage
  localStorage.setItem('tv_build', JSON.stringify({ name, level, voc }));

  // Apply to state
  state.hunting.myVoc = voc;
  state.hunting.myLevel = level;

  // Update My Build bar
  document.querySelectorAll('.my-build .bv').forEach(btn => {
    const v = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
    btn.classList.toggle('active', v === voc);
  });
  const lvlInput = document.getElementById('myLevel');
  if (lvlInput) lvlInput.value = level;
  const nameInput = document.getElementById('myCharName');
  if (nameInput && name) nameInput.value = name;

  // Hide welcome
  const w = document.getElementById('huntWelcome');
  if (w) w.style.display = 'none';

  renderHunting();

  // Auto-lookup if name was entered
  if (name) lookupMyBuild();
}

function hwSkip() {
  // Save default so modal doesn't show again
  localStorage.setItem('tv_build', JSON.stringify({ name: '', level: 150, voc: 'knight' }));
  const w = document.getElementById('huntWelcome');
  if (w) w.style.display = 'none';
  renderHunting();
}

async function lookupMyBuild() {
  const nameInput = document.getElementById('myCharName');
  const name = nameInput.value.trim();
  if (!name) return;

  const btn = nameInput.nextElementSibling;
  const origText = btn.textContent;
  btn.textContent = '...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/character/${encodeURIComponent(name)}`);
    const data = await res.json();
    const ch = data?.character?.character;
    if (!ch || !ch.name) {
      nameInput.style.borderColor = '#ef4444';
      setTimeout(() => nameInput.style.borderColor = '', 1500);
      return;
    }

    const vocMap = {
      'knight': 'knight', 'elite knight': 'knight',
      'paladin': 'paladin', 'royal paladin': 'paladin',
      'sorcerer': 'sorcerer', 'master sorcerer': 'sorcerer',
      'druid': 'druid', 'elder druid': 'druid',
      'monk': 'monk'
    };
    const voc = vocMap[ch.vocation.toLowerCase()] || 'knight';
    const level = ch.level || 150;

    state.hunting.myVoc = voc;
    state.hunting.myLevel = level;
    document.getElementById('myLevel').value = level;
    nameInput.value = ch.name; // Use official casing
    document.querySelectorAll('.my-build .bv').forEach(b => {
      const v = b.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
      b.classList.toggle('active', v === voc);
    });

    const acct = data?.character?.account_information;
    const otherChars = data?.character?.other_characters || [];
    localStorage.setItem('tv_build', JSON.stringify({ name: ch.name, level, voc, world: ch.world, guild: ch.guild?.name, achiev: ch.achievement_points, lastLogin: ch.last_login, acctCreated: acct?.created, loyalty: acct?.loyalty_title, acctStatus: ch.account_status, residence: ch.residence, sex: ch.sex, otherChars }));
    // Fetch world data in background
    let worldData = null;
    try {
      const wRes = await fetch(`${API}/world/${encodeURIComponent(ch.world)}`);
      const wJson = await wRes.json();
      worldData = wJson?.world;
    } catch(e) {}
    updateBuildCharInfo(ch, acct, worldData, otherChars);
    nameInput.style.borderColor = '#22c55e';
    setTimeout(() => nameInput.style.borderColor = '', 1500);
    renderHunting();
  } catch (e) {
    nameInput.style.borderColor = '#ef4444';
    setTimeout(() => nameInput.style.borderColor = '', 1500);
  } finally {
    btn.textContent = origText;
    btn.disabled = false;
  }
}

function switchToAlt(name) {
  const input = document.getElementById('myCharName');
  if (input) input.value = name;
  lookupMyBuild();
}

function getVocItemUrl(voc) {
  const items = {
    knight: 'Magic_Plate_Armor.gif',
    paladin: 'Royal_Crossbow.gif',
    sorcerer: 'Wand_of_Inferno.gif',
    druid: 'Hailstorm_Rod.gif',
    monk: null
  };
  const vocKey = (voc || 'knight').toLowerCase().replace('elite ','').replace('royal ','').replace('master ','').replace('elder ','');
  const file = items[vocKey];
  if (!file) return 'https://tibiopedia.pl/images/static/items/traditional_sai.gif';
  return `https://tibia.fandom.com/wiki/Special:Redirect/file/${file}`;
}

function updateBuildCharInfo(ch, acct, worldData, otherChars) {
  const el = document.getElementById('biChar');
  if (!el) return;
  // Show the info panel
  const panel = document.getElementById('buildInfo');
  if (panel) panel.classList.add('visible');
  const login = ch.last_login ? new Date(ch.last_login).toLocaleDateString() : '?';
  const created = acct?.created ? new Date(acct.created).toLocaleDateString() : '?';
  const loyalty = acct?.loyalty_title || '—';
  const status = ch.account_status || '?';
  const itemUrl = getVocItemUrl(ch.vocation);
  let html = `<div class="bi-char-header">
    <img class="bi-voc-icon" src="${itemUrl}" alt="" onerror="this.style.display='none'">
    <div class="bi-char-name-block">
      <div class="bi-fv" style="font-size:15px;color:var(--gold-light)">${esc(ch.name)}</div>
      <div style="font-size:11px;color:var(--parch-dim)">Level ${ch.level} ${esc(ch.vocation)} — ${esc(ch.world)}</div>
      <div style="font-size:10px;color:var(--parch-dim)">${esc(status)} · ${esc(loyalty)}</div>
    </div>
  </div>
  <div class="bi-char-grid">
    <div class="bi-char-field"><span class="bi-fl">Guild</span><span class="bi-fv">${esc(ch.guild?.name || 'None')}</span></div>
    <div class="bi-char-field"><span class="bi-fl">Residence</span><span class="bi-fv">${esc(ch.residence || '?')}</span></div>
    <div class="bi-char-field"><span class="bi-fl">Achiev. Points</span><span class="bi-fv">${ch.achievement_points || 0}</span></div>
    <div class="bi-char-field"><span class="bi-fl">Registered</span><span class="bi-fv">${created}</span></div>
    <div class="bi-char-field"><span class="bi-fl">Last Login</span><span class="bi-fv">${login}</span></div>
    <div class="bi-char-field"><span class="bi-fl">Sex</span><span class="bi-fv">${esc(ch.sex || '?')}</span></div>
  </div>`;
  // Other characters (compact chips)
  const others = (otherChars || []).filter(c => c.name !== ch.name && !c.deleted);
  if (others.length > 0) {
    html += `<div class="bi-divider"></div>
    <div class="bi-section-label">Other Characters (${others.length}) <span style="font-family:'Crimson Text',serif;font-weight:400;font-size:9px;color:var(--parch-dim);letter-spacing:0;text-transform:none">· hidden characters are not shown</span></div>
    <div class="bi-alts">${others.map(c => {
      const n = esc(c.name).replace(/'/g,"\\'");
      return `<span class="bi-alt${c.status === 'online' ? ' bi-alt-on' : ''}" title="${esc(c.world)} — click to switch" onclick="switchToAlt('${n}')">${esc(c.name)} <span class="bi-alt-w">${esc(c.world)}</span></span>`;
    }).join('')}</div>`;
  }
  if (worldData) {
    const w = worldData;
    html += `<div class="bi-divider"></div>
    <div class="bi-section-label">World: ${esc(ch.world)}</div>
    <div class="bi-char-grid">
      <div class="bi-char-field"><span class="bi-fl">Players Online</span><span class="bi-fv bi-online">${w.players_online}</span></div>
      <div class="bi-char-field"><span class="bi-fl">PvP Type</span><span class="bi-fv">${esc(w.pvp_type)}</span></div>
      <div class="bi-char-field"><span class="bi-fl">Server Location</span><span class="bi-fv">${esc(w.location)}</span></div>
      <div class="bi-char-field"><span class="bi-fl">BattlEye</span><span class="bi-fv">${w.battleye_protected ? 'Yes' : 'No'}</span></div>
      <div class="bi-char-field"><span class="bi-fl">Transfer</span><span class="bi-fv">${esc(w.transfer_type)}</span></div>
      <div class="bi-char-field"><span class="bi-fl">Online Record</span><span class="bi-fv">${w.record_players}</span></div>
    </div>`;
  }
  el.innerHTML = html;
}

function updateBuildStats() {
  const { myVoc, myLevel, huntMode } = state.hunting;
  const modeSpots = HUNTING_SPOTS.filter(s => getHuntModeRange(s, huntMode));
  const total = modeSpots.length;
  const forLevel = modeSpots.filter(s => {
    const r = getHuntModeRange(s, huntMode);
    return r && myLevel >= r[0] - 20 && myLevel <= r[1] + 50;
  }).length;
  const verified = modeSpots.filter(s => s.verified).length;
  const vocMatch = modeSpots.filter(s => s.voc.includes(myVoc)).length;
  const el = id => document.getElementById(id);
  if (el('biTotal')) el('biTotal').textContent = total;
  if (el('biForYou')) el('biForYou').textContent = forLevel;
  if (el('biVerified')) el('biVerified').textContent = verified;
  if (el('biVocMatch')) el('biVocMatch').textContent = vocMatch;
}

// ================================================================
// HUNTING SPOTS — tibiaroute.com style
// ================================================================
function setMyVoc(btn, voc) {
  state.hunting.myVoc = voc;
  btn.parentElement.querySelectorAll('.bv').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderHunting();
}

function setHuntVoc(btn, voc) {
  state.hunting.voc = voc;
  btn.parentElement.querySelectorAll('.fb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderHunting();
}

function getGearForVocLevel(voc, level) {
  const tiers = VOCATION_GEAR[voc];
  if (!tiers) return null;
  return tiers.find(t => level >= t.min && level <= t.max) || tiers[tiers.length - 1];
}

// Rating system — localStorage-based
function getSpotRating(name) {
  return parseInt(localStorage.getItem('tp_rate_' + name.replace(/\W/g, '_'))) || 0;
}
function setSpotRating(name, rating) {
  localStorage.setItem('tp_rate_' + name.replace(/\W/g, '_'), rating);
  // Update stars in modal if open
  const modalContent = document.getElementById('huntModalContent');
  if (modalContent) {
    const ratingContainer = modalContent.querySelector('.spot-rating');
    if (ratingContainer) {
      const stars = ratingContainer.querySelectorAll('.rate-star');
      stars.forEach((star, i) => star.classList.toggle('filled', i < rating));
      const label = ratingContainer.querySelector('.rate-label');
      if (label) label.textContent = rating ? rating + '/10' : 'Rate';
    }
  }
  // Also re-render the grid cards to update their star displays
  renderHunting();
}
function renderStars(name) {
  const current = getSpotRating(name);
  const jsName = name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
  let html = '<div class="spot-rating">';
  for (let i = 1; i <= 10; i++) {
    html += `<span class="rate-star ${i <= current ? 'filled' : ''}" onclick="event.stopPropagation();setSpotRating('${jsName}',${i})" title="${i}/10">★</span>`;
  }
  html += `<span class="rate-label">${current ? current + '/10' : 'Rate'}</span></div>`;
  return html;
}

let _filteredSpots = [];

function renderHunting() {
  const container = document.getElementById('huntingGrid');
  if (!container) return;
  const { voc, levelMin, levelMax, myLevel, huntMode } = state.hunting;
  const filtered = HUNTING_SPOTS.map((s, origIdx) => ({ ...s, _origIdx: origIdx })).filter(s => {
    // Hunt mode filter
    const modeRange = getHuntModeRange(s, huntMode);
    if (!modeRange) return false;
    if (voc !== 'all') {
      let matchVoc = s.voc.includes(voc);
      if (!matchVoc && voc === 'monk') matchVoc = s.voc.includes('knight');
      if (!matchVoc) return false;
    }
    // Use mode-specific range for level filtering
    const lvl = modeRange;
    if (lvl[0] > levelMax || lvl[1] < levelMin) return false;
    if (myLevel > 0 && (myLevel < lvl[0] - 20 || myLevel > lvl[1] + 50)) return false;
    return true;
  });

  _filteredSpots = filtered;
  document.getElementById('huntCount').textContent = `${filtered.length} spots`;
  updateBuildStats();

  container.innerHTML = filtered.length ? '<div class="hunt-grid">' + filtered.map((s, idx) => {
    const vocBadges = s.voc.map(v => `<span class="hunt-voc">${vocAbbr(v)}</span>`).join('');
    const mainCreature = s.creatures[0] ? (typeof s.creatures[0]==='string'?s.creatures[0]:s.creatures[0].name) : '';
    const rating = getSpotRating(s.name);
    const jsName = s.name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    const modeRange = getHuntModeRange(s, huntMode);
    const modeBadges = ['solo','duo','team'].filter(m => s.huntModes?.[m]).map(m => `<span class="hunt-mode-badge hunt-mode-${m}">${m}</span>`).join('');

    // Stars (non-interactive on card, just display)
    let starsHtml = '<div class="spot-rating">';
    for (let i = 1; i <= 10; i++) starsHtml += `<span class="rate-star ${i <= rating ? 'filled' : ''}">★</span>`;
    starsHtml += `<span class="rate-label">${rating ? rating + '/10' : ''}</span></div>`;

    return `<div class="hunt-card" onclick="openHuntModal(${idx})">
      <div class="hunt-card-header">
        ${mainCreature ? `<img src="${WIKI_IMG(mainCreature)}" alt="${esc(mainCreature)}" onerror="this.style.display='none'">` : ''}
        <div class="hunt-card-hinfo">
          <div class="hc-name">${esc(s.name)}</div>
          <div class="hc-city">${esc(s.city || '')}</div>
        </div>
      </div>
      <div class="hunt-card-meta">
        <div class="hunt-vocs">${vocBadges}</div>
        <span class="hunt-lvl">${modeRange ? modeRange[0]+'-'+modeRange[1] : s.level[0]+'-'+s.level[1]}</span>
        ${modeBadges}
        ${s.verified ? '<span class="hunt-verified verified">✓ Verified</span>' : '<span class="hunt-verified unverified">⚠ Unverified</span>'}
      </div>
      <div class="hunt-card-stats">
        <div class="hunt-card-stat"><span class="hcs-val">${s.expH || '?'}</span><span class="hcs-label">EXP/h</span></div>
        <div class="hunt-card-stat"><span class="hcs-val">${s.profitH || '?'}</span><span class="hcs-label">Profit/h</span></div>
      </div>
      <div class="hunt-card-creatures">${s.creatures.slice(0,5).map(c=>{const cn=typeof c==='string'?c:c.name;return`<img src="${WIKI_IMG(cn)}" alt="${esc(cn)}" title="${esc(cn)}" onerror="this.style.display='none'">`}).join('')}${s.creatures.length > 5 ? `<span class="hcc-more">+${s.creatures.length-5}</span>` : ''}</div>
      <div class="hunt-card-rating">${starsHtml}</div>
    </div>`;
  }).join('') + '</div>' : '<div class="empty">No spots match your filters.</div>';
}

// ================================================================
// HUNT MODAL — Full detail popup
// ================================================================
function openHuntModal(idx) {
  const s = _filteredSpots[idx];
  if (!s) return;
  const myVoc = state.hunting.myVoc;
  const myLevel = state.hunting.myLevel;

  // Creature cards
  const creatureCards = s.creatures.map(c => {
    const cname = typeof c === 'string' ? c : c.name;
    const hp = c.hp || '?';
    const xp = c.xp || '?';
    const charmId = c.charm || 'wound';
    const charm = CHARMS[charmId] || CHARMS.wound;
    const charmPts = c.charmPts || 0;
    const elem = charm.element || 'null';
    return `<div class="hc-card">
      <div class="hc-sprite"><img src="${WIKI_IMG(cname)}" alt="${esc(cname)}" onerror="this.src='${TIBIA_IMG(cname)}'"></div>
      <div class="hc-info">
        <div class="hc-name">${esc(cname)}</div>
        <div class="hc-stats">
          <span>HP: <b class="hcs-val">${typeof hp === 'number' ? hp.toLocaleString() : hp}</b></span>
          <span>XP: <b class="hcs-val">${typeof xp === 'number' ? xp.toLocaleString() : xp}</b></span>
          ${charmPts ? `<span>Charm: <b class="hcs-val">${charmPts} pts</b></span>` : ''}
        </div>
        <span class="hc-charm charm-${elem}"><img class="charm-icon" src="${CHARM_IMG(charmId)}" alt="${esc(charm.name)}" onerror="this.style.display='none'">${esc(charm.name)}</span>
      </div>
    </div>`;
  }).join('');

  // Imbuements
  const imbuIcons = {Vampirism:'Vampire Teeth',Void:'Rope Belt',Strike:'Swamp Grass',Bash:'Cyclops Toe',Chop:'Piece of Scarab Shell',Slash:'Lion\'s Mane',Epiphany:'Strand of Medusa Hair',Lich:'Flask of Embalming Fluid',Reap:'Piece of Dead Brain',Swiftness:'Damselfly Wing',Vibrancy:'Wereboar Hooves',Scorch:'Fiery Heart',Frost:'Frosty Heart',Electrify:'Rorc Feather',Venom:'Swamp Grass'};
  const imbuHtml = (s.imbuements || []).map(i => {
    const imbuName = i.replace(/^\d+x?\s*/i, '');
    const mainWord = imbuName.split(/[\s(]/)[0];
    const icon = imbuIcons[mainWord] || '';
    return `<span class="imbu-chip">${icon ? `<img src="${WIKI_IMG(icon)}" onerror="this.style.display='none'">` : ''}${esc(i)}</span>`;
  }).join('');

  // Supplies
  let suppliesHtml = '';
  if (s.supplies) {
    const vocIcons = {knight:'Knight',paladin:'Paladin',sorcerer:'Sorcerer',druid:'Druid'};
    const mySupplies = s.supplies[myVoc] || (myVoc === 'monk' ? s.supplies.knight : null);
    if (mySupplies) {
      const vocImg = vocIcons[myVoc] ? `<img src="${WIKI_IMG(vocIcons[myVoc])}" onerror="this.style.display='none'">` : '';
      const itemsHtml = mySupplies.map(i => {
        const itemName = i.replace(/^\d+\s*x?\s*/i, '').replace(/^\d+\s+/, '');
        return `<li><img src="${WIKI_IMG(itemName)}" onerror="this.style.display='none'">${esc(i)}</li>`;
      }).join('');
      suppliesHtml = `<div class="supply-voc supply-active"><h6>${vocImg}${esc(myVoc)}</h6><ul>${itemsHtml}</ul></div>`;
    } else {
      suppliesHtml = '<span style="font-size:12px;color:var(--parch-dim)">No supply data for your vocation at this spot.</span>';
    }
  }

  // Trinket
  const trinketHtml = s.trinket ? `<div class="hunt-trinket"><img src="${WIKI_IMG(s.trinket)}" alt="${esc(s.trinket)}" onerror="this.style.display='none'"><span>${esc(s.trinket)}</span></div>` : '<span style="font-size:11px;color:var(--parch-dim)">None recommended</span>';

  // Drops
  const dropsHtml = (s.drops || []).map(d => `<div class="drop-item"><img src="${WIKI_IMG(d)}" alt="${esc(d)}" onerror="this.style.display='none'"><span class="drop-name">${esc(d)}</span></div>`).join('');

  // Gear
  let gearHtml = '';
  const tier = getGearForVocLevel(myVoc, myLevel);
  if (tier) {
    const vocLabel = myVoc.charAt(0).toUpperCase() + myVoc.slice(1);
    const chips = tier.items.map(i => `<span class="gear-item"><img src="${WIKI_IMG(i)}" alt="${esc(i)}" onerror="this.style.display='none'">${esc(i)}</span>`).join('');
    gearHtml = `<div class="gear-bracket gear-active"><h6><img src="${WIKI_IMG(vocLabel)}" onerror="this.style.display='none'" style="width:20px;height:20px"> ${esc(vocLabel)} — Level ${myLevel}</h6><div class="gear-items">${chips}</div></div>`;
    if (s.prot && s.prot.length) {
      const protChips = s.prot.map(el => {
        const p = ELEMENT_PROT[el];
        if (!p) return '';
        return `<span class="gear-item gear-prot elem-bg-${el}"><img src="${WIKI_IMG(p.amulet)}" alt="${esc(p.desc)}" onerror="this.style.display='none'">${esc(p.desc)}: ${esc(p.amulet)}</span>`;
      }).filter(Boolean).join('');
      if (protChips) gearHtml += `<div class="gear-bracket gear-prot-section"><h6>Recommended Protection</h6><div class="gear-items">${protChips}</div></div>`;
    }
  }

  // Stars (interactive)
  const mainCreature = s.creatures[0] ? (typeof s.creatures[0]==='string'?s.creatures[0]:s.creatures[0].name) : '';
  const vocBadges = s.voc.map(v => `<span class="hunt-voc">${vocAbbr(v)}</span>`).join('');

  // Build hunt mode badges with level ranges for modal
  const modalModeBadges = ['solo','duo','team'].filter(m => s.huntModes?.[m]).map(m => {
    const r = getHuntModeRange(s, m);
    return `<span class="hunt-mode-badge hunt-mode-${m}">${m} ${r ? r[0]+'-'+r[1] : ''}</span>`;
  }).join('');

  let html = `
    <div class="hunt-modal-hero">
      ${mainCreature ? `<img src="${WIKI_IMG(mainCreature)}" alt="${esc(mainCreature)}" onerror="this.style.display='none'">` : ''}
      <div class="hunt-modal-hero-info">
        <h3>${esc(s.name)}</h3>
        <div class="hm-badges">
          <div class="hunt-vocs">${vocBadges}</div>
          <span class="hunt-lvl">${s.level[0]}-${s.level[1]}</span>
          ${modalModeBadges}
          ${s.verified ? '<span class="hunt-verified verified">✓ Verified</span>' : '<span class="hunt-verified unverified">⚠ Unverified</span>'}
          ${renderStars(s.name)}
        </div>
      </div>
    </div>
    <div class="hunt-modal-metrics">
      <div class="hunt-metric"><div class="hm-val">${s.level[0]}+</div><div class="hm-label">Rec. Level</div></div>
      <div class="hunt-metric"><div class="hm-val">${s.expH || '?'}</div><div class="hm-label">Raw EXP/h</div></div>
      <div class="hunt-metric"><div class="hm-val">${s.profitH || '?'}</div><div class="hm-label">Profit/h</div></div>
      <div class="hunt-metric"><div class="hm-val">${s.premium ? 'Yes' : 'No'}</div><div class="hm-label">Premium</div></div>
    </div>

    <div class="hunt-sec">
      <div class="hunt-sec-title"><img src="${WIKI_IMG('Map_(Item)')}" onerror="this.style.display='none'"> Route & Access</div>
      <div class="hunt-route">
        ${s.waypoints && s.waypoints.length > 0 ? `
        <div class="hunt-minimap" id="modal-minimap"></div>
        ${s.waypoints.some(wp => wp[2]) ? `<div class="route-steps">${s.waypoints.filter(wp => wp[2]).map((wp, i) => {
          const floor = wp[3] || 7;
          const floorBadge = floor !== 7 ? ' <span class="rs-floor">Floor ' + (floor > 7 ? '-' + (floor - 7) : '+' + (7 - floor)) + '</span>' : '';
          return '<div class="route-step' + (floor !== 7 ? ' rs-underground' : '') + '"><span class="rs-num">' + (i + 1) + '</span>' + esc(wp[2]) + floorBadge + '</div>';
        }).join('')}</div>` : ''}` : `
        <div class="hunt-no-route">
          <p>No community route yet — be the first to add one!</p>
          <button class="btn-s btn-g" onclick="closeHuntModal();editorFixSpot(${s._origIdx})">Create Route</button>
        </div>`}
        ${s.route ? `<div class="hunt-route-text">${esc(s.route)}</div>` : ''}
        ${s.access ? `<div class="hunt-access" style="margin-top:8px"><strong>Access:</strong> ${esc(s.access)}</div>` : ''}
      </div>
    </div>

    <div class="hunt-sec">
      <div class="hunt-sec-title"><img src="${WIKI_IMG('Creature_Products')}" onerror="this.style.display='none'"> Creatures & Charms</div>
      <div class="hunt-creatures">${creatureCards}</div>
    </div>

    <div class="hunt-sec">
      <div class="hunt-sec-title"><img src="${WIKI_IMG('Imbuing_Shrine')}" onerror="this.style.display='none'"> Imbuements</div>
      <div class="hunt-imbu">${imbuHtml || '<span style="font-size:11px;color:var(--parch-dim)">None specified</span>'}</div>
    </div>

    <div class="hunt-sec">
      <div class="hunt-sec-title"><img src="${WIKI_IMG('Strong_Health_Potion')}" onerror="this.style.display='none'"> Supplies — ${esc(myVoc.charAt(0).toUpperCase()+myVoc.slice(1))}</div>
      <div class="hunt-supplies">${suppliesHtml}</div>
    </div>

    <div class="hunt-sec">
      <div class="hunt-sec-title"><img src="${WIKI_IMG('Amulet_of_Loss')}" onerror="this.style.display='none'"> Trinket</div>
      ${trinketHtml}
    </div>

    <div class="hunt-sec">
      <div class="hunt-sec-title"><img src="${WIKI_IMG('Gold_Coin')}" onerror="this.style.display='none'"> Valuable Drops</div>
      <div class="hunt-drops">${dropsHtml}</div>
    </div>

    <div class="hunt-sec">
      <div class="hunt-sec-title"><img src="${WIKI_IMG('Magic_Plate_Armor')}" onerror="this.style.display='none'"> Your Gear — ${esc(myVoc.charAt(0).toUpperCase()+myVoc.slice(1))} Lv ${myLevel}</div>
      <div class="hunt-gear">${gearHtml}</div>
    </div>

    ${s.tips ? `<div class="hunt-sec"><div class="hunt-sec-title"><img src="${WIKI_IMG('Book_(Brown)')}" onerror="this.style.display='none'"> Tips</div><div class="hunt-tips">${esc(s.tips)}</div></div>` : ''}

    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      ${s.cx ? `<button class="btn-s btn-g" onclick="closeHuntModal();showOnMap(${s.cx},${s.cy},'${esc(s.name).replace(/'/g,"\\'")}')">Show on World Map</button>` : ''}
      <button class="btn-s" onclick="closeHuntModal();viewSpotCreatures([${s.creatures.map(c => `'${esc(typeof c === 'string' ? c : c.name).replace(/'/g,"\\'")}'`).join(',')}])">View in Bestiary</button>
      <button class="btn-s" onclick="closeHuntModal();editorFixSpot(${s._origIdx})">Edit Route</button>
      <button class="btn-s" onclick="toggleFeedback(this)" style="margin-left:auto">Suggest Changes</button>
    </div>
    <div class="spot-feedback" style="display:none;margin-top:14px;padding:16px;background:var(--bg-darker);border:1px solid var(--border-h);border-radius:var(--rl)">
      <div style="font-family:Cinzel,serif;font-size:14px;color:var(--gold);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border)">Suggest Changes to This Spot</div>
      <div class="fb-sections">
        <div class="fb-sec">
          <label class="fb-sec-label"><input type="checkbox" class="fb-cat" value="creatures"> <img src="${WIKI_IMG('Creature_Products')}" onerror="this.style.display='none'" style="width:18px;height:18px"> Creatures</label>
          <textarea class="fb-field" data-cat="creatures" rows="2" placeholder="Which creatures should be added/removed?"></textarea>
        </div>
        <div class="fb-sec">
          <label class="fb-sec-label"><input type="checkbox" class="fb-cat" value="imbuements"> <img src="${WIKI_IMG('Imbuing_Shrine')}" onerror="this.style.display='none'" style="width:18px;height:18px"> Imbuements</label>
          <textarea class="fb-field" data-cat="imbuements" rows="2" placeholder="What imbuements should be used?"></textarea>
        </div>
        <div class="fb-sec">
          <label class="fb-sec-label"><input type="checkbox" class="fb-cat" value="gear"> <img src="${WIKI_IMG('Magic_Plate_Armor')}" onerror="this.style.display='none'" style="width:18px;height:18px"> Best Equipment</label>
          <textarea class="fb-field" data-cat="gear" rows="2" placeholder="Best gear for this spot?"></textarea>
        </div>
        <div class="fb-sec">
          <label class="fb-sec-label"><input type="checkbox" class="fb-cat" value="supplies"> <img src="${WIKI_IMG('Strong_Health_Potion')}" onerror="this.style.display='none'" style="width:18px;height:18px"> Supplies</label>
          <textarea class="fb-field" data-cat="supplies" rows="2" placeholder="Supplies needed?"></textarea>
        </div>
        <div class="fb-sec">
          <label class="fb-sec-label"><input type="checkbox" class="fb-cat" value="loot"> <img src="${WIKI_IMG('Gold_Coin')}" onerror="this.style.display='none'" style="width:18px;height:18px"> Loot / Drops</label>
          <textarea class="fb-field" data-cat="loot" rows="2" placeholder="Valuable drops to add/fix?"></textarea>
        </div>
        <div class="fb-sec">
          <label class="fb-sec-label"><input type="checkbox" class="fb-cat" value="tips"> <img src="${WIKI_IMG('Book_(Brown)')}" onerror="this.style.display='none'" style="width:18px;height:18px"> Tips / Strategy</label>
          <textarea class="fb-field" data-cat="tips" rows="2" placeholder="Hunting tips?"></textarea>
        </div>
        <div class="fb-sec">
          <label class="fb-sec-label"><input type="checkbox" class="fb-cat" value="other"> Other</label>
          <textarea class="fb-field" data-cat="other" rows="2" placeholder="Any other changes needed..."></textarea>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;align-items:center;padding-top:10px;border-top:1px solid var(--border)">
        <input type="text" class="fb-author" placeholder="Your character name" style="flex:1;font-size:12px">
        <button class="btn-s btn-g" onclick="submitFeedback(this,${s._origIdx})">Send Feedback</button>
      </div>
      <div class="fb-status" style="margin-top:6px;font-size:12px"></div>
    </div>`;

  const overlay = document.getElementById('huntModal');
  const content = document.getElementById('huntModalContent');
  content.innerHTML = html;
  overlay.style.display = '';
  document.body.style.overflow = 'hidden';

  // Lazy-load minimap
  const mapEl = content.querySelector('#modal-minimap');
  if (mapEl && s.cx && s.cy && typeof L !== 'undefined') {
    setTimeout(() => {
      initSpotMiniMap(mapEl, s);
    }, 100);
  }
}

function closeHuntModal() {
  const overlay = document.getElementById('huntModal');
  if (!overlay) return;
  overlay.style.display = 'none';
  document.body.style.overflow = '';
  // Destroy Leaflet map to prevent memory leak
  const mapEl = document.getElementById('modal-minimap');
  if (mapEl && mapEl._leafletMap) {
    mapEl._leafletMap.remove();
    mapEl._leafletMap = null;
  }
  document.getElementById('huntModalContent').innerHTML = '';
}

// Close modal on backdrop click
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('hunt-modal-overlay')) {
    closeHuntModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('huntModal');
    if (overlay && overlay.style.display !== 'none') {
      closeHuntModal();
    }
  }
});

function initSpotMiniMap(el, spot) {
  const bounds = [[0, 0], [MAP_H, MAP_W]];

  // Determine which floors this spot uses
  const floors = new Set();
  if (spot.waypoints && spot.waypoints.length > 0) {
    spot.waypoints.forEach(wp => floors.add(wp[3] || 7));
  } else { floors.add(7); }
  const floorList = Array.from(floors).sort((a, b) => a - b);
  let curFloor = 7;
  let isFirstDraw = true;

  const miniMap = L.map(el, {
    crs: L.CRS.Simple, minZoom: -1, maxZoom: 5,
    zoomControl: false, attributionControl: false,
    dragging: true, scrollWheelZoom: true,
    maxBounds: [[-200, -200], [MAP_H + 200, MAP_W + 200]],
    maxBoundsViscosity: 0.8
  });
  el._leafletMap = miniMap;
  L.control.zoom({ position: 'topright' }).addTo(miniMap);

  let overlay = L.imageOverlay(MAP_URL(curFloor), bounds).addTo(miniMap);
  let routeGroup = L.layerGroup().addTo(miniMap);

  const displayFloor = f => { const d = 7 - f; return d === 0 ? '0' : d > 0 ? '+' + d : String(d); };

  // Floor switching control
  if (floorList.length > 1) {
    const FC = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        const div = L.DomUtil.create('div', 'floor-ctrl');
        div.innerHTML = '<button class="fc-btn" data-dir="up">▲</button><span class="fc-lbl">' + displayFloor(curFloor) + '</span><button class="fc-btn" data-dir="down">▼</button>';
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        div.querySelectorAll('.fc-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const dir = btn.dataset.dir;
            const curIdx = floorList.indexOf(curFloor);
            let nextIdx;
            if (dir === 'up') {
              nextIdx = curIdx - 1;
            } else {
              nextIdx = curIdx + 1;
            }
            if (nextIdx < 0 || nextIdx >= floorList.length) return;
            curFloor = floorList[nextIdx];
            miniMap.removeLayer(overlay);
            overlay = L.imageOverlay(MAP_URL(curFloor), bounds).addTo(miniMap);
            overlay.bringToBack();
            drawRoute(true);
            div.querySelector('.fc-lbl').textContent = displayFloor(curFloor);
          });
        });
        return div;
      }
    });
    new FC().addTo(miniMap);
  }

  function drawRoute(isFloorSwitch) {
    routeGroup.clearLayers();
    if (!spot.waypoints || !spot.waypoints.length) {
      const city = CITIES.find(c => c.name === spot.city);
      if (curFloor !== 7) return;
      const [sLat, sLng] = tibiaToLeaflet(spot.cx, spot.cy);
      if (city) {
        const [cLat, cLng] = tibiaToLeaflet(city.cx, city.cy);
        routeGroup.addLayer(L.polyline([[cLat, cLng], [sLat, sLng]], { color: '#d4a537', weight: 3, opacity: .9 }));
        routeGroup.addLayer(L.marker([cLat, cLng], { icon: stepIcon(1, 'step-marker step-marker-start') }).bindTooltip(city.name, tipOpts));
        routeGroup.addLayer(L.marker([sLat, sLng], { icon: stepIcon(2, 'step-marker step-marker-end') }).bindTooltip(spot.name, tipOpts));
        miniMap.fitBounds([[cLat, cLng], [sLat, sLng]], { padding: [40, 40] });
      } else {
        miniMap.setView([sLat, sLng], 1);
      }
      return;
    }

    // Collect points on current floor
    const floorPts = [];
    spot.waypoints.forEach(wp => { if ((wp[3] || 7) === curFloor) floorPts.push(tibiaToLeaflet(wp[0], wp[1])); });

    // Draw route segments for current floor
    let seg = [];
    spot.waypoints.forEach((wp, i) => {
      const f = wp[3] || 7;
      if (f === curFloor) {
        seg.push(tibiaToLeaflet(wp[0], wp[1]));
      } else {
        flushSeg(seg);
        seg = [];
      }
    });
    flushSeg(seg);

    // Direction arrows between consecutive same-floor waypoints
    for (let i = 0; i < spot.waypoints.length - 1; i++) {
      const w1 = spot.waypoints[i], w2 = spot.waypoints[i + 1];
      if ((w1[3] || 7) !== curFloor || (w2[3] || 7) !== curFloor) continue;
      const [lat1, lng1] = tibiaToLeaflet(w1[0], w1[1]);
      const [lat2, lng2] = tibiaToLeaflet(w2[0], w2[1]);
      const mLat = (lat1 + lat2) / 2, mLng = (lng1 + lng2) / 2;
      const angle = Math.atan2(lng2 - lng1, lat2 - lat1) * 180 / Math.PI;
      routeGroup.addLayer(L.marker([mLat, mLng], {
        icon: L.divIcon({ className: '', html: '<div class="route-arrow" style="transform:rotate(' + (90 - angle) + 'deg)">▸</div>', iconSize: [14, 14], iconAnchor: [7, 7] }),
        interactive: false
      }));
    }

    // Step markers for current floor
    spot.waypoints.forEach((wp, i) => {
      const f = wp[3] || 7;
      if (f !== curFloor) return;
      const [lat, lng] = tibiaToLeaflet(wp[0], wp[1]);
      const label = (wp[2] || '').toLowerCase();
      const labelRaw = wp[2] || '';
      const num = i + 1;
      const isFirst = i === 0;
      const isLast = i === spot.waypoints.length - 1;
      const nextF = i < spot.waypoints.length - 1 ? (spot.waypoints[i + 1][3] || 7) : curFloor;
      const prevF = i > 0 ? (spot.waypoints[i - 1][3] || 7) : curFloor;
      const goDown = nextF > curFloor;
      const goUp = nextF < curFloor && nextF !== curFloor;
      const cameFrom = prevF !== curFloor;

      // Detect special waypoint types from description
      const isNPC = label.includes('npc') || label.includes('talk') || label.includes('ask');
      const isTeleport = label.includes('teleport') || label.includes('portal') || label.includes('tp');
      const isStairsWp = goDown || goUp || cameFrom;
      const targetFloor = goDown ? nextF : goUp ? nextF : cameFrom ? prevF : null;

      let cls = 'step-marker';
      let ml = String(num);
      if (isFirst && !cameFrom) cls += ' step-marker-start';
      else if (isLast && !goDown && !goUp) cls += ' step-marker-end';
      else if (goDown) { cls += ' step-marker-stairs'; ml = '↓'; }
      else if (goUp) { cls += ' step-marker-stairs'; ml = '↑'; }
      else if (cameFrom) { cls += ' step-marker-stairs'; ml = prevF > curFloor ? '↑' : '↓'; }
      else if (isTeleport) { cls += ' step-marker-teleport'; ml = '⚡'; }
      else if (isNPC) { cls += ' step-marker-npc'; ml = '💬'; }

      const marker = L.marker([lat, lng], { icon: stepIcon(ml, cls) });
      let tip = '<b>' + num + '.</b> ' + esc(labelRaw);
      if (goDown) tip += ' ⬇ go down';
      if (goUp) tip += ' ⬆ go up';
      if (isNPC) tip += ' 💬 NPC';
      if (isTeleport) tip += ' ⚡ Teleport';
      if (isStairsWp || isTeleport) tip += '<br><span style="font-size:10px;color:var(--gold)">Click to switch floor</span>';
      if (labelRaw) marker.bindTooltip(tip, tipOpts);

      // Click stairs/teleport markers to switch floor
      if ((isStairsWp || isTeleport) && targetFloor !== null) {
        marker.on('click', function() {
          curFloor = targetFloor;
          miniMap.removeLayer(overlay);
          overlay = L.imageOverlay(MAP_URL(curFloor), bounds).addTo(miniMap);
          overlay.bringToBack();
          drawRoute(true);
          // Update floor control label inside the minimap
          const ctrl = miniMap.getContainer().querySelector('.fc-lbl');
          if (ctrl) ctrl.textContent = displayFloor(curFloor);
        });
      }
      routeGroup.addLayer(marker);
    });

    // Only fit bounds on first draw; on floor switch keep zoom and pan to center of new floor's points
    if (isFirstDraw) {
      // Fit to ALL waypoints (all floors) for initial overview
      const allPts = spot.waypoints.map(wp => tibiaToLeaflet(wp[0], wp[1]));
      if (allPts.length > 1) miniMap.fitBounds(allPts, { padding: [30, 30], maxZoom: 3 });
      else miniMap.setView(allPts[0], 2);
      isFirstDraw = false;
    } else if (isFloorSwitch && floorPts.length > 0) {
      // On floor switch: pan to center of this floor's points but keep current zoom
      const cLat = floorPts.reduce((s, p) => s + p[0], 0) / floorPts.length;
      const cLng = floorPts.reduce((s, p) => s + p[1], 0) / floorPts.length;
      miniMap.panTo([cLat, cLng], { animate: true, duration: 0.3 });
    }
  }

  function flushSeg(pts) {
    if (pts.length > 1) {
      routeGroup.addLayer(L.polyline(pts, { color: '#d4a537', weight: 8, opacity: .12 }));
      routeGroup.addLayer(L.polyline(pts, { color: '#d4a537', weight: 3, opacity: .9, lineCap: 'round', lineJoin: 'round' }));
    }
  }

  const tipOpts = { direction: 'top', className: 'map-tip', offset: [0, -14] };
  function stepIcon(label, cls) {
    return L.divIcon({ className: '', html: '<div class="' + cls + '">' + label + '</div>', iconSize: [22, 22], iconAnchor: [11, 11] });
  }

  drawRoute(false);
}

function viewSpotCreatures(names) {
  showPanel('bestiary');
  setTimeout(() => {
    if (names.length === 1) showCreatureDetail(names[0]);
  }, 400);
}

// ================================================================
// EQUIPMENT
// ================================================================
function renderEquipment() {
  const grid = document.getElementById('equipGrid');
  if (!grid) return;
  const { voc, bracket } = state.equip;
  const data = EQUIPMENT[voc]?.[bracket];
  if (!data) { grid.innerHTML = '<div class="empty">No equipment data for this selection.</div>'; return; }

  const slotOrder = ['helmet', 'armor', 'legs', 'boots', 'weapon', 'shield', 'ring', 'amulet'];
  grid.innerHTML = slotOrder.map(slot => {
    const item = data[slot];
    if (!item) return '';
    const meta = SLOT_META[slot] || {};
    return `<div class="card eq-slot">
      <div class="eq-head">
        <img src="${WIKI_IMG(item.img || item.name)}" alt="${esc(meta.label)}" class="eq-sicon" onerror="this.style.display='none'">
        <span class="eq-type">${esc(meta.label || slot)}</span>
      </div>
      <div class="eq-item">
        <img src="${WIKI_IMG(item.img || item.name)}" alt="${esc(item.name)}" class="eq-iimg" onerror="this.style.display='none'">
        <div>
          <div class="eq-iname">${esc(item.name)}</div>
          <div class="eq-stats">${esc(item.stats)}</div>
        </div>
      </div>
      <div class="eq-src">${esc(item.source)}</div>
    </div>`;
  }).join('');
}

// ================================================================
// QUESTS
// ================================================================
function renderQuests() {
  const container = document.getElementById('questList');
  if (!container) return;
  const { search, level, premium } = state.quests;
  const filtered = QUESTS.filter(q => {
    if (search && !q.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (level && q.level > level) return false;
    if (premium === 'free' && q.premium) return false;
    if (premium === 'premium' && !q.premium) return false;
    return true;
  });

  container.innerHTML = filtered.length ? filtered.map((q, i) => {
    const badges = [
      `<span class="badge bg-gold">Lv ${q.level}+</span>`,
      q.premium ? '<span class="badge bg-blue">Premium</span>' : '<span class="badge bg-green">Free</span>'
    ].join('');
    const reqs = q.requirements?.length ? `<div class="qs"><h5>Requirements</h5><ul>${q.requirements.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>` : '';
    const steps = q.steps?.length ? `<div class="qs"><h5>Walkthrough</h5><ol>${q.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>` : '';
    const rewards = q.rewards?.length ? `<div class="qs"><h5>Rewards</h5><ul>${q.rewards.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>` : '';
    const dangers = q.dangers?.length ? `<div class="qs"><h5>Dangers</h5><div style="display:flex;flex-wrap:wrap;gap:4px">${q.dangers.map(d => `<span class="sc-chip"><img src="${WIKI_IMG(d)}" alt="${esc(d)}" style="width:20px;height:20px" onerror="this.style.display='none'">${esc(d)}</span>`).join('')}</div></div>` : '';
    const tips = q.tips ? `<div class="qs"><h5>Tips</h5><div class="tip">${esc(q.tips)}</div></div>` : '';

    return `<div class="card qc" id="quest-${i}">
      <div class="qh" onclick="this.parentElement.classList.toggle('open')">
        <span class="q-arrow">&#9654;</span>
        <span class="q-title">${esc(q.name)}</span>
        <div class="q-badges">${badges}</div>
      </div>
      <div class="qb">
        <p style="font-size:13px;color:var(--parch-dim);margin:10px 0;line-height:1.6">${esc(q.desc)}</p>
        <div style="font-size:11px;color:var(--parch-dim);margin-bottom:8px">
          <strong>Location:</strong> ${esc(q.location)} ${q.npc !== '—' ? `| <strong>NPC:</strong> ${esc(q.npc)}` : ''}
        </div>
        ${reqs}${steps}${rewards}${dangers}${tips}
      </div>
    </div>`;
  }).join('') : '<div class="empty">No quests match your filters.</div>';
}

// ================================================================
// SPELLS
// ================================================================
async function loadSpells() {
  const container = document.getElementById('spellsBody');
  if (!container) return;
  if (cache.spells) { filterSpells(); return; }
  container.innerHTML = '<tr><td colspan="8" class="loading"><span class="spinner"></span> Loading spells...</td></tr>';
  try {
    const res = await fetch(`${API}/spells`).then(r => r.json());
    cache.spells = res?.spells?.spells_list || [];
    filterSpells();
  } catch (e) { container.innerHTML = '<tr><td colspan="8" class="empty">Failed to load spells.</td></tr>'; }
}

function filterSpells() {
  if (!cache.spells) return;
  const { voc, type, search } = state.spells;
  const filtered = cache.spells.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !(s.spell_id || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (voc !== 'all') {
      const vocList = (s.vocations || []).map(v => v.toLowerCase());
      if (!vocList.some(v => v.includes(voc.toLowerCase()))) return false;
    }
    if (type !== 'all' && s.type_spell?.toLowerCase() !== type.toLowerCase()) return false;
    return true;
  });

  const body = document.getElementById('spellsBody');
  body.innerHTML = filtered.length ? filtered.map(s => {
    const vocs = (s.vocations || []).map(v => {
      const base = v.toLowerCase().replace('elite ','').replace('royal ','').replace('master ','').replace('elder ','');
      const short = vocAbbr(base);
      return `<span class="badge bg-gold" style="font-size:8px;padding:1px 4px">${short}</span>`;
    }).join(' ');
    const formula = s.spell_id || s.formula || '';
    return `<tr>
      <td><img src="${WIKI_IMG(s.name)}" style="width:28px;height:28px" onerror="this.style.display='none'" class="sp-img"></td>
      <td style="font-weight:600;color:var(--gold-light)">${esc(s.name)}</td>
      <td class="sp-formula">${esc(formula)}</td>
      <td>${s.level || '?'}</td>
      <td>${s.mana || '?'}</td>
      <td>${s.price ? s.price.toLocaleString() + ' gp' : '?'}</td>
      <td>${vocs}</td>
      <td><span class="badge ${s.type_spell === 'Instant' ? 'bg-blue' : 'bg-green'}">${esc(s.type_spell || '')}</span></td>
    </tr>`;
  }).join('') : '<tr><td colspan="8" class="empty">No spells match.</td></tr>';

  document.getElementById('spellCount').textContent = `${filtered.length} spells`;
}

// ================================================================
// MAP
// ================================================================
function initMap() {
  if (state.map) { state.map.invalidateSize(); return; }
  const mapEl = document.getElementById('tibiaMap');
  if (!mapEl || typeof L === 'undefined') return;

  const bounds = [[0, 0], [MAP_H, MAP_W]];
  state.map = L.map('tibiaMap', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 5,
    maxBounds: [[-100, -100], [MAP_H + 100, MAP_W + 100]],
    maxBoundsViscosity: 0.9
  });

  const imgOverlay = L.imageOverlay(MAP_URL(state.mapFloor), bounds);
  imgOverlay.addTo(state.map);
  state.map.fitBounds(bounds);
  state.mapOverlay = imgOverlay;

  // Surface markers group (visible only on floor 7)
  state.mapMarkers = L.layerGroup().addTo(state.map);

  // City markers
  CITIES.forEach(c => {
    const [lat, lng] = tibiaToLeaflet(c.cx, c.cy);
    L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'map-city-label',
        html: `<span style="color:#3b82f6;font-size:11px;font-weight:700;text-shadow:0 0 4px #000,0 0 4px #000;white-space:nowrap">${c.name}</span>`,
        iconSize: [80, 16],
        iconAnchor: [40, 8]
      })
    }).addTo(state.mapMarkers);
  });

  // Hunting spot markers
  HUNTING_SPOTS.forEach(s => {
    if (!s.cx || !s.cy) return;
    const [lat, lng] = tibiaToLeaflet(s.cx, s.cy);
    L.circleMarker([lat, lng], {
      radius: 5,
      color: '#d4a537',
      fillColor: '#d4a537',
      fillOpacity: 0.8,
      weight: 1
    }).bindTooltip(`<b>${s.name}</b><br>Level ${s.level[0]}-${s.level[1]}`, { className: 'map-tip' }).addTo(state.mapMarkers);
  });

  // Floor control ON the map (custom Leaflet control)
  const FloorControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function() {
      const div = L.DomUtil.create('div', 'floor-ctrl');
      const displayFloor = f => { const d = 7 - f; return d === 0 ? '0' : d > 0 ? '+' + d : String(d); };
      div.innerHTML = '<button class="fc-btn" data-dir="up" title="Go up a floor">▲</button><span class="fc-lbl">' + displayFloor(state.mapFloor) + '</span><button class="fc-btn" data-dir="down" title="Go down a floor">▼</button>';
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);
      div.querySelectorAll('.fc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const newFloor = btn.dataset.dir === 'up' ? state.mapFloor - 1 : state.mapFloor + 1;
          if (newFloor < 0 || newFloor > 15) return;
          changeFloor(newFloor);
          div.querySelector('.fc-lbl').textContent = displayFloor(newFloor);
        });
      });
      state._mapFloorCtrl = div;
      return div;
    }
  });
  new FloorControl().addTo(state.map);

  // Click for coords
  state.map.on('click', e => {
    const cx = Math.round(MAP_X0 + (e.latlng.lng / MAP_W) * (MAP_X1 - MAP_X0));
    const cy = Math.round(MAP_Y0 + ((MAP_H - e.latlng.lat) / MAP_H) * (MAP_Y1 - MAP_Y0));
    document.getElementById('mapCoords').textContent = `X: ${cx}, Y: ${cy}, Z: ${state.mapFloor}`;
  });
}

function tibiaToLeaflet(cx, cy) {
  const px = (cx - MAP_X0) / (MAP_X1 - MAP_X0) * MAP_W;
  const py = (cy - MAP_Y0) / (MAP_Y1 - MAP_Y0) * MAP_H;
  return [MAP_H - py, px];
}

function changeFloor(floor) {
  state.mapFloor = floor;
  if (state.map && state.mapOverlay) {
    state.mapOverlay.setUrl(MAP_URL(floor));
    // Show/hide surface markers based on floor
    if (state.mapMarkers) {
      if (floor === 7 && !state.map.hasLayer(state.mapMarkers)) {
        state.map.addLayer(state.mapMarkers);
      } else if (floor !== 7 && state.map.hasLayer(state.mapMarkers)) {
        state.map.removeLayer(state.mapMarkers);
      }
    }
  }
  const df = 7 - floor;
  const flName = df === 0 ? 'Ground' : df > 0 ? '+' + df : String(df);
  document.getElementById('floorLabel').textContent = flName + ' (' + floor + ')';
  // Sync on-map floor control label
  if (state._mapFloorCtrl) {
    const lbl = state._mapFloorCtrl.querySelector('.fc-lbl');
    if (lbl) lbl.textContent = df === 0 ? '0' : df > 0 ? '+' + df : String(df);
  }
}

function showOnMap(cx, cy, name) {
  showPanel('map');
  setTimeout(() => {
    if (!state.map) initMap();
    if (state.mapFloor !== 7) changeFloor(7);
    const [lat, lng] = tibiaToLeaflet(cx, cy);
    state.map.setView([lat, lng], 2);
    L.popup().setLatLng([lat, lng]).setContent(`<b>${name}</b>`).openOn(state.map);
  }, 300);
}

// ================================================================
// CHARACTER LOOKUP
// ================================================================
async function lookupCharacter() {
  const input = document.getElementById('charInput');
  const result = document.getElementById('charResult');
  const name = input.value.trim();
  if (!name) return;
  result.innerHTML = '<div class="loading"><span class="spinner"></span> Looking up character...</div>';
  try {
    const res = await fetch(`${API}/character/${encodeURIComponent(name)}`).then(r => r.json());
    const ch = res?.character?.character;
    if (!ch || !ch.name) { result.innerHTML = '<div class="empty">Character not found.</div>'; return; }

    const fields = [
      ['Name', ch.name], ['Title', ch.title || 'None'], ['Sex', ch.sex],
      ['Vocation', ch.vocation], ['Level', ch.level], ['World', ch.world],
      ['Residence', ch.residence], ['Guild', ch.guild?.name || 'None'],
      ['Last Login', ch.last_login ? new Date(ch.last_login).toLocaleDateString() : '?'],
      ['Account Status', ch.account_status], ['Achievement Points', ch.achievement_points],
      ['Comment', ch.comment || '—']
    ];

    let html = '<div class="card" style="margin-bottom:14px"><div class="ch-grid">';
    fields.forEach(([l, v]) => html += `<div class="ch-field"><span class="fl">${l}</span><span class="fv">${esc(String(v))}</span></div>`);
    html += '</div></div>';

    // Deaths
    const deaths = res?.character?.deaths || [];
    if (deaths.length) {
      html += '<div class="card"><h4 style="font-size:13px;color:var(--gold);margin-bottom:8px">Recent Deaths</h4>';
      deaths.slice(0, 10).forEach(d => {
        html += `<div class="death-item"><span class="dr">Level ${d.level}</span> — ${esc(d.reason)} <span style="color:var(--parch-dim);font-size:10px">(${new Date(d.time).toLocaleDateString()})</span></div>`;
      });
      html += '</div>';
    }

    // Other characters
    const others = res?.character?.other_characters || [];
    if (others.length > 1) {
      html += '<div class="card" style="margin-top:14px"><h4 style="font-size:13px;color:var(--gold);margin-bottom:8px">Other Characters</h4>';
      others.forEach(o => {
        html += `<div style="font-size:12px;padding:3px 0;border-bottom:1px solid var(--border);cursor:pointer;color:var(--parchment)" onclick="document.getElementById('charInput').value='${esc(o.name)}';lookupCharacter()">${esc(o.name)} — ${esc(o.world)} (${esc(o.status)})</div>`;
      });
      html += '</div>';
    }

    result.innerHTML = html;
  } catch (e) { result.innerHTML = '<div class="empty">Error looking up character. Please try again.</div>'; }
}

// ================================================================
// WORLDS
// ================================================================
async function loadWorlds() {
  const body = document.getElementById('worldsBody');
  if (!body) return;
  if (cache.worlds) { filterWorlds(); return; }
  body.innerHTML = '<tr><td colspan="6" class="loading"><span class="spinner"></span> Loading worlds...</td></tr>';
  try {
    const res = await fetch(`${API}/worlds`).then(r => r.json());
    cache.worlds = res?.worlds?.regular_worlds || [];
    filterWorlds();
  } catch (e) { body.innerHTML = '<tr><td colspan="6" class="empty">Failed to load world data.</td></tr>'; }
}

function filterWorlds() {
  if (!cache.worlds) return;
  const q = state.worlds.search.toLowerCase();
  let filtered = cache.worlds.filter(w => !q || w.name.toLowerCase().includes(q));
  const { sort, asc } = state.worlds;
  filtered.sort((a, b) => {
    let va = a[sort], vb = b[sort];
    if (sort === 'players_online') return asc ? va - vb : vb - va;
    va = String(va || '').toLowerCase(); vb = String(vb || '').toLowerCase();
    return asc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const totalOnline = cache.worlds.reduce((sum, w) => sum + (w.players_online || 0), 0);
  document.getElementById('totalOnline').textContent = totalOnline.toLocaleString();
  document.getElementById('totalWorlds').textContent = cache.worlds.length;

  const body = document.getElementById('worldsBody');
  body.innerHTML = filtered.map(w => `<tr>
    <td style="font-weight:600;color:var(--gold-light)">${esc(w.name)}</td>
    <td><span class="${w.status === 'online' ? 'online' : 'offline'}">${esc(w.status)}</span></td>
    <td>${w.players_online}</td>
    <td>${esc(w.location)}</td>
    <td>${esc(w.pvp_type)}</td>
    <td>${w.battleye_protected ? '<span class="badge bg-green">Yes</span>' : '<span class="badge bg-red">No</span>'}</td>
  </tr>`).join('');
}

function sortWorlds(col) {
  if (state.worlds.sort === col) state.worlds.asc = !state.worlds.asc;
  else { state.worlds.sort = col; state.worlds.asc = true; }
  filterWorlds();
}

// ================================================================
// CALCULATORS
// ================================================================
function initCalcs() {
  // Already rendered in HTML, just attach handlers if needed
}

function calcExperience() {
  const curr = parseInt(document.getElementById('calcCurrLevel').value) || 1;
  const tgt = parseInt(document.getElementById('calcTgtLevel').value) || 2;
  const xph = parseInt(document.getElementById('calcXpH').value) || 100000;
  if (tgt <= curr) { document.getElementById('expResult').innerHTML = '<span class="crv">Invalid levels</span>'; return; }

  const xpForLevel = l => Math.round((50 * Math.pow(l - 1, 3) / 3) - 100 * Math.pow(l - 1, 2) + (850 * (l - 1) / 3) - 200);
  const needed = xpForLevel(tgt) - xpForLevel(curr);
  const hours = needed / xph;

  document.getElementById('expResult').innerHTML = `
    <div class="crv">${formatNum(needed)} XP</div>
    <div class="crl">Experience needed</div>
    <div class="crv" style="margin-top:6px">${hours.toFixed(1)} hours</div>
    <div class="crl">At ${formatNum(xph)} XP/hour</div>`;
}

function calcLootSplit() {
  const text = document.getElementById('calcLootText').value.trim();
  const players = parseInt(document.getElementById('calcPlayers').value) || 4;
  if (!text) return;

  // Try to parse hunt analyzer format
  const balMatch = text.match(/Balance:\s*([\d,]+)/i) || text.match(/([\d,]+)/);
  if (!balMatch) { document.getElementById('lootResult').innerHTML = '<span class="crv">Could not parse</span>'; return; }
  const total = parseInt(balMatch[1].replace(/,/g, ''));
  const each = Math.floor(total / players);
  document.getElementById('lootResult').innerHTML = `
    <div class="crv">${formatNum(total)} gp</div><div class="crl">Total balance</div>
    <div class="crv" style="margin-top:6px">${formatNum(each)} gp</div><div class="crl">Per player (${players} players)</div>`;
}

function calcStamina() {
  const hh = parseInt(document.getElementById('calcStamH').value) || 0;
  const mm = parseInt(document.getElementById('calcStamM').value) || 0;
  const current = hh * 60 + mm;
  const full = 42 * 60;
  const needed = full - current;
  if (needed <= 0) { document.getElementById('stamResult').innerHTML = '<span class="crv">Full stamina!</span>'; return; }
  const regenH = Math.floor(needed * 3 / 60);
  const regenM = (needed * 3) % 60;
  document.getElementById('stamResult').innerHTML = `
    <div class="crv">${Math.floor(needed / 60)}h ${needed % 60}m</div><div class="crl">Stamina needed</div>
    <div class="crv" style="margin-top:6px">${regenH}h ${regenM}m</div><div class="crl">Offline time to regenerate</div>`;
}

// ================================================================
// UTILITIES
// ================================================================
function esc(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

function formatNum(n) {
  if (n === '?' || n === undefined || n === null) return '?';
  return Number(n).toLocaleString();
}

// ================================================================
// ROUTE EDITOR — Community-driven route creation
// ================================================================
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1477661574675300374/4-dtExiQuOKR0nzocTksc9hat3LoTWUrJcFtyEerHwDqRh_A1FP_mylXrMvBLgTfmbou';

const editor = {
  map: null,
  overlay: null,
  floor: 7,
  waypoints: [],      // [{cx, cy, floor, desc, marker}]
  routeLayer: null,
  mode: 'new',        // 'new' or 'fix'
  fixSpotIdx: -1,
  initialized: false
};

function initEditor() {
  if (editor.initialized) {
    if (editor.map) editor.map.invalidateSize();
    return;
  }
  editor.initialized = true;

  // Populate city dropdown
  const citySelect = document.getElementById('edCity');
  citySelect.innerHTML = '<option value="">— Select city —</option>' +
    CITIES.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');

  // Populate fix-existing dropdown
  const fixSelect = document.getElementById('edFixSpot');
  fixSelect.innerHTML = '<option value="-1">— Select spot to fix —</option>' +
    HUNTING_SPOTS.map((s, i) => `<option value="${i}">${esc(s.name)} (${esc(s.city)})</option>`).join('');

  // Initialize Leaflet map
  const mapEl = document.getElementById('editorMap');
  if (!mapEl || typeof L === 'undefined') return;

  const bounds = [[0, 0], [MAP_H, MAP_W]];
  editor.map = L.map('editorMap', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 5,
    maxBounds: [[-100, -100], [MAP_H + 100, MAP_W + 100]],
    maxBoundsViscosity: 0.9
  });

  editor.overlay = L.imageOverlay(MAP_URL(editor.floor), bounds).addTo(editor.map);
  editor.map.fitBounds(bounds);
  editor.routeLayer = L.layerGroup().addTo(editor.map);

  // Add city labels for reference
  CITIES.forEach(c => {
    const [lat, lng] = tibiaToLeaflet(c.cx, c.cy);
    L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'map-city-label',
        html: `<span style="color:#3b82f6;font-family:Cinzel,serif;font-size:10px;font-weight:700;text-shadow:0 0 4px #000,0 0 2px #000">${esc(c.name)}</span>`,
        iconSize: [80, 14],
        iconAnchor: [40, 7]
      }),
      interactive: false
    }).addTo(editor.map);
  });

  // Click to add waypoint
  editor.map.on('click', function(e) {
    const cx = Math.round(MAP_X0 + (e.latlng.lng / MAP_W) * (MAP_X1 - MAP_X0));
    const cy = Math.round(MAP_Y0 + ((MAP_H - e.latlng.lat) / MAP_H) * (MAP_Y1 - MAP_Y0));
    editorAddWaypoint(cx, cy, editor.floor, 'Step ' + (editor.waypoints.length + 1));
  });

  // Show coords on mouse move
  editor.map.on('mousemove', function(e) {
    const cx = Math.round(MAP_X0 + (e.latlng.lng / MAP_W) * (MAP_X1 - MAP_X0));
    const cy = Math.round(MAP_Y0 + ((MAP_H - e.latlng.lat) / MAP_H) * (MAP_Y1 - MAP_Y0));
    const coordsEl = document.getElementById('edMapCoords');
    if (coordsEl) coordsEl.textContent = `X: ${cx}, Y: ${cy}, Z: ${editor.floor}`;
  });

  editorUpdateFloorLabel();
}

function editorSetMode(mode, btn) {
  editor.mode = mode;
  document.querySelectorAll('.ed-mode-btn').forEach(b => b.classList.toggle('active', b === btn));
  const fixSelect = document.getElementById('edFixSpot');
  fixSelect.style.display = mode === 'fix' ? '' : 'none';
  if (mode === 'new') {
    editorClear();
    fixSelect.value = '-1';
  }
}

function editorFloor(dir) {
  const newFloor = editor.floor + dir;
  if (newFloor < 0 || newFloor > 15) return;
  editor.floor = newFloor;
  if (editor.map && editor.overlay) {
    editor.overlay.setUrl(MAP_URL(newFloor));
  }
  editorUpdateFloorLabel();
  editorDrawRoute();
}

function editorUpdateFloorLabel() {
  const df = 7 - editor.floor;
  const label = df === 0 ? 'Ground' : df > 0 ? '+' + df : String(df);
  const el = document.getElementById('edFloorLabel');
  if (el) el.textContent = label + ' (' + editor.floor + ')';
}

function editorAddWaypoint(cx, cy, floor, desc) {
  const [lat, lng] = tibiaToLeaflet(cx, cy);
  const idx = editor.waypoints.length;
  const isStairs = idx > 0 && editor.waypoints[idx - 1].floor !== floor;

  const marker = L.marker([lat, lng], {
    icon: L.divIcon({
      className: '',
      html: `<div class="step-marker ${isStairs ? 'step-marker-stairs' : ''}" style="width:22px;height:22px">${isStairs ? (floor > editor.waypoints[idx - 1].floor ? '↓' : '↑') : (idx + 1)}</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    })
  });

  const wp = { cx, cy, floor, desc, marker };
  editor.waypoints.push(wp);

  // Add marker only if on current floor
  if (floor === editor.floor) {
    marker.addTo(editor.routeLayer);
  }

  editorDrawRoute();
  editorRenderList();
}

function editorRemoveWaypoint(idx) {
  if (idx < 0 || idx >= editor.waypoints.length) return;
  const wp = editor.waypoints[idx];
  if (editor.routeLayer.hasLayer(wp.marker)) {
    editor.routeLayer.removeLayer(wp.marker);
  }
  editor.waypoints.splice(idx, 1);
  editorDrawRoute();
  editorRenderList();
}

function editorUndo() {
  if (editor.waypoints.length === 0) return;
  editorRemoveWaypoint(editor.waypoints.length - 1);
}

function editorClear() {
  editor.waypoints.forEach(wp => {
    if (editor.routeLayer && editor.routeLayer.hasLayer(wp.marker)) {
      editor.routeLayer.removeLayer(wp.marker);
    }
  });
  editor.waypoints = [];
  if (editor.routeLayer) editor.routeLayer.clearLayers();
  editorRenderList();

  // Clear form
  const fields = ['edName', 'edLvlMin', 'edLvlMax', 'edAccess', 'edRoute', 'edAuthor', 'edCreatures', 'edImbuements', 'edSupplies', 'edEquipment', 'edDrops', 'edTips', 'edExpH', 'edProfitH'];
  fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const citySelect = document.getElementById('edCity');
  if (citySelect) citySelect.value = '';
  document.querySelectorAll('.ed-vocs input').forEach(cb => cb.checked = true);

  editorSetStatus('');
}

function editorDrawRoute() {
  if (!editor.routeLayer) return;

  // Clear only polylines (keep markers)
  editor.routeLayer.eachLayer(layer => {
    if (layer instanceof L.Polyline && !(layer instanceof L.Marker)) {
      editor.routeLayer.removeLayer(layer);
    }
  });

  // Re-add all markers for current floor and draw lines
  const currentFloorWps = [];
  editor.waypoints.forEach((wp, i) => {
    // Remove and re-add marker with correct number
    if (editor.routeLayer.hasLayer(wp.marker)) {
      editor.routeLayer.removeLayer(wp.marker);
    }
    const isStairs = i > 0 && editor.waypoints[i - 1].floor !== wp.floor;
    const [lat, lng] = tibiaToLeaflet(wp.cx, wp.cy);
    wp.marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: '',
        html: `<div class="step-marker ${isStairs ? 'step-marker-stairs' : ''} ${i === 0 ? 'step-marker-start' : ''} ${i === editor.waypoints.length - 1 ? 'step-marker-end' : ''}">${isStairs ? (wp.floor > editor.waypoints[i - 1].floor ? '↓' : '↑') : (i + 1)}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      })
    }).bindTooltip(wp.desc, { className: 'map-tip', direction: 'top', offset: [0, -12] });

    if (wp.floor === editor.floor) {
      wp.marker.addTo(editor.routeLayer);
      currentFloorWps.push([lat, lng]);
    }
  });

  // Draw polyline for current floor segments
  if (currentFloorWps.length > 1) {
    L.polyline(currentFloorWps, {
      color: '#d4a537',
      weight: 3,
      opacity: 0.8,
      dashArray: '8 4'
    }).addTo(editor.routeLayer);
  }
}

function editorRenderList() {
  const list = document.getElementById('edWpList');
  const count = document.getElementById('edWpCount');
  if (!list) return;
  if (count) count.textContent = editor.waypoints.length + ' steps';

  if (editor.waypoints.length === 0) {
    list.innerHTML = '<div class="ed-wp-empty">Click on the map to add waypoints</div>';
    return;
  }

  list.innerHTML = editor.waypoints.map((wp, i) => {
    const df = 7 - wp.floor;
    const floorLabel = df === 0 ? 'Ground' : df > 0 ? '+' + df : String(df);
    const isStairs = i > 0 && editor.waypoints[i - 1].floor !== wp.floor;
    return `<div class="ed-wp-item" data-idx="${i}" onclick="editorFocusWp(${i})">
      <div class="ed-wp-num ${isStairs ? 'stairs' : ''}">${isStairs ? (wp.floor > editor.waypoints[i - 1].floor ? '↓' : '↑') : (i + 1)}</div>
      <div class="ed-wp-info">
        <input type="text" class="ed-wp-desc" value="${esc(wp.desc)}" onchange="editorUpdateDesc(${i},this.value)" onclick="event.stopPropagation()">
        <div class="ed-wp-floor">${floorLabel} (${wp.floor}) — X:${wp.cx} Y:${wp.cy}</div>
      </div>
      <button class="ed-wp-del" onclick="event.stopPropagation();editorRemoveWaypoint(${i})" title="Remove">✕</button>
    </div>`;
  }).join('');

  // Scroll to bottom
  list.scrollTop = list.scrollHeight;
}

function editorUpdateDesc(idx, desc) {
  if (idx < 0 || idx >= editor.waypoints.length) return;
  editor.waypoints[idx].desc = desc;
  // Update tooltip
  if (editor.waypoints[idx].marker) {
    editor.waypoints[idx].marker.unbindTooltip();
    editor.waypoints[idx].marker.bindTooltip(desc, { className: 'map-tip', direction: 'top', offset: [0, -12] });
  }
}

function editorFocusWp(idx) {
  if (idx < 0 || idx >= editor.waypoints.length) return;
  const wp = editor.waypoints[idx];

  // Switch floor if needed
  if (wp.floor !== editor.floor) {
    editor.floor = wp.floor;
    if (editor.overlay) editor.overlay.setUrl(MAP_URL(wp.floor));
    editorUpdateFloorLabel();
    editorDrawRoute();
  }

  // Pan to waypoint
  const [lat, lng] = tibiaToLeaflet(wp.cx, wp.cy);
  editor.map.setView([lat, lng], 2);

  // Highlight in list
  document.querySelectorAll('.ed-wp-item').forEach(el => el.classList.remove('active'));
  const item = document.querySelector(`.ed-wp-item[data-idx="${idx}"]`);
  if (item) item.classList.add('active');
}

function editorLoadSpot(idx) {
  if (idx < 0 || idx >= HUNTING_SPOTS.length) return;
  editorClear();

  const spot = HUNTING_SPOTS[idx];
  editor.fixSpotIdx = idx;

  // Fill form — basic info
  document.getElementById('edName').value = spot.name;
  document.getElementById('edCity').value = spot.city;
  document.getElementById('edLvlMin').value = spot.level[0];
  document.getElementById('edLvlMax').value = spot.level[1];
  document.getElementById('edAccess').value = spot.access || '';
  document.getElementById('edRoute').value = spot.route || '';
  document.getElementById('edExpH').value = spot.expH || '';
  document.getElementById('edProfitH').value = spot.profitH || '';
  document.getElementById('edTips').value = spot.tips || '';

  // Pre-fill creatures
  if (spot.creatures && spot.creatures.length) {
    document.getElementById('edCreatures').value = spot.creatures.map(c => {
      const name = typeof c === 'string' ? c : c.name;
      const hp = c.hp || '?';
      const xp = c.xp || '?';
      return `${name}, ${hp}, ${xp}`;
    }).join('\n');
  }

  // Pre-fill imbuements
  if (spot.imbuements && spot.imbuements.length) {
    document.getElementById('edImbuements').value = spot.imbuements.join(', ');
  }

  // Pre-fill supplies
  if (spot.supplies) {
    const lines = [];
    Object.entries(spot.supplies).forEach(([voc, items]) => {
      if (items && items.length) lines.push(voc.toUpperCase().substring(0,2) + ': ' + items.join(', '));
    });
    document.getElementById('edSupplies').value = lines.join('\n');
  }

  // Pre-fill drops
  if (spot.drops && spot.drops.length) {
    document.getElementById('edDrops').value = spot.drops.join(', ');
  }

  // Pre-fill author from localStorage if available
  const savedBuild = localStorage.getItem('tv_build');
  if (savedBuild) {
    try {
      const b = JSON.parse(savedBuild);
      if (b.name && !document.getElementById('edAuthor').value) {
        document.getElementById('edAuthor').value = b.name;
      }
    } catch(e) {}
  }

  // Vocations
  document.querySelectorAll('.ed-vocs input').forEach(cb => {
    cb.checked = spot.voc.includes(cb.value);
  });

  // Load existing waypoints
  if (spot.waypoints && spot.waypoints.length > 0) {
    spot.waypoints.forEach(wp => {
      const cx = wp[0], cy = wp[1], desc = wp[2] || '', floor = wp[3] || 7;
      editorAddWaypoint(cx, cy, floor, desc);
    });

    // Center map on first waypoint
    const first = spot.waypoints[0];
    const [lat, lng] = tibiaToLeaflet(first[0], first[1]);
    editor.map.setView([lat, lng], 1);
  } else {
    // Center on city
    const city = CITIES.find(c => c.name === spot.city);
    if (city) {
      const [lat, lng] = tibiaToLeaflet(city.cx, city.cy);
      editor.map.setView([lat, lng], 1);
    }
  }
}

function editorPreview() {
  if (editor.waypoints.length < 2) {
    editorSetStatus('Add at least 2 waypoints to preview.', 'error');
    return;
  }

  // Fit map to all waypoints
  const latlngs = editor.waypoints.map(wp => tibiaToLeaflet(wp.cx, wp.cy));
  editor.map.fitBounds(latlngs, { padding: [30, 30] });

  // Show floor of first waypoint
  editor.floor = editor.waypoints[0].floor;
  if (editor.overlay) editor.overlay.setUrl(MAP_URL(editor.floor));
  editorUpdateFloorLabel();
  editorDrawRoute();

  editorSetStatus('Route preview updated. Review your waypoints on the map.', 'info');
}

function editorSubmit() {
  // Collect all fields
  const name = document.getElementById('edName').value.trim();
  const city = document.getElementById('edCity').value;
  const lvlMin = parseInt(document.getElementById('edLvlMin').value) || 0;
  const lvlMax = parseInt(document.getElementById('edLvlMax').value) || 0;
  const access = document.getElementById('edAccess').value.trim();
  const route = document.getElementById('edRoute').value.trim();
  const author = document.getElementById('edAuthor').value.trim();
  const creatures = document.getElementById('edCreatures').value.trim();
  const imbuements = document.getElementById('edImbuements').value.trim();
  const supplies = document.getElementById('edSupplies').value.trim();
  const equipment = document.getElementById('edEquipment').value.trim();
  const drops = document.getElementById('edDrops').value.trim();
  const tips = document.getElementById('edTips').value.trim();
  const expH = document.getElementById('edExpH').value.trim();
  const profitH = document.getElementById('edProfitH').value.trim();
  const vocs = [];
  document.querySelectorAll('.ed-vocs input:checked').forEach(cb => vocs.push(cb.value));

  // Collect hunt modes
  const huntModes = {};
  document.querySelectorAll('.ed-hunt-modes .ed-hm').forEach(lbl => {
    const cb = lbl.querySelector('input[type="checkbox"][value]');
    if (!cb || !cb.checked) return;
    const mode = cb.value;
    const sameAsSpot = lbl.querySelector('.ed-hm-same input')?.checked;
    if (sameAsSpot) { huntModes[mode] = true; }
    else {
      const min = parseInt(lbl.querySelector('.ed-hm-min')?.value) || 0;
      const max = parseInt(lbl.querySelector('.ed-hm-max')?.value) || 0;
      huntModes[mode] = (min && max) ? [min, max] : true;
    }
  });

  // Validation
  if (!author) { editorSetStatus('Character name is required for Tibia Coins rewards.', 'error'); return; }
  if (!name) { editorSetStatus('Please enter a spot name.', 'error'); return; }
  if (!city) { editorSetStatus('Please select a city.', 'error'); return; }

  // For "fix" mode, waypoints are optional (user might just be fixing creatures/gear)
  const isFullSubmission = editor.waypoints.length >= 2 && route;
  const isEditSubmission = creatures || imbuements || supplies || equipment || drops || tips;

  if (!isFullSubmission && !isEditSubmission) {
    editorSetStatus('Add waypoints + route description for a full guide, or fill in creature/gear/supply details for a spot edit.', 'error');
    return;
  }

  // Rate limiting
  const lastSubmit = localStorage.getItem('tp_last_submit');
  if (lastSubmit && Date.now() - parseInt(lastSubmit) < 300000) {
    const remaining = Math.ceil((300000 - (Date.now() - parseInt(lastSubmit))) / 60000);
    editorSetStatus(`Please wait ${remaining} minute(s) before submitting again.`, 'error');
    return;
  }

  // Build waypoints array (data.js format)
  const waypointsData = editor.waypoints.map(wp => {
    const arr = [wp.cx, wp.cy, wp.desc];
    if (wp.floor !== 7) arr.push(wp.floor);
    return arr;
  });

  // Determine submission type and reward tier
  const isNewFull = editor.mode === 'new' && isFullSubmission;
  const submissionType = isNewFull ? 'New Full Guide' : 'Spot Edit';
  const rewardTier = isNewFull ? 'Route Creator (250 TC/week)' : 'Spot Editor (50 TC/week)';

  const spotData = {
    type: submissionType,
    rewardTier,
    name, city,
    level: [lvlMin, lvlMax],
    voc: vocs,
    access, route,
    waypoints: waypointsData,
    creatures, imbuements, supplies, equipment, drops, tips,
    huntModes,
    expH, profitH,
    author,
    timestamp: new Date().toISOString()
  };

  if (editor.mode === 'fix' && editor.fixSpotIdx >= 0) {
    spotData.fixingSpot = HUNTING_SPOTS[editor.fixSpotIdx].name;
  }

  // Build Discord embeds — visual for admin review
  const floorsUsed = [...new Set(editor.waypoints.map(wp => wp.floor))].sort();
  const floorLabels = floorsUsed.map(f => {
    const df = 7 - f;
    return df === 0 ? 'Ground' : df > 0 ? '+' + df : String(df);
  });

  // Main info embed
  const embedFields = [
    { name: 'Type', value: isNewFull ? '🆕 New Full Guide' : '✏️ Spot Edit', inline: true },
    { name: 'Reward Tier', value: rewardTier, inline: true },
    { name: 'Spot', value: name, inline: true },
    { name: 'City', value: city, inline: true },
    { name: 'Level', value: lvlMin && lvlMax ? `${lvlMin}-${lvlMax}` : 'Not specified', inline: true },
    { name: 'Vocations', value: vocs.length ? vocs.map(v => vocAbbr(v)).join(', ') : 'All', inline: true }
  ];

  if (editor.waypoints.length > 0) {
    embedFields.push({ name: '🗺️ Waypoints', value: `${editor.waypoints.length} steps, floors: ${floorLabels.join(', ')}` });
  }
  if (route) embedFields.push({ name: '📍 Route', value: route.substring(0, 500) });
  if (access) embedFields.push({ name: '🔑 Access', value: access.substring(0, 300) });
  if (creatures) embedFields.push({ name: '👹 Creatures', value: creatures.substring(0, 500) });
  if (imbuements) embedFields.push({ name: '🔮 Imbuements', value: imbuements.substring(0, 300) });
  if (equipment) embedFields.push({ name: '🛡️ Equipment', value: equipment.substring(0, 500) });
  if (supplies) embedFields.push({ name: '🧪 Supplies', value: supplies.substring(0, 500) });
  if (drops) embedFields.push({ name: '💰 Drops', value: drops.substring(0, 300) });
  if (tips) embedFields.push({ name: '💡 Tips', value: tips.substring(0, 300) });
  if (expH) embedFields.push({ name: '⚡ EXP/h', value: expH, inline: true });
  if (profitH) embedFields.push({ name: '💵 Profit/h', value: profitH, inline: true });

  const mainEmbed = {
    title: isNewFull ? '🆕 New Hunting Guide Submission' : '✏️ Spot Edit Submission',
    color: isNewFull ? 0x22c55e : 0x3b82f6,
    fields: embedFields,
    footer: { text: `Submitted by ${author} • TC rewards: ${rewardTier}` },
    timestamp: new Date().toISOString()
  };

  const jsonBlob = JSON.stringify(spotData, null, 2);

  // Try Discord webhook — send visual embed + JSON in separate message
  if (DISCORD_WEBHOOK && DISCORD_WEBHOOK !== 'YOUR_WEBHOOK_URL_HERE') {
    // First message: visual embed for admin
    fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [mainEmbed] })
    })
    .then(res => {
      if (!res.ok) throw new Error('Webhook returned ' + res.status);
      // Second message: JSON data for copy-paste into data.js
      return fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '**Data for data.js:**\n```json\n' + jsonBlob.substring(0, 1900) + '\n```' })
      });
    })
    .then(res => {
      if (res.ok) {
        localStorage.setItem('tp_last_submit', String(Date.now()));
        editorSetStatus('Submitted! Thank you ' + author + '! Your submission is being reviewed. ' + rewardTier, 'success');
      } else {
        throw new Error('Second webhook failed');
      }
    })
    .catch(() => {
      editorCopyFallback(jsonBlob);
    });
  } else {
    editorCopyFallback(jsonBlob);
  }
}

function editorCopyFallback(jsonBlob) {
  navigator.clipboard.writeText(jsonBlob).then(() => {
    localStorage.setItem('tp_last_submit', String(Date.now()));
    editorSetStatus('Route data copied to clipboard! Paste it in our Discord channel or send to the admin for review.', 'info');
  }).catch(() => {
    // Final fallback: show in a textarea
    editorSetStatus('Could not copy automatically. Please copy the data below manually:', 'info');
    const statusEl = document.getElementById('edStatus');
    statusEl.innerHTML += '<textarea style="width:100%;height:120px;margin-top:8px;background:var(--bg-input);color:var(--parchment);border:1px solid var(--border);border-radius:var(--r);padding:8px;font-family:monospace;font-size:11px" readonly>' + esc(jsonBlob) + '</textarea>';
  });
}

function editorSetStatus(msg, type) {
  const el = document.getElementById('edStatus');
  if (!el) return;
  el.className = 'ed-status';
  if (msg && type) {
    el.classList.add(type);
    el.textContent = msg;
  }
}

// Toggle feedback form on hunt cards
function toggleFeedback(btn) {
  const fb = (btn.closest('.hunt-modal-content') || btn.closest('.hunt-body'))?.querySelector('.spot-feedback');
  if (fb) fb.style.display = fb.style.display === 'none' ? 'block' : 'none';
  // Attach toggle listeners for checkbox → textarea visibility (fallback for :has())
  if (fb) {
    fb.querySelectorAll('.fb-cat').forEach(cb => {
      if (cb._fbBound) return;
      cb._fbBound = true;
      cb.addEventListener('change', function() {
        const sec = this.closest('.fb-sec');
        const field = sec?.querySelector('.fb-field');
        if (field) field.style.display = this.checked ? 'block' : 'none';
      });
    });
  }
}

// Submit spot feedback to Discord
function submitFeedback(btn, spotIdx) {
  const fb = btn.closest('.spot-feedback');
  const categories = [];
  fb.querySelectorAll('.fb-cat:checked').forEach(cb => categories.push(cb.value));
  const author = fb.querySelector('.fb-author').value.trim() || 'Anonymous';
  const statusEl = fb.querySelector('.fb-status');

  if (categories.length === 0) { statusEl.textContent = 'Check at least one category and fill in the details.'; statusEl.style.color = 'var(--fire)'; return; }

  // Collect text from each checked category's field
  const feedbackFields = [];
  let hasContent = false;
  categories.forEach(cat => {
    const field = fb.querySelector(`.fb-field[data-cat="${cat}"]`);
    const text = field ? field.value.trim() : '';
    if (text) {
      hasContent = true;
      feedbackFields.push({ name: cat.charAt(0).toUpperCase() + cat.slice(1), value: text.substring(0, 500) });
    }
  });

  if (!hasContent) { statusEl.textContent = 'Please fill in at least one category field.'; statusEl.style.color = 'var(--fire)'; return; }

  const spot = HUNTING_SPOTS[spotIdx];
  const embed = {
    title: 'Spot Feedback: ' + spot.name,
    color: 0x3b82f6,
    fields: [
      { name: 'Spot', value: spot.name, inline: true },
      { name: 'Submitter', value: author, inline: true },
      { name: 'Categories', value: categories.join(', '), inline: true },
      ...feedbackFields
    ],
    timestamp: new Date().toISOString()
  };

  const payload = { embeds: [embed] };

  if (DISCORD_WEBHOOK && DISCORD_WEBHOOK !== 'YOUR_WEBHOOK_URL_HERE') {
    fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => {
      if (res.ok) {
        statusEl.textContent = 'Feedback sent! Thank you for contributing.';
        statusEl.style.color = 'var(--common)';
        // Clear all fields
        fb.querySelectorAll('.fb-field').forEach(f => f.value = '');
        fb.querySelectorAll('.fb-cat').forEach(cb => cb.checked = false);
      } else {
        statusEl.textContent = 'Failed to send. Try again later.';
        statusEl.style.color = 'var(--fire)';
      }
    }).catch(() => {
      statusEl.textContent = 'Network error. Try again later.';
      statusEl.style.color = 'var(--fire)';
    });
  } else {
    statusEl.textContent = 'Webhook not configured.';
    statusEl.style.color = 'var(--fire)';
  }
}

// Sub-tab switching for Hunting System
function switchHuntTab(tab, btn, mode) {
  document.querySelectorAll('.hunt-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.hunt-tab-content').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const tabEl = document.getElementById('htab-' + tab);
  if (tabEl) tabEl.classList.add('active');
  if (mode) { state.hunting.huntMode = mode; renderHunting(); }
  if (tab === 'editor') initEditor();
}

// Toggle hunt mode range inputs in editor
function toggleHMRange(cb) {
  const rangeSpan = cb.closest('.ed-hm-range');
  if (!rangeSpan) return;
  const inputs = rangeSpan.querySelectorAll('.ed-hm-min, .ed-hm-max');
  inputs.forEach(inp => { inp.disabled = cb.checked; if (cb.checked) inp.value = ''; });
}

// Open editor pre-filled with a spot (called from hunt cards)
function editorFixSpot(idx) {
  showPanel('hunting');
  setTimeout(() => {
    switchHuntTab('editor', document.querySelector('.hunt-tab-create'));
    const fixBtn = document.querySelector('.ed-mode-btn[data-mode="fix"]');
    if (fixBtn) editorSetMode('fix', fixBtn);
    document.getElementById('edFixSpot').value = idx;
    editorLoadSpot(idx);
  }, 200);
}
