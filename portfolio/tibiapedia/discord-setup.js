// ================================================================
// TibiaVault Discord Server Setup Script
// Run once: node discord-setup.js YOUR_BOT_TOKEN YOUR_SERVER_ID
// ================================================================

const BOT_TOKEN = process.argv[2];
const GUILD_ID = process.argv[3];

if (!BOT_TOKEN || !GUILD_ID) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║           TibiaVault Discord Server Setup                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Usage: node discord-setup.js BOT_TOKEN SERVER_ID            ║
║                                                              ║
║  Steps:                                                      ║
║  1. Go to https://discord.com/developers/applications        ║
║  2. Click "New Application" → name: "TibiaVault Bot"         ║
║  3. Go to "Bot" tab → click "Reset Token" → copy token       ║
║  4. Turn ON all 3 Privileged Gateway Intents                 ║
║  5. Go to "OAuth2" → "URL Generator"                         ║
║     - Scopes: bot                                            ║
║     - Bot Permissions: Administrator                         ║
║  6. Copy the generated URL → open in browser → add to server ║
║  7. Right-click your server icon → "Copy Server ID"          ║
║     (Enable Developer Mode: Settings → Advanced → Dev Mode)  ║
║  8. Run: node discord-setup.js YOUR_TOKEN YOUR_SERVER_ID     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
  process.exit(1);
}

const BASE = 'https://discord.com/api/v10';

