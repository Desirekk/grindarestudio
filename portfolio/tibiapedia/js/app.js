// ================================================================
// TibiaPedia v3 — Application Logic
// Dual API: TibiaData (live) + TibiaWiki (rich creature data)
// ================================================================
const API = 'https://api.tibiadata.com/v4';
const WIKI_API = 'https://tibiawiki.dev/api';
const MAP_URL = f => `https://tibiamaps.github.io/tibia-map-data/floor-${String(f).padStart(2,'0')}-map.png`;
const MAP_W = 2560, MAP_H = 2048;
const MAP_X0 = 31744, MAP_X1 = 34304, MAP_Y0 = 30976, MAP_Y1 = 33024;
const PER_PAGE = 60;

// Caches
const cache = { creatures: null, creatureDetail: {}, wikiDetail: {}, spells: null, worlds: null, news: null };

// State
const state = {
  panel: 'news', bestiary: { list: [], filtered: [], page: 0, search: '', detail: null },
  hunting: { voc: 'all', levelMin: 0, levelMax: 9999, myVoc: 'knight', myLevel: 150 },
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
    news: loadNews, bestiary: loadBestiary, hunting: renderHunting,
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

function renderHunting() {
  const container = document.getElementById('huntingGrid');
  if (!container) return;
  const { voc, levelMin, levelMax, myLevel } = state.hunting;
  const filtered = HUNTING_SPOTS.filter(s => {
    if (voc !== 'all') {
      let matchVoc = s.voc.includes(voc);
      if (!matchVoc && voc === 'monk') matchVoc = s.voc.includes('knight');
      if (!matchVoc) return false;
    }
    if (s.level[0] > levelMax || s.level[1] < levelMin) return false;
    if (myLevel > 0 && (myLevel < s.level[0] - 20 || myLevel > s.level[1] + 50)) return false;
    return true;
  });

  document.getElementById('huntCount').textContent = `${filtered.length} spots`;

  container.innerHTML = filtered.length ? '<div class="hunt-list">' + filtered.map((s, idx) => {
    const vocBadges = s.voc.map(v => `<span class="hunt-voc">${v.substring(0,2).toUpperCase()}</span>`).join('');
    const charmElement = ch => {
      const charm = CHARMS[ch];
      if (!charm) return 'physical';
      return charm.element || 'null';
    };

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

    // Imbuements — with icons
    const imbuIcons = {Vampirism:'Vampire Teeth',Void:'Rope Belt',Strike:'Swamp Grass',Bash:'Cyclops Toe',Chop:'Piece of Scarab Shell',Slash:'Lion\'s Mane',Epiphany:'Strand of Medusa Hair',Lich:'Flask of Embalming Fluid',Reap:'Piece of Dead Brain',Swiftness:'Damselfly Wing',Vibrancy:'Wereboar Hooves',Scorch:'Fiery Heart',Frost:'Frosty Heart',Electrify:'Rorc Feather',Venom:'Swamp Grass'};
    const imbuHtml = (s.imbuements || []).map(i => {
      const imbuName = i.replace(/^\d+x?\s*/i, '');
      const mainWord = imbuName.split(/[\s(]/)[0];
      const icon = imbuIcons[mainWord] || '';
      return `<span class="imbu-chip">${icon ? `<img src="${WIKI_IMG(icon)}" onerror="this.style.display='none'">` : ''}${esc(i)}</span>`;
    }).join('');

    // Supplies — filtered to player's vocation
    const myVoc = state.hunting.myVoc;
    const myLevel = state.hunting.myLevel;
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

    // Drops — visual grid with item icons
    const dropsHtml = (s.drops || []).map(d => `<div class="drop-item"><img src="${WIKI_IMG(d)}" alt="${esc(d)}" onerror="this.style.display='none'"><span class="drop-name">${esc(d)}</span></div>`).join('');

    // Gear — personalized per vocation + level
    let gearHtml = '';
    const tier = getGearForVocLevel(myVoc, myLevel);
    if (tier) {
      const vocLabel = myVoc.charAt(0).toUpperCase() + myVoc.slice(1);
      const chips = tier.items.map(i => `<span class="gear-item"><img src="${WIKI_IMG(i)}" alt="${esc(i)}" onerror="this.style.display='none'">${esc(i)}</span>`).join('');
      gearHtml = `<div class="gear-bracket gear-active"><h6><img src="${WIKI_IMG(vocLabel)}" onerror="this.style.display='none'" style="width:20px;height:20px"> ${esc(vocLabel)} — Level ${myLevel}</h6><div class="gear-items">${chips}</div></div>`;
      // Add element protection suggestions
      if (s.prot && s.prot.length) {
        const protChips = s.prot.map(el => {
          const p = ELEMENT_PROT[el];
          if (!p) return '';
          return `<span class="gear-item gear-prot elem-bg-${el}"><img src="${WIKI_IMG(p.amulet)}" alt="${esc(p.desc)}" onerror="this.style.display='none'">${esc(p.desc)}: ${esc(p.amulet)}</span>`;
        }).filter(Boolean).join('');
        if (protChips) gearHtml += `<div class="gear-bracket gear-prot-section"><h6>Recommended Protection</h6><div class="gear-items">${protChips}</div></div>`;
      }
    }

    const mainCreature = s.creatures[0] ? (typeof s.creatures[0]==='string'?s.creatures[0]:s.creatures[0].name) : '';

    return `<div class="hunt-card" id="hunt-${idx}">
      ${mainCreature ? `<img class="hunt-bg" src="${WIKI_IMG(mainCreature)}" alt="" onerror="this.style.display='none'">` : ''}
      <div class="hunt-head" onclick="this.parentElement.classList.toggle('open')">
        <span class="hunt-arrow">&#9654;</span>
        <span class="hunt-title">${esc(s.name)}</span>
        <span class="hunt-header-creatures">${s.creatures.slice(0,5).map(c=>{const cn=typeof c==='string'?c:c.name;return`<img src="${WIKI_IMG(cn)}" alt="${esc(cn)}" title="${esc(cn)}" onerror="this.style.display='none'">`}).join('')}</span>
        ${renderStars(s.name)}
        <div class="hunt-badges">
          <div class="hunt-vocs">${vocBadges}</div>
          <span class="hunt-lvl">${s.level[0]}-${s.level[1]}</span>
          <span class="hunt-team">${s.team || 'solo'}</span>
        </div>
      </div>
      <div class="hunt-metrics">
        <div class="hunt-metric"><div class="hm-val">${s.level[0]}+</div><div class="hm-label">Rec. Level</div></div>
        <div class="hunt-metric"><div class="hm-val">${s.expH || '?'}</div><div class="hm-label">Raw EXP/h</div></div>
        <div class="hunt-metric"><div class="hm-val">${s.profitH || '?'}</div><div class="hm-label">Profit/h</div></div>
        <div class="hunt-metric"><div class="hm-val">${s.premium ? 'Yes' : 'No'}</div><div class="hm-label">Premium</div></div>
      </div>
      <div class="hunt-body">

        <div class="hunt-sec">
          <div class="hunt-sec-title"><img src="${WIKI_IMG('Map_(Item)')}" onerror="this.style.display='none'"> Route & Access</div>
          <div class="hunt-route">
            <div class="hunt-minimap" id="minimap-${idx}"></div>
            ${s.waypoints && s.waypoints.some(wp => wp[2]) ? `<div class="route-steps">${s.waypoints.filter(wp => wp[2]).map((wp, i) => {
              const floor = wp[3] || 7;
              const floorBadge = floor !== 7 ? ` <span class="rs-floor">Floor ${floor > 7 ? '-' + (floor - 7) : '+' + (7 - floor)}</span>` : '';
              return `<div class="route-step${floor !== 7 ? ' rs-underground' : ''}"><span class="rs-num">${i + 1}</span>${esc(wp[2])}${floorBadge}</div>`;
            }).join('')}</div>` : `<div class="hunt-route-text">${esc(s.route || '')}</div>`}
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

        <div style="margin-top:12px;display:flex;gap:8px">
          ${s.cx ? `<button class="btn-s btn-g" onclick="showOnMap(${s.cx},${s.cy},'${esc(s.name).replace(/'/g,"\\'")}')">Show on World Map</button>` : ''}
          <button class="btn-s" onclick="viewSpotCreatures([${s.creatures.map(c => `'${esc(typeof c === 'string' ? c : c.name).replace(/'/g,"\\'")}'`).join(',')}])">View in Bestiary</button>
        </div>
      </div>
    </div>`;
  }).join('') + '</div>' : '<div class="empty">No spots match your filters.</div>';

  // Init mini maps for open cards
  initHuntMiniMaps(filtered);
}

function initHuntMiniMaps(spots) {
  document.querySelectorAll('.hunt-card').forEach((card, idx) => {
    const head = card.querySelector('.hunt-head');
    if (!head) return;
    head.onclick = function() {
      card.classList.toggle('open');
      if (card.classList.contains('open')) {
        const mapEl = card.querySelector('.hunt-minimap');
        if (mapEl && !mapEl._leaflet_id) {
          const s = spots[idx];
          if (s && s.cx && s.cy && typeof L !== 'undefined') {
            setTimeout(() => initSpotMiniMap(mapEl, s), 50);
          }
        }
      }
    };
  });
}

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
      const label = wp[2] || '';
      const num = i + 1;
      const isFirst = i === 0;
      const isLast = i === spot.waypoints.length - 1;
      const nextF = i < spot.waypoints.length - 1 ? (spot.waypoints[i + 1][3] || 7) : curFloor;
      const prevF = i > 0 ? (spot.waypoints[i - 1][3] || 7) : curFloor;
      const goDown = nextF > curFloor;
      const goUp = nextF < curFloor && nextF !== curFloor;
      const cameFrom = prevF !== curFloor;

      let cls = 'step-marker';
      let ml = String(num);
      if (isFirst && !cameFrom) cls += ' step-marker-start';
      else if (isLast && !goDown && !goUp) cls += ' step-marker-end';
      else if (goDown) { cls += ' step-marker-stairs'; ml = '↓'; }
      else if (goUp) { cls += ' step-marker-stairs'; ml = '↑'; }
      else if (cameFrom) { cls += ' step-marker-stairs'; ml = prevF > curFloor ? '↑' : '↓'; }

      const marker = L.marker([lat, lng], { icon: stepIcon(ml, cls) });
      let tip = '<b>' + num + '.</b> ' + label;
      if (goDown) tip += ' ⬇ go down';
      if (goUp) tip += ' ⬆ go up';
      if (label) marker.bindTooltip(tip, tipOpts);
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
      const short = v.replace('Elder ', 'E').replace('Royal ', 'R').substring(0, 2).toUpperCase();
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
