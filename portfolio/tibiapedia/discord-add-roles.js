// ================================================================
// Add new reward roles to existing TibiaVault Discord Server
// Run: node discord-add-roles.js BOT_TOKEN SERVER_ID
// ================================================================

const BOT_TOKEN = process.argv[2];
const GUILD_ID = process.argv[3];

if (!BOT_TOKEN || !GUILD_ID) {
  console.log('Usage: node discord-add-roles.js BOT_TOKEN SERVER_ID');
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
  if (res.status === 429) {
    const data = await res.json();
    const wait = (data.retry_after || 1) * 1000 + 100;
    console.log(`  Rate limited, waiting ${Math.ceil(wait/1000)}s...`);
    await new Promise(r => setTimeout(r, wait));
    return api(endpoint, method, body);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${endpoint} → ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function main() {
  console.log('\n⚔️  TibiaVault — Adding New Roles\n');

  const me = await api('/users/@me');
  console.log(`✓ Bot: ${me.username}\n`);

  // Check existing roles
  const existingRoles = await api(`/guilds/${GUILD_ID}/roles`);
  const existingNames = existingRoles.map(r => r.name);
  console.log(`Existing roles: ${existingNames.join(', ')}\n`);

  // Route Creator role (green, for new full guides — 250 TC/week)
  if (!existingNames.includes('Route Creator')) {
    const rc = await api(`/guilds/${GUILD_ID}/roles`, 'POST', {
      name: 'Route Creator',
      color: 0x22c55e,
      permissions: '0',
      hoist: true,
      mentionable: false
    });
    console.log(`✓ Created: Route Creator (green) — ID: ${rc.id}`);
  } else {
    console.log('• Route Creator already exists, skipping');
  }

  await new Promise(r => setTimeout(r, 300));

  // Spot Editor role (blue, for edits to existing spots — 50 TC/week)
  if (!existingNames.includes('Spot Editor')) {
    const se = await api(`/guilds/${GUILD_ID}/roles`, 'POST', {
      name: 'Spot Editor',
      color: 0x3b82f6,
      permissions: '0',
      hoist: true,
      mentionable: false
    });
    console.log(`✓ Created: Spot Editor (blue) — ID: ${se.id}`);
  } else {
    console.log('• Spot Editor already exists, skipping');
  }

  // Optionally rename old "Route Verified" to something clearer if it exists
  const routeVerified = existingRoles.find(r => r.name === 'Route Verified');
  if (routeVerified) {
    console.log(`\nNote: "Route Verified" role (ID: ${routeVerified.id}) still exists.`);
    console.log('You may want to remove it manually or keep it as a legacy badge.');
  }

  // Post an announcement about the new reward system
  const channels = await api(`/guilds/${GUILD_ID}/channels`);
  const annCh = channels.find(c => c.name === 'announcements');
  if (annCh) {
    await api(`/channels/${annCh.id}/messages`, 'POST', {
      embeds: [{
        title: '🎉 New Reward System!',
        color: 0xd4a537,
        description: [
          'We now have **two tiers** of contribution rewards:',
          '',
          '🟢 **Route Creator** — Submit full hunting guides (route + creatures + gear + tips)',
          '• Win **250 Tibia Coins** every week!',
          '• Get the exclusive Route Creator role',
          '',
          '🔵 **Spot Editor** — Fix or add details to existing spots (creatures, gear, imbuements, supplies)',
          '• Win **50 Tibia Coins** every week!',
          '• Get the Spot Editor role',
          '',
          '**How to participate:**',
          '1. Go to tibiavault.com → Hunting System → Route Editor',
          '2. Create a new guide or fix an existing spot',
          '3. Fill in all the details (creatures, gear, imbuements, etc.)',
          '4. **Enter your exact Tibia character name** (this is where TC are sent!)',
          '5. Submit — your guide will appear here for review',
          '',
          'Winners are selected weekly from approved submissions. 🏆'
        ].join('\n'),
        footer: { text: 'TibiaVault — The Vault of Tibia Knowledge' }
      }]
    });
    console.log('\n✓ Posted reward announcement in #announcements');
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('  ✅ New roles added successfully!');
  console.log('═══════════════════════════════════════════════');
  console.log('');
  console.log('  🟢 Route Creator — for full guide submissions (250 TC/week)');
  console.log('  🔵 Spot Editor — for spot edits (50 TC/week)');
  console.log('');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