async function api(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bot ${BOT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${endpoint}`, opts);

  // Rate limit handling
  if (res.status === 429) {
    const data = await res.json();
    const wait = (data.retry_after || 1) * 1000 + 100;
    console.log(`  Rate limited, waiting ${Math.ceil(wait/1000)}s...`);
    await sleep(wait);
    return api(endpoint, method, body);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${endpoint} → ${res.status}: ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Permission bit flags
const P = {
  VIEW:            0x0000000000000400n,
  SEND:            0x0000000000000800n,
  SEND_THREADS:    0x0000004000000000n,
  MANAGE_MSG:      0x0000000000002000n,
  EMBED:           0x0000000000004000n,
  ATTACH:          0x0000000000008000n,
  HISTORY:         0x0000000000010000n,
  MENTION_EVERYONE:0x0000000000020000n,
  REACT:           0x0000000000000040n,
  CONNECT:         0x0000000000100000n,
  SPEAK:           0x0000000000200000n,
  KICK:            0x0000000000000002n,
  BAN:             0x0000000000000004n,
  MANAGE_CHANNELS: 0x0000000000000010n,
  MANAGE_ROLES:    0x0000000010000000n,
  MUTE_MEMBERS:    0x0000000000400000n,
  MANAGE_NICKNAMES:0x0000000008000000n,
  ADMIN:           0x0000000000000008n,
};

async function main() {
  console.log('\n⚔️  TibiaVault Discord Setup\n');

  // Verify connection
  const me = await api('/users/@me');
  console.log(`✓ Bot connected: ${me.username}#${me.discriminator}\n`);

  // Get guild info
  const guild = await api(`/guilds/${GUILD_ID}`);
  console.log(`✓ Server: ${guild.name}\n`);

  // Get @everyone role ID (same as guild ID)
  const everyoneId = GUILD_ID;

  // ────────────────────────────────────────────
  // 1. DELETE existing channels (clean slate)
  // ────────────────────────────────────────────
  console.log('Cleaning existing channels...');
  const existingChannels = await api(`/guilds/${GUILD_ID}/channels`);
  for (const ch of existingChannels) {
    try {
      await api(`/channels/${ch.id}`, 'DELETE');
      await sleep(300);
    } catch (e) { /* ignore */ }
  }
  console.log('✓ Cleaned\n');

  // ────────────────────────────────────────────
  // 2. CREATE ROLES
  // ────────────────────────────────────────────
  console.log('Creating roles...');

  const roles = {};

  // Admin role
  roles.admin = await api(`/guilds/${GUILD_ID}/roles`, 'POST', {
    name: 'Admin',
    color: 0xe74c3c,
    permissions: String(P.ADMIN),
    hoist: true,
    mentionable: false
  });
  console.log('  ✓ Admin (red)');
  await sleep(300);

  // Moderator role
  const modPerms = P.KICK | P.MANAGE_MSG | P.MUTE_MEMBERS | P.MANAGE_NICKNAMES | P.VIEW | P.SEND | P.HISTORY | P.EMBED | P.ATTACH | P.REACT;
  roles.mod = await api(`/guilds/${GUILD_ID}/roles`, 'POST', {
    name: 'Moderator',
    color: 0xf59e0b,
    permissions: String(modPerms),
    hoist: true,
    mentionable: false
  });
  console.log('  ✓ Moderator (orange)');
  await sleep(300);

  // Route Verified role
  roles.verified = await api(`/guilds/${GUILD_ID}/roles`, 'POST', {
    name: 'Route Verified',
    color: 0x22c55e,
    permissions: '0',
    hoist: true,
    mentionable: false
  });
  console.log('  ✓ Route Verified (green)');
  await sleep(300);

  // Contributor role
  roles.contributor = await api(`/guilds/${GUILD_ID}/roles`, 'POST', {
    name: 'Contributor',
    color: 0xd4a537,
    permissions: '0',
    hoist: true,
    mentionable: false
  });
  console.log('  ✓ Contributor (gold)');
  await sleep(300);

  console.log('');

  // ────────────────────────────────────────────
  // 3. CREATE CATEGORIES & CHANNELS
  // ────────────────────────────────────────────
  console.log('Creating channels...\n');

  // Helper: create category
  async function createCategory(name, overwrites = []) {
    const cat = await api(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name,
      type: 4, // GUILD_CATEGORY
      permission_overwrites: overwrites
    });
    await sleep(400);
    return cat;
  }

  // Helper: create text channel in category
  async function createText(name, categoryId, topic = '', overwrites = null) {
    const data = {
      name,
      type: 0, // GUILD_TEXT
      parent_id: categoryId,
      topic
    };
    if (overwrites) data.permission_overwrites = overwrites;
    const ch = await api(`/guilds/${GUILD_ID}/channels`, 'POST', data);
    console.log(`  ✓ #${name}`);
    await sleep(400);
    return ch;
  }

  // ── 📢 INFORMATION ──
  const catInfo = await createCategory('📢 INFORMATION');
  console.log('📢 INFORMATION');

  await createText('announcements', catInfo.id,
    'Official TibiaVault announcements and updates',
    [{
      id: everyoneId,
      type: 0, // role
      deny: String(P.SEND),
      allow: String(P.VIEW | P.HISTORY | P.REACT)
    }]
  );

  await createText('rules', catInfo.id,
    'Server rules — read before participating',
    [{
      id: everyoneId,
      type: 0,
      deny: String(P.SEND),
      allow: String(P.VIEW | P.HISTORY)
    }]
  );

  await createText('changelog', catInfo.id,
    'TibiaVault website updates and new features',
    [{
      id: everyoneId,
      type: 0,
      deny: String(P.SEND),
      allow: String(P.VIEW | P.HISTORY | P.REACT)
    }]
  );

  console.log('');

  // ── 🗺️ ROUTE SUBMISSIONS ──
  const catRoutes = await createCategory('🗺️ ROUTE SUBMISSIONS');
  console.log('🗺️ ROUTE SUBMISSIONS');

  const webhookChannel = await createText('route-submissions', catRoutes.id,
    '🤖 Automated route submissions from TibiaVault — DO NOT post here manually',
    [{
      id: everyoneId,
      type: 0,
      deny: String(P.SEND),
      allow: String(P.VIEW | P.HISTORY | P.REACT)
    }]
  );

  await createText('route-discussion', catRoutes.id,
    'Discuss submitted routes, suggest improvements, give feedback');

  await createText('route-requests', catRoutes.id,
    'Request new hunting spot routes to be added to TibiaVault');

  console.log('');

  // ── ⚔️ HUNTING ──
  const catHunting = await createCategory('⚔️ HUNTING');
  console.log('⚔️ HUNTING');

  await createText('hunting-chat', catHunting.id,
    'General hunting discussion — share tips, ask for advice');

  await createText('team-hunting', catHunting.id,
    'Find teammates for team hunts — post your world, level, and vocation');

  await createText('loot-screenshots', catHunting.id,
    'Show off your best loot drops and hunt analyzer results');

  console.log('');

  // ── 💬 COMMUNITY ──
  const catCommunity = await createCategory('💬 COMMUNITY');
  console.log('💬 COMMUNITY');

  await createText('general', catCommunity.id,
    'General Tibia chat — anything goes');

  await createText('introductions', catCommunity.id,
    'New here? Introduce yourself — world, vocation, level');

  await createText('suggestions', catCommunity.id,
    'Ideas and suggestions for TibiaVault website improvements');

  await createText('bug-reports', catCommunity.id,
    'Found a bug on TibiaVault? Report it here');

  console.log('');

  // ── 🤖 ADMIN (hidden) ──
  const catAdmin = await createCategory('🤖 ADMIN', [{
    id: everyoneId,
    type: 0,
    deny: String(P.VIEW),
    allow: '0'
  }]);
  console.log('🤖 ADMIN (hidden)');

  await createText('admin-chat', catAdmin.id,
    'Private admin discussion',
    [{
      id: everyoneId,
      type: 0,
      deny: String(P.VIEW),
      allow: '0'
    }]
  );

  await createText('webhook-logs', catAdmin.id,
    'Webhook and bot logs',
    [{
      id: everyoneId,
      type: 0,
      deny: String(P.VIEW),
      allow: '0'
    }]
  );

  console.log('');

  // ────────────────────────────────────────────
  // 4. CREATE WEBHOOK on #route-submissions
  // ────────────────────────────────────────────
  console.log('Creating webhook...');
  const webhook = await api(`/channels/${webhookChannel.id}/webhooks`, 'POST', {
    name: 'TibiaVault Routes'
  });
  console.log(`✓ Webhook created!\n`);

  // ────────────────────────────────────────────
  // 5. POST welcome message in #rules
  // ────────────────────────────────────────────
  console.log('Posting rules...');
  const rulesChannel = existingChannels.length === 0
    ? (await api(`/guilds/${GUILD_ID}/channels`)).find(c => c.name === 'rules')
    : null;

  const allChannels = await api(`/guilds/${GUILD_ID}/channels`);
  const rulesChId = allChannels.find(c => c.name === 'rules')?.id;

  if (rulesChId) {
    await api(`/channels/${rulesChId}/messages`, 'POST', {
      embeds: [{
        title: '⚔️ TibiaVault Community Rules',
        color: 0xd4a537,
        description: [
          '**1.** Be respectful to all members',
          '**2.** English and Polish are the main languages',
          '**3.** No spam, no advertising other servers',
          '**4.** Keep discussions in the right channels',
          '**5.** No cheating tools, bots, or illegal game modifications',
          '**6.** Route submissions must be accurate and tested in-game',
          '**7.** Do not post fake or troll routes',
          '**8.** Have fun and help the community! 🛡️',
        ].join('\n'),
        footer: { text: 'TibiaVault — The Vault of Tibia Knowledge' }
      }]
    });
    console.log('✓ Rules posted\n');
  }

  // Post in announcements
  const annChId = allChannels.find(c => c.name === 'announcements')?.id;
  if (annChId) {
    await api(`/channels/${annChId}/messages`, 'POST', {
      embeds: [{
        title: '🏰 Welcome to TibiaVault!',
        color: 0xd4a537,
        description: [
          'Welcome to the official TibiaVault Discord community!',
          '',
          '**What is TibiaVault?**',
          'A comprehensive Tibia companion website with bestiary, hunting spots, equipment planner, interactive map, quest guides, and more.',
          '',
          '**Community Routes**',
          'Help us build the best hunting route database! Use the Route Editor on tibiavault.com to create or fix routes. Your submissions will appear in #route-submissions for review.',
          '',
          '**Roles**',
          '🔴 **Admin** — Site administrators',
          '🟠 **Moderator** — Community moderators',
          '🟢 **Route Verified** — Players with approved routes',
          '🟡 **Contributor** — Active community members',
        ].join('\n'),
        footer: { text: 'TibiaVault — The Vault of Tibia Knowledge' }
      }]
    });
    console.log('✓ Welcome message posted\n');
  }

  // ────────────────────────────────────────────
  // DONE — Print summary
  // ────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════');
  console.log('  ✅ TibiaVault Discord server setup complete!');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log('  Roles:    Admin, Moderator, Route Verified, Contributor');
  console.log('  Channels: 13 channels in 5 categories');
  console.log('');
  console.log('  ┌─────────────────────────────────────────────┐');
  console.log('  │  WEBHOOK URL (paste into js/app.js):        │');
  console.log('  │                                             │');
  console.log(`  │  ${webhook.url}`);
  console.log('  │                                             │');
  console.log('  └─────────────────────────────────────────────┘');
  console.log('');
  console.log('  Next step:');
  console.log('  Open js/app.js and replace YOUR_WEBHOOK_URL_HERE');
  console.log(`  with the webhook URL above.`);
  console.log('');
  console.log('  You can also assign yourself the Admin role in');
  console.log('  Server Settings → Members → click your name → Add Role');
  console.log('');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
