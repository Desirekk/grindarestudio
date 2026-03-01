// ================================================================
// TibiaPedia v3 — Game Data
// Wiki image helper: all creature/item images from TibiaWiki
// ================================================================
const WIKI_IMG = name => `https://tibia.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(name.replace(/ /g,'_'))}.gif`;
const TIBIA_IMG = race => `https://static.tibia.com/images/library/${encodeURIComponent(race)}.gif`;
const CHARM_IMG = key => {
  const map = {wound:'Wound',freeze:'Freeze',zap:'Zap',enflame:'Enflame',curse:'Curse_(Charm)',divine_wrath:'Divine_Wrath',poison:'Poison',dodge:'Dodge',parry:'Parry',low_blow:'Low_Blow',cripple:'Cripple',gut:'Gut',adrenaline_burst:'Adrenaline_Burst',numb:'Numb',cleanse:'Cleanse',bless:'Bless',wound_or_zap:'Wound'};
  return `https://tibia.fandom.com/wiki/Special:Redirect/file/${map[key] || 'Wound'}.png`;
};
const VOC_OUTFIT = key => {
  const map = {knight:'Outfit_Knight_Male',paladin:'Outfit_Hunter_Male',sorcerer:'Outfit_Mage_Male',druid:'Outfit_Summoner_Male',monk:'Outfit_Monk_Male'};
  return `https://tibia.fandom.com/wiki/Special:Redirect/file/${map[key] || map.knight}.gif`;
};

// Element definitions
const ELEMENTS = [
  {key:'physical',name:'Physical',abbr:'Phy',css:'physical'},
  {key:'fire',name:'Fire',abbr:'Fir',css:'fire'},
  {key:'ice',name:'Ice',abbr:'Ice',css:'ice'},
  {key:'energy',name:'Energy',abbr:'Ene',css:'energy'},
  {key:'earth',name:'Earth',abbr:'Ear',css:'earth'},
  {key:'holy',name:'Holy',abbr:'Hol',css:'holy'},
  {key:'death',name:'Death',abbr:'Dea',css:'death'},
  {key:'drown',name:'Drown',abbr:'Drw',css:'drown'},
  {key:'hpDrain',name:'Life Drain',abbr:'HP',css:'lifedrain'},
  {key:'heal',name:'Heal',abbr:'Hea',css:'manadrain'}
];

// Slot icons
const SLOT_META = {
  helmet:{label:'Helmet',img:'Helmet_Slot'},
  armor:{label:'Armor',img:'Armor_Slot'},
  legs:{label:'Legs',img:'Legs_Slot'},
  boots:{label:'Boots',img:'Boots_Slot'},
  shield:{label:'Shield/Spellbook',img:'Shield_Slot'},
  weapon:{label:'Weapon',img:'Weapon_Slot'},
  ring:{label:'Ring',img:'Ring_Slot'},
  amulet:{label:'Amulet',img:'Amulet_Slot'}
};

// Charms reference
const CHARMS = {
  wound:{name:'Wound',element:'physical',desc:'5% creature HP as Physical DMG'},
  poison:{name:'Poison',element:'earth',desc:'5% creature HP as Earth DMG'},
  freeze:{name:'Freeze',element:'ice',desc:'5% creature HP as Ice DMG'},
  zap:{name:'Zap',element:'energy',desc:'5% creature HP as Energy DMG'},
  enflame:{name:'Enflame',element:'fire',desc:'5% creature HP as Fire DMG'},
  curse:{name:'Curse',element:'death',desc:'5% creature HP as Death DMG'},
  divine_wrath:{name:'Divine Wrath',element:'holy',desc:'5% creature HP as Holy DMG'},
  dodge:{name:'Dodge',element:null,desc:'Chance to dodge attack completely'},
  parry:{name:'Parry',element:null,desc:'Reflects incoming damage back'},
  low_blow:{name:'Low Blow',element:null,desc:'+8% critical hit chance'},
  wound_or_zap:{name:'Wound / Zap',element:'physical',desc:'Wound or Zap depending on weakness'}
};

// Vocation-specific gear per level tier (base sets — spots add element protection)
const VOCATION_GEAR = {
  knight:[
    {min:8,max:59,items:["Soldier Helmet","Noble Armor","Crown Legs","Leather Boots","Bright Sword","Demon Shield"]},
    {min:60,max:99,items:["Royal Helmet","Magic Plate Armor","Golden Legs","Boots of Haste","Shiny Blade","Shield of Honour"]},
    {min:100,max:149,items:["Zaoan Helmet","Prismatic Armor","Zaoan Legs","Guardian Boots","Shiny Blade","Prismatic Shield"]},
    {min:150,max:199,items:["Cobra Hood","Prismatic Armor","Ornate Legs","Pair of Dreamwalkers","Blade of Destruction","Gnome Shield"]},
    {min:200,max:299,items:["Falcon Coif","Falcon Plate","Fabulous Legs","Pair of Dreamwalkers","Falcon Longsword","Falcon Escutcheon"]},
    {min:300,max:999,items:["Soulbastion","Soulmantle","Soulstrider","Pair of Dreamwalkers","Soulcutter","Soul Shield"]}
  ],
  paladin:[
    {min:8,max:59,items:["Soldier Helmet","Scale Armor","Crown Legs","Leather Boots","Arbalest","Crystalline Arrow"]},
    {min:60,max:99,items:["Royal Helmet","Paladin Armor","Golden Legs","Boots of Haste","Warsinger Bow","Crystalline Arrow"]},
    {min:100,max:149,items:["Zaoan Helmet","Prismatic Armor","Zaoan Legs","Guardian Boots","Mycological Bow","Crystalline Arrow"]},
    {min:150,max:199,items:["Cobra Hood","Prismatic Armor","Ornate Legs","Pair of Dreamwalkers","Rift Bow","Diamond Arrow"]},
    {min:200,max:299,items:["Falcon Coif","Falcon Plate","Fabulous Legs","Pair of Dreamwalkers","Falcon Bow","Diamond Arrow"]},
    {min:300,max:999,items:["Soulmantle","Soulstrider","Pair of Dreamwalkers","Soulpiercer","Spectral Bolt"]}
  ],
  sorcerer:[
    {min:8,max:59,items:["Magician's Hat","Blue Robe","Plate Legs","Leather Boots","Wand of Dragonbreath","Spellbook"]},
    {min:60,max:99,items:["Yalahari Mask","Blue Robe","Golden Legs","Boots of Haste","Wand of Defiance","Spellbook of Mind Stone"]},
    {min:100,max:149,items:["Zaoan Helmet","Gill Coat","Zaoan Legs","Guardian Boots","Wand of Defiance","Spellbook of Dark Mysteries"]},
    {min:150,max:199,items:["Cobra Hood","Prismatic Armor","Ornate Legs","Pair of Dreamwalkers","Wand of Destruction","Spellbook of Dark Mysteries"]},
    {min:200,max:299,items:["Falcon Coif","Falcon Plate","Fabulous Legs","Pair of Dreamwalkers","Falcon Wand","Falcon Escutcheon"]},
    {min:300,max:999,items:["Soulmantle","Soulstrider","Pair of Dreamwalkers","Soulhexer"]}
  ],
  druid:[
    {min:8,max:59,items:["Magician's Hat","Blue Robe","Plate Legs","Leather Boots","Snakebite Rod","Spellbook"]},
    {min:60,max:99,items:["Yalahari Mask","Blue Robe","Golden Legs","Boots of Haste","Springsprout Rod","Spellbook of Mind Stone"]},
    {min:100,max:149,items:["Zaoan Helmet","Gill Coat","Zaoan Legs","Guardian Boots","Rod of Destruction","Spellbook of Dark Mysteries"]},
    {min:150,max:199,items:["Cobra Hood","Prismatic Armor","Ornate Legs","Pair of Dreamwalkers","Rod of Destruction","Spellbook of Dark Mysteries"]},
    {min:200,max:299,items:["Falcon Coif","Falcon Plate","Fabulous Legs","Pair of Dreamwalkers","Falcon Rod","Falcon Escutcheon"]},
    {min:300,max:999,items:["Soulmantle","Soulstrider","Pair of Dreamwalkers","Soultainter"]}
  ],
  monk:[
    {min:8,max:59,items:["Soldier Helmet","Scale Armor","Crown Legs","Leather Boots","Pair of Iron Fists","Demon Shield"]},
    {min:60,max:99,items:["Royal Helmet","Noble Armor","Golden Legs","Boots of Haste","Sai","Shield of Honour"]},
    {min:100,max:149,items:["Zaoan Helmet","Prismatic Armor","Zaoan Legs","Guardian Boots","Drachaku","Prismatic Shield"]},
    {min:150,max:199,items:["Cobra Hood","Prismatic Armor","Ornate Legs","Pair of Dreamwalkers","Bambus Jo","Gnome Shield"]},
    {min:200,max:299,items:["Falcon Coif","Falcon Plate","Fabulous Legs","Pair of Dreamwalkers","Cobra Bo","Falcon Escutcheon"]},
    {min:300,max:999,items:["Soulbastion","Soulmantle","Soulstrider","Pair of Dreamwalkers","Falcon Sai","Soul Shield"]}
  ]
};

// Element protection items — suggested when creatures deal that element
const ELEMENT_PROT = {
  fire:{amulet:"Magma Amulet",desc:"Fire Protection"},
  ice:{amulet:"Glacier Amulet",desc:"Ice Protection"},
  energy:{amulet:"Prismatic Necklace",desc:"Energy Protection"},
  earth:{amulet:"Terra Amulet",desc:"Earth Protection"},
  death:{amulet:"Koshei's Ancient Amulet",desc:"Death Protection"},
  holy:{amulet:"Prismatic Necklace",desc:"Holy Protection"},
  physical:{amulet:"Prismatic Necklace",desc:"Physical Protection"}
};

// Cities for map
const CITIES = [
  {name:"Thais",cx:32369,cy:32241},{name:"Carlin",cx:32360,cy:31782},
  {name:"Venore",cx:32957,cy:32076},{name:"Ab'Dendriel",cx:32682,cy:31639},
  {name:"Kazordoon",cx:32631,cy:31925},{name:"Ankrahmun",cx:33162,cy:32688},
  {name:"Darashia",cx:33224,cy:32432},{name:"Edron",cx:33217,cy:31814},
  {name:"Port Hope",cx:32623,cy:32753},{name:"Liberty Bay",cx:32317,cy:32826},
  {name:"Svargrond",cx:32267,cy:31131},{name:"Yalahar",cx:32792,cy:31274},
  {name:"Rathleton",cx:33594,cy:31899},{name:"Roshamuul",cx:33513,cy:32363},
  {name:"Issavi",cx:33921,cy:31428},{name:"Feyrist",cx:33558,cy:32224},
  {name:"Rookgaard",cx:32097,cy:31895},{name:"Dawnport",cx:32070,cy:31932},
  {name:"Zao",cx:33290,cy:31500}
];

// ================================================================
// HUNTING SPOTS — Expanded tibiaroute.com style
// ================================================================
const HUNTING_SPOTS = [
{
  name:"Edron Werecreatures",
  city:"Edron",level:[80,150],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"800k-1.5kk",profitH:"200k-500k",
  prot:["physical","death"],
  cx:33333,cy:31690,
  route:"From Edron depot go east across the bridge. Continue east past the academy. Enter Grimvale cave entrance near the mountain.",
  waypoints:[[33217,31814,"Start at Edron depot"],[33234,31814,"Head east on main road"],[33257,31809,"Cross bridge over river"],[33280,31805,"Continue east past Academy"],[33304,31798,"Follow path NE towards mountains"],[33328,31786,"Reach Grimvale entrance"],[33340,31779,"Enter cave, go down stairs"],[33340,31779,"Underground: Grimvale tunnels",8],[33338,31770,"Follow tunnel north",8],[33335,31755,"Turn left at junction",8],[33330,31740,"Continue through cave",8],[33333,31720,"Pass werebear area",8],[33333,31700,"Arrive at main hunting room",8]],
  access:"Grimvale Quest (short access). Only during full moon phase!",
  premium:true,
  creatures:[
    {name:"Werebear",hp:2400,xp:2000,charm:"zap",charmPts:25},
    {name:"Werewolf",hp:1955,xp:1600,charm:"zap",charmPts:15},
    {name:"Werefox",hp:1500,xp:1200,charm:"zap",charmPts:15},
    {name:"Werebadger",hp:1650,xp:1400,charm:"zap",charmPts:15},
    {name:"Werehyaena",hp:2200,xp:1800,charm:"zap",charmPts:25}
  ],
  imbuements:["2x Vampirism","2x Void","1x Strike"],
  supplies:{
    knight:["200 Strong Health Potion","50 Strong Mana Potion","10 Great Spirit Potion"],
    paladin:["200 Great Spirit Potion","100 Crystalline Arrow","20 Avalanche Rune"],
    sorcerer:["300 Strong Mana Potion","50 Sudden Death Rune","20 Avalanche Rune"],
    druid:["300 Strong Mana Potion","20 Avalanche Rune","10 Wild Growth Rune"]
  },
  trinket:"Foxtail Amulet",
  drops:["Werewolf Helmet","Dreaded Cleaver","Foxtail Amulet","Werewolf Amulet","Werebear Fur"],
  tips:"Only accessible during full moon. Best loot from Foxtail Amulets (100k+ each). Zap charm on all — they're all weak to Energy. Knights should use Dodge as defensive charm.",
  gear:{
    "80-130":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots, Shiny Blade",
    "130+"  :"Cobra Hood, Ornate Legs, Falcon Plate, Pair of Dreamwalkers"
  }
},
{
  name:"Darashia Dragon Lair",
  city:"Darashia",level:[40,80],voc:["knight","paladin"],
  team:"solo",expH:"200k-400k",profitH:"30k-80k",
  prot:["fire"],
  cx:33264,cy:32277,
  route:"From Darashia depot head north-east. Follow the sand path past the gardens. Enter the dragon cave opening in the mountain.",
  waypoints:[[33224,32432,"Start at Darashia depot"],[33224,32410,"Head north through desert"],[33226,32387,"Follow road north past gardens"],[33230,32362,"Continue north on sand path"],[33240,32340,"Turn NE towards mountain"],[33253,32318,"Approach cave entrance in cliff"],[33261,32300,"Enter Dragon Lair, go down"],[33261,32300,"Underground: Dragon Lair entrance",8],[33258,32290,"Follow tunnel south",8],[33255,32278,"Large dragon chamber",8],[33260,32268,"Continue deeper into lair",8],[33264,32255,"Main hunting area with Dragons",8]],
  access:"None — free access.",
  premium:false,
  creatures:[
    {name:"Dragon",hp:1000,xp:700,charm:"freeze",charmPts:15},
    {name:"Dragon Hatchling",hp:380,xp:185,charm:"freeze",charmPts:5}
  ],
  imbuements:["1x Vampirism","1x Void"],
  supplies:{
    knight:["150 Strong Health Potion","30 Mana Potion"],
    paladin:["100 Great Spirit Potion","200 Royal Star"]
  },
  trinket:null,
  drops:["Dragon Scale Mail","Dragon Shield","Small Diamond","Dragon Ham"],
  tips:"Classic hunting spot for beginners. Dragons are weak to Ice — use Freeze charm. Bring fire protection — equip Magma Amulet or fire resistance shield.",
  gear:{
    "40-60":"Soldier Helmet, Blue Robe, Crown Legs, Boots of Haste, Bright Sword",
    "60-80":"Royal Helmet, Magic Plate Armor, Golden Legs, Boots of Haste"
  }
},
{
  name:"Ghastly Dragons — Zao",
  city:"Zao",level:[130,200],voc:["knight","paladin"],
  team:"solo",expH:"1kk-1.8kk",profitH:"150k-350k",
  prot:["death","earth"],
  cx:33450,cy:31580,
  route:"From Zao outpost use the steamship or walk south-east into the steppe. Enter the underground dragon tunnels heading deep.",
  waypoints:[[33290,31500,"Start at Zao outpost"],[33310,31510,"Head SE into the steppe"],[33330,31520,"Cross barren Zao land"],[33355,31535,"Follow path past corrupted trees"],[33380,31548,"Continue SE through wasteland"],[33405,31560,"Approach mountain entrance"],[33425,31572,"Enter dragon caves, go down"],[33425,31572,"Underground: Zao dragon caves",8],[33430,31575,"Follow underground passage",8],[33440,31578,"Navigate through dragon tunnels",8],[33450,31580,"Reach Ghastly Dragon area",8]],
  access:"The New Frontier + Children of the Revolution quests required.",
  premium:true,
  creatures:[
    {name:"Ghastly Dragon",hp:7800,xp:4600,charm:"zap",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["300 Strong Health Potion","100 Strong Mana Potion","10 Ultimate Health Potion"],
    paladin:["200 Great Spirit Potion","300 Crystalline Arrow"]
  },
  trinket:"Foxtail Amulet",
  drops:["Zaoan Helmet","Zaoan Armor","Zaoan Legs","Ghastly Dragon Head","Focus Cape"],
  tips:"One of the best solo knight spots 130-180. Death protection is essential — Foxtail Amulet + Terra Boots recommended. Ghastly Dragons are weak to Energy (Zap) and Earth (Poison).",
  gear:{
    "130-150":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots, Shiny Blade",
    "150-200":"Cobra Hood, Prismatic Armor, Ornate Legs, Dreamwalkers, Blade of Destruction"
  }
},
{
  name:"Lizard City — Zao",
  city:"Zao",level:[100,150],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"600k-1.2kk",profitH:"100k-250k",
  prot:["fire","energy"],
  cx:33316,cy:31558,
  route:"From Zao outpost head south through the steppe into the city ruins. Cross the bridge and enter the main area.",
  waypoints:[[33290,31500,"Start at Zao outpost"],[33296,31510,"Head south on steppe road"],[33302,31520,"Follow winding path south"],[33306,31535,"Cross damaged bridge"],[33310,31545,"Enter lizard city outskirts"],[33313,31552,"Navigate through ruins"],[33316,31558,"Arrive at main Lizard City area"]],
  access:"The New Frontier + Children of the Revolution quests.",
  premium:true,
  creatures:[
    {name:"Lizard High Guard",hp:2200,xp:1450,charm:"freeze",charmPts:25},
    {name:"Lizard Legionnaire",hp:1600,xp:1100,charm:"freeze",charmPts:15},
    {name:"Lizard Dragon Priest",hp:1450,xp:1320,charm:"freeze",charmPts:25}
  ],
  imbuements:["2x Vampirism","2x Void","1x Strike"],
  supplies:{
    knight:["200 Strong Health Potion","60 Strong Mana Potion"],
    paladin:["200 Great Spirit Potion","200 Crystalline Arrow"],
    sorcerer:["400 Strong Mana Potion","50 Sudden Death Rune"],
    druid:["400 Strong Mana Potion","20 Wild Growth Rune"]
  },
  trinket:null,
  drops:["Zaoan Armor","Zaoan Helmet","Zaoan Legs","Zaoan Shoes","Tower Shield"],
  tips:"Dragon Priests heal others — target them first. Great for Zaoan equipment farming. All lizards weak to Ice — use Freeze. Fire protection for Dragon Priests.",
  gear:{
    "100-130":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots",
    "130-150":"Cobra Hood, Prismatic Armor, Ornate Legs, Dreamwalkers"
  }
},
{
  name:"Oramond Minos",
  city:"Rathleton",level:[200,350],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"3kk-6kk",profitH:"500k-1.5kk",
  prot:["physical","fire"],
  cx:33651,cy:31942,
  route:"From Rathleton depot take the underground steam system south. Follow tunnels to the Oramond entrance, then navigate to the Minotaur area.",
  waypoints:[[33594,31899,"Start at Rathleton depot"],[33605,31897,"Head east to underground entrance"],[33618,31898,"Enter Oramond underground system"],[33618,31898,"Underground: Oramond tunnels",8],[33625,31900,"Navigate steam passages SE",8],[33635,31903,"Turn right at junction",8],[33642,31906,"Continue through Glooth passages",8],[33650,31908,"Enter Minotaur hunting area",8],[33655,31910,"Main Oramond Minos room",8]],
  access:"Oramond Quest — need 40 daily task completions (voting + tasks). This takes ~2 weeks!",
  premium:true,
  creatures:[
    {name:"Minotaur Amazon",hp:3500,xp:2600,charm:"wound",charmPts:25},
    {name:"Minotaur Hunter",hp:2800,xp:2200,charm:"wound",charmPts:25},
    {name:"Execowtioner",hp:6000,xp:3800,charm:"freeze",charmPts:50},
    {name:"Mooh'tah Warrior",hp:3200,xp:2500,charm:"wound",charmPts:25}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["400 Ultimate Health Potion","200 Strong Mana Potion","50 Ultimate Spirit Potion"],
    paladin:["300 Great Spirit Potion","400 Spectral Bolt","50 Ultimate Spirit Potion"],
    sorcerer:["600 Strong Mana Potion","100 Sudden Death Rune","30 Avalanche Rune"],
    druid:["600 Strong Mana Potion","30 Wild Growth Rune","30 Avalanche Rune"]
  },
  trinket:"Scarab Amulet",
  drops:["Execowtioner's Axe","Minotaur Leather","Gold Ingot","Yellow Gem","Blue Gem"],
  tips:"THE BEST PROFIT in the game for 200-300 range. Worth grinding the 40 daily tasks. Expect 500k-1.5kk gold/hour. Physical protection essential. Execowtioners hit VERY hard with fire — bring fire protection ring for emergencies.",
  gear:{
    "200-250":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers, Falcon Battleaxe",
    "250+"   :"Falcon Coif, Soulmantle, Soulstrider, Dreamwalkers, Soulcutter"
  }
},
{
  name:"Glooth Bandits",
  city:"Rathleton",level:[150,250],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"1kk-2kk",profitH:"300k-700k",
  prot:["physical"],
  cx:33660,cy:31900,
  route:"From Rathleton depot head to the Oramond underground system. Glooth Bandits area is in the first section — easier access than Minos.",
  waypoints:[[33594,31899,"Start at Rathleton depot"],[33605,31897,"Head east through city"],[33618,31898,"Enter Oramond underground system"],[33618,31898,"Underground: Oramond tunnels",8],[33628,31898,"Follow passage east",8],[33640,31896,"Turn at first junction",8],[33650,31895,"Continue through Glooth area",8],[33660,31896,"Arrive at Glooth Bandits zone",8]],
  access:"Oramond Quest — basic access (fewer tasks than Minos, ~1 week).",
  premium:true,
  creatures:[
    {name:"Glooth Bandit",hp:5400,xp:3200,charm:"wound",charmPts:25}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["300 Strong Health Potion","100 Strong Mana Potion","30 Ultimate Health Potion"],
    paladin:["250 Great Spirit Potion","300 Crystalline Arrow"],
    sorcerer:["500 Strong Mana Potion","50 Sudden Death Rune"],
    druid:["500 Strong Mana Potion","30 Wild Growth Rune"]
  },
  trinket:null,
  drops:["Glooth Amulet","Glooth Blade","Glooth Cape","Glooth Club","Gold Ingot"],
  tips:"Very good solo profit and XP. Physical protection set recommended. Easier access than Oramond Minos but still very profitable.",
  gear:{
    "150-200":"Cobra Hood, Prismatic Armor, Ornate Legs, Dreamwalkers",
    "200+"   :"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers"
  }
},
{
  name:"Asura Palace",
  city:"Port Hope",level:[150,250],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"1.5kk-3kk",profitH:"200k-600k",
  prot:["fire","energy"],
  cx:32953,cy:32685,
  route:"From Port Hope depot head east through the jungle. Navigate the mountain paths north-east. The palace entrance is underground in the Kha'zeel mountains.",
  waypoints:[[32623,32753,"Start at Port Hope depot"],[32650,32748,"Head east through jungle path"],[32680,32740,"Cross river bridge"],[32720,32728,"Continue NE through dense jungle"],[32760,32718,"Follow mountain trail uphill"],[32810,32710,"Pass Kha'zeel mountain pass"],[32860,32700,"Continue east through narrow paths"],[32910,32693,"Approach Palace entrance"],[32940,32688,"Enter cave, go down stairs"],[32940,32688,"Underground: Asura Palace entrance",8],[32945,32686,"Follow underground passage",8],[32950,32685,"Navigate Asura chambers",8],[32956,32683,"Arrive at main hunting area",8]],
  access:"Short access quest from Port Hope NPCs (Jakundaf Desert Library access).",
  premium:true,
  creatures:[
    {name:"Dawnfire Asura",hp:2700,xp:2000,charm:"freeze",charmPts:25},
    {name:"Midnight Asura",hp:2700,xp:2000,charm:"enflame",charmPts:25},
    {name:"True Midnight Asura",hp:4200,xp:3100,charm:"enflame",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Strike"],
  supplies:{
    knight:["300 Strong Health Potion","100 Strong Mana Potion","20 Ultimate Health Potion"],
    paladin:["250 Great Spirit Potion","300 Crystalline Arrow"],
    sorcerer:["500 Strong Mana Potion","50 Sudden Death Rune"],
    druid:["500 Strong Mana Potion","30 Wild Growth Rune"]
  },
  trinket:"Lit Moon Mirror",
  drops:["Midnight Shard","Dawnfire Shimmering Dye","Mystic Turban","Enchanted Theurgic Amulet"],
  tips:"Energy protection for Midnight Asuras, fire protection for Dawnfire. Rotate protections. Very popular spot — may be contested. Midnight Asuras drop very valuable items.",
  gear:{
    "150-200":"Cobra Hood, Prismatic Armor, Ornate Legs, Dreamwalkers, Wand/Rod of Destruction",
    "200-250":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers"
  }
},
{
  name:"Frost Dragons",
  city:"Svargrond",level:[80,140],voc:["knight","paladin"],
  team:"solo",expH:"400k-800k",profitH:"80k-200k",
  prot:["ice"],
  cx:32230,cy:31412,
  route:"From Svargrond take the boat to Okolnir island. Walk north across the ice to the cave entrance. Go down into the frost dragon tunnels.",
  waypoints:[[32267,31131,"Start at Svargrond depot"],[32262,31148,"Head south to boat NPC"],[32258,31170,"Take boat to Okolnir island"],[32250,31250,"Arrive on Okolnir, head north"],[32245,31310,"Cross icy terrain north"],[32240,31360,"Continue north past ice formations"],[32235,31395,"Approach cave entrance in mountain"],[32232,31410,"Enter Frost Dragon cave, go down"],[32232,31410,"Underground: Frost Dragon tunnels",8],[32230,31412,"Navigate icy tunnels",8],[32228,31418,"Continue through dragon caves",8],[32226,31425,"Main Frost Dragon hunting area",8]],
  access:"The Ice Islands Quest required for Okolnir boat access.",
  premium:true,
  creatures:[
    {name:"Frost Dragon",hp:1800,xp:2100,charm:"zap",charmPts:25}
  ],
  imbuements:["1x Vampirism","1x Void"],
  supplies:{
    knight:["200 Strong Health Potion","50 Strong Mana Potion"],
    paladin:["200 Great Spirit Potion","200 Crystalline Arrow"]
  },
  trinket:"Energy Ring",
  drops:["Ice Dragon Claw","Dragon Scale Mail","Golden Armor","Small Diamond"],
  tips:"Great solo knight spot 90-130. Frost Dragons weak to Energy — use Zap charm. Bring energy protection ring. Fire weapons deal bonus damage.",
  gear:{
    "80-100":"Royal Helmet, Magic Plate Armor, Golden Legs, Boots of Haste",
    "100-140":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots"
  }
},
{
  name:"Draken Walls — Zao",
  city:"Zao",level:[130,200],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"2kk-4kk",profitH:"200k-500k",
  prot:["fire","energy"],
  cx:33350,cy:31700,
  route:"From Zao outpost navigate south through the steppe, past Zzaion. Cross the lava rivers south to the Draken fortress entrance.",
  waypoints:[[33290,31500,"Start at Zao outpost"],[33296,31515,"Head south through steppe"],[33302,31530,"Follow road past outpost"],[33310,31550,"Pass Zzaion ruins"],[33318,31570,"Continue south through steppe"],[33325,31600,"Cross lava river bridge"],[33330,31630,"Follow fortress approach"],[33336,31660,"Enter fortified Draken area"],[33342,31680,"Navigate fortress corridors"],[33348,31695,"Arrive at Draken Walls hunting"]],
  access:"Wrath of the Emperor Quest required.",
  premium:true,
  creatures:[
    {name:"Draken Spellweaver",hp:5000,xp:3100,charm:"freeze",charmPts:50},
    {name:"Draken Elite",hp:5550,xp:3200,charm:"freeze",charmPts:50},
    {name:"Draken Abomination",hp:6500,xp:3800,charm:"freeze",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Strike"],
  supplies:{
    knight:["400 Strong Health Potion","150 Strong Mana Potion","30 Ultimate Health Potion"],
    paladin:["300 Great Spirit Potion","400 Crystalline Arrow"],
    sorcerer:["500 Strong Mana Potion","80 Sudden Death Rune"],
    druid:["500 Strong Mana Potion","30 Wild Growth Rune","30 Avalanche Rune"]
  },
  trinket:"Foxtail Amulet",
  drops:["Draken Trophy","Elite Draken Mail","Sai","Twiceslicer","Cobra Crown"],
  tips:"One of the best team spots for 150-200. Draken Spellweavers deal massive fire damage — fire protection mandatory. Freeze charm on everything — all weak to Ice.",
  gear:{
    "130-160":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots",
    "160-200":"Cobra Hood, Prismatic Armor, Ornate Legs, Dreamwalkers"
  }
},
{
  name:"Roshamuul Prison",
  city:"Roshamuul",level:[200,350],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"4kk-8kk",profitH:"300k-800k",
  prot:["physical","death"],
  cx:33530,cy:32400,
  route:"From Roshamuul dock navigate the dangerous terrain south-west. Cross the bridge to the prison island entrance. Be careful of surface Guzzlemaws!",
  waypoints:[[33513,32363,"Start at Roshamuul dock"],[33516,32370,"Head SW carefully (Guzzlemaws!)"],[33519,32378,"Avoid surface monsters"],[33522,32385,"Cross bridge to prison island"],[33525,32392,"Approach prison entrance"],[33528,32398,"Enter prison, go down stairs"],[33528,32398,"Underground: Roshamuul Prison",8],[33530,32400,"Navigate prison tunnels",8],[33532,32404,"Follow corridor south",8],[33534,32410,"Main prison hunting area",8]],
  access:"Roshamuul Quest required.",
  premium:true,
  creatures:[
    {name:"Guzzlemaw",hp:8500,xp:6200,charm:"wound",charmPts:50},
    {name:"Frazzlemaw",hp:6800,xp:5400,charm:"wound",charmPts:50},
    {name:"Silencer",hp:7500,xp:5100,charm:"curse",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["600 Ultimate Health Potion","200 Strong Mana Potion","50 Ultimate Spirit Potion"],
    paladin:["400 Great Spirit Potion","600 Spectral Bolt","50 Ultimate Spirit Potion"],
    sorcerer:["800 Strong Mana Potion","100 Sudden Death Rune"],
    druid:["800 Strong Mana Potion","50 Wild Growth Rune","50 Avalanche Rune"]
  },
  trinket:"Foxtail Amulet",
  drops:["Soulfire Rune","Guzzlemaw Body","Frazzle Skin","Silencer Resonating Chamber"],
  tips:"Top-tier XP for teams 250+. Guzzlemaws hit EXTREMELY hard physically — full physical protection. Wound charm on Guzzle/Frazzle (neutral to most elements), Curse on Silencers (weak to Death). Knight must be experienced blocker.",
  gear:{
    "200-300":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers",
    "300+"   :"Soulmantle, Soulstrider, Soulbastion, Dreamwalkers"
  }
},
{
  name:"Falcon Bastion",
  city:"Edron",level:[250,400],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"5kk-10kk",profitH:"500k-2kk",
  prot:["physical","holy"],
  cx:33362,cy:31343,
  route:"From Edron depot go east across the bridges. Take the boat north-east to Stonehome. Head north into the Falcon Bastion fortress.",
  waypoints:[[33217,31814,"Start at Edron depot"],[33235,31810,"Head east on main road"],[33258,31802,"Cross first bridge east"],[33280,31795,"Continue east past houses"],[33300,31785,"Take NE boat to Stonehome island"],[33320,31600,"Arrive on Stonehome"],[33335,31500,"Head north through forest"],[33345,31430,"Continue north on mountain path"],[33355,31380,"Approach Falcon Bastion fortress"],[33360,31358,"Enter bastion entrance"],[33362,31343,"Navigate to main hunting area"]],
  access:"Grave Danger Quest required.",
  premium:true,
  creatures:[
    {name:"Falcon Knight",hp:9500,xp:6544,charm:"wound",charmPts:50},
    {name:"Falcon Paladin",hp:8200,xp:5765,charm:"wound",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["600 Ultimate Health Potion","300 Strong Mana Potion","50 Ultimate Spirit Potion"],
    paladin:["500 Great Spirit Potion","600 Spectral Bolt"],
    sorcerer:["800 Strong Mana Potion","150 Sudden Death Rune"],
    druid:["800 Strong Mana Potion","50 Wild Growth Rune"]
  },
  trinket:"Enchanted Theurgic Amulet",
  drops:["Falcon Battleaxe","Falcon Bow","Falcon Coif","Falcon Escutcheon","Falcon Plate","Falcon Rod","Falcon Shield","Falcon Wand"],
  tips:"Drops Falcon equipment — second-best tier in game. Extremely profitable for 300+ teams. Physical protection mandatory. Wound charm (neutral to most elements). Falcon Knights combo very hard.",
  gear:{
    "250-300":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers",
    "300+"   :"Soulmantle, Soulstrider, Soulbastion, Dreamwalkers"
  }
},
{
  name:"Secret Library",
  city:"Edron",level:[250,400],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"8kk-15kk",profitH:"200k-600k",
  prot:["fire","ice","energy"],
  cx:32177,cy:31927,
  route:"Access through portals in north-western Tiquanda after completing the Secret Library Quest. Different wings accessible from different portal locations.",
  waypoints:[[32369,32241,"Start at Thais depot"],[32355,32220,"Head NW from depot"],[32340,32195,"Follow road north"],[32320,32170,"Continue NW through fields"],[32295,32140,"Enter Tiquanda jungle"],[32270,32110,"Navigate through jungle"],[32250,32080,"Continue west"],[32230,32060,"Find portal area in NW Tiquanda"],[32210,32040,"Approach Secret Library portal"],[32210,32040,"Use portal — teleported deep underground",10],[32200,32020,"Navigate library corridors",10],[32190,32000,"Choose wing: fire/ice/energy",10],[32177,31980,"Arrive at chosen hunting wing",10]],
  access:"Secret Library Quest required.",
  premium:true,
  creatures:[
    {name:"Burning Book",hp:6000,xp:5890,charm:"freeze",charmPts:50},
    {name:"Icecold Book",hp:6200,xp:5890,charm:"enflame",charmPts:50},
    {name:"Energized Raging Mage",hp:7500,xp:6400,charm:"poison",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Strike"],
  supplies:{
    knight:["600 Ultimate Health Potion","300 Strong Mana Potion"],
    paladin:["500 Great Spirit Potion","600 Spectral Bolt"],
    sorcerer:["800 Strong Mana Potion","100 Sudden Death Rune"],
    druid:["800 Strong Mana Potion","50 Wild Growth Rune"]
  },
  trinket:null,
  drops:["Fabulous Legs","Book Page","Enchanted Theurgic Amulet"],
  tips:"BEST XP/h in the game for 300+. Different wings need different element protection — fire wing (ice prot), ice wing (fire prot), energy wing (earth prot). Rotate charms per wing. Fabulous Legs drop is extremely valuable.",
  gear:{
    "250-300":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers",
    "300+"   :"Soulmantle, Soulstrider, Soulbastion, Dreamwalkers"
  }
},
{
  name:"Cobras — Cobra Bastion",
  prot:["physical","earth"],
  city:"Ankrahmun",level:[250,400],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"5kk-9kk",profitH:"400k-1.2kk",
  cx:33301,cy:32647,
  route:"Travel to Cobra Bastion north-east of Ankrahmun. Take the steamship or walk through the desert to reach the bastion entrance.",
  waypoints:[[33162,32688,"Start at Ankrahmun depot"],[33178,32684,"Head NE through desert"],[33200,32678,"Follow sand road NE"],[33225,32670,"Continue through desert dunes"],[33250,32662,"Approach Cobra Bastion entrance"],[33275,32655,"Enter bastion outer walls"],[33295,32650,"Go down stairs into bastion"],[33295,32650,"Underground: Cobra Bastion",8],[33298,32648,"Navigate bastion corridors",8],[33301,32647,"Main Cobra hunting area",8]],
  access:"Cobra Bastion Quest required (Kilmaresh access first).",
  premium:true,
  creatures:[
    {name:"Cobra Assassin",hp:8000,xp:6200,charm:"wound",charmPts:50},
    {name:"Cobra Scout",hp:6000,xp:4800,charm:"wound",charmPts:50},
    {name:"Cobra Vizier",hp:8800,xp:6300,charm:"wound",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["600 Ultimate Health Potion","300 Strong Mana Potion"],
    paladin:["500 Great Spirit Potion","600 Spectral Bolt"],
    sorcerer:["800 Strong Mana Potion","100 Sudden Death Rune"],
    druid:["800 Strong Mana Potion","50 Wild Growth Rune"]
  },
  trinket:"Enchanted Theurgic Amulet",
  drops:["Cobra Club","Cobra Sword","Cobra Axe","Cobra Hood","Cobra Crossbow","Cobra Wand","Cobra Rod"],
  tips:"Drops Cobra equipment — Cobra Hood is best-in-slot helmet for mages 150-250. Physical protection + earth protection recommended. Wound charm on all (neutral to most elements).",
  gear:{
    "250-300":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers",
    "300+"   :"Soulmantle, Soulstrider, Soulbastion, Dreamwalkers"
  }
},
{
  name:"Summer/Winter Court — Feyrist",
  city:"Feyrist",level:[150,250],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"1.5kk-3kk",profitH:"150k-400k",
  prot:["holy","death"],
  cx:33560,cy:32220,
  route:"Enter Feyrist through the fairy portal near Carlin or Ab'Dendriel. The portals appear randomly — check TibiaBosses for locations.",
  waypoints:[[33558,32224,"Enter Feyrist through fairy portal"],[33560,32222,"Arrive in Feyrist realm"],[33562,32220,"Follow fairy path north"],[33564,32218,"Continue through enchanted forest"],[33565,32215,"Enter Summer/Winter Court area"],[33560,32212,"Navigate court grounds"],[33558,32210,"Main hunting area"]],
  access:"A Threatened Dream Quest required.",
  premium:true,
  creatures:[
    {name:"Pixie",hp:1550,xp:1000,charm:"curse",charmPts:15},
    {name:"Faun",hp:1800,xp:1200,charm:"curse",charmPts:15},
    {name:"Swan Maiden",hp:2200,xp:1500,charm:"curse",charmPts:25},
    {name:"Boar Man",hp:3000,xp:2000,charm:"wound",charmPts:25},
    {name:"Dark Faun",hp:2700,xp:1800,charm:"wound",charmPts:25}
  ],
  imbuements:["2x Vampirism","2x Void","1x Strike"],
  supplies:{
    knight:["250 Strong Health Potion","80 Strong Mana Potion"],
    paladin:["200 Great Spirit Potion","300 Crystalline Arrow"],
    sorcerer:["400 Strong Mana Potion","50 Sudden Death Rune"],
    druid:["400 Strong Mana Potion","30 Wild Growth Rune"]
  },
  trinket:null,
  drops:["Dream Warden Mask","Feyrist equipment","Sun Catcher","Moon Catcher"],
  tips:"Beautiful area with great XP for 150-250. Summer Court creatures (Pixie, Faun) weak to Death — Curse charm. Winter Court creatures (Boar Man, Dark Faun) — Wound charm. Can heal each other, focus fire.",
  gear:{
    "150-200":"Cobra Hood, Prismatic Armor, Ornate Legs, Dreamwalkers",
    "200-250":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers"
  }
},
{
  name:"Pirats — Rathleton",
  prot:["physical"],
  city:"Rathleton",level:[200,300],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"2kk-4kk",profitH:"300k-800k",
  cx:33620,cy:31850,
  waypoints:[[33594,31899,"Start at Rathleton depot"],[33600,31896,"Head east through Rathleton"],[33608,31892,"Find underground entrance"],[33614,31888,"Enter sewers, go down"],[33614,31888,"Underground: Rathleton sewers",8],[33618,31882,"Navigate sewer passages east",8],[33622,31874,"Turn north at junction",8],[33620,31864,"Continue through tunnels",8],[33618,31854,"Navigate to pirate area",8],[33620,31848,"Arrive at Pirat hideout",8]],
  route:"From Rathleton use the underground tunnel system east. Navigate through the sewer-like passages to reach the pirate hideout.",
  access:"Oramond access required. Short mission.",
  premium:true,
  creatures:[
    {name:"Pirat Cutthroat",hp:5500,xp:4100,charm:"wound",charmPts:50},
    {name:"Pirat Bombardier",hp:4800,xp:3800,charm:"wound",charmPts:50},
    {name:"Pirat Scoundrel",hp:6200,xp:4500,charm:"wound",charmPts:50},
    {name:"Pirat Mate",hp:7000,xp:5000,charm:"wound",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["500 Ultimate Health Potion","200 Strong Mana Potion"],
    paladin:["400 Great Spirit Potion","500 Spectral Bolt"],
    sorcerer:["700 Strong Mana Potion","80 Sudden Death Rune"],
    druid:["700 Strong Mana Potion","40 Wild Growth Rune"]
  },
  trinket:"Foxtail Amulet",
  drops:["Pirate Treasure","Gold Ingot","Pirat Outfit"],
  tips:"Amazing solo profit for 200-300 range. Physical protection mandatory. Wound charm on all. Pirats deal heavy physical + some fire/energy. Fast kills = fast profit.",
  gear:{
    "200-250":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers",
    "250-300":"Soulmantle, Soulstrider, Dreamwalkers"
  }
},
{
  name:"Flimsy Lost Souls",
  prot:["death","ice"],
  city:"Thais",level:[250,400],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"6kk-12kk",profitH:"400k-1kk",
  cx:31965,cy:32328,
  route:"Access through the Brain Grounds portal west of Venore. Requires Soul War Quest access.",
  waypoints:[[32369,32241,"Start at Thais depot"],[32350,32245,"Head west from depot"],[32320,32250,"Follow road west"],[32280,32258,"Continue west through fields"],[32240,32265,"Pass farmland area"],[32200,32272,"Enter swamp region"],[32150,32280,"Continue west towards Venore"],[32100,32290,"Approach Brain Grounds portal area"],[32050,32305,"Navigate to portal location"],[32000,32318,"Find Soul War portal"],[31965,32328,"Enter portal to soul dimension"]],
  access:"Feaster of Souls Quest required.",
  premium:true,
  creatures:[
    {name:"Flimsy Lost Soul",hp:5000,xp:5800,charm:"divine_wrath",charmPts:50},
    {name:"Mean Lost Soul",hp:6200,xp:6200,charm:"divine_wrath",charmPts:50},
    {name:"Freakish Lost Soul",hp:7500,xp:7000,charm:"divine_wrath",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["600 Ultimate Health Potion","300 Strong Mana Potion","50 Ultimate Spirit Potion"],
    paladin:["500 Great Spirit Potion","600 Spectral Bolt"],
    sorcerer:["800 Strong Mana Potion","100 Sudden Death Rune"],
    druid:["800 Strong Mana Potion","50 Wild Growth Rune"]
  },
  trinket:"Enchanted Theurgic Amulet",
  drops:["Soul Orb","Lost Soul","Brain Head"],
  tips:"Top-tier XP and profit for 300+. Souls are weak to Holy — Divine Wrath is the best charm here. Physical + death protection rotation. Very aggressive creatures, full team needed.",
  gear:{
    "250-300":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers",
    "300+"   :"Soulmantle, Soulstrider, Soulbastion, Dreamwalkers"
  }
},
{
  name:"Ferumbras Tower",
  prot:["fire","death","energy"],
  city:"Liberty Bay",level:[250,400],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"5kk-10kk",profitH:"400k-1.5kk",
  cx:32121,cy:32688,
  route:"From Liberty Bay take the boat to Kharos island. Enter the Ferumbras Citadel after completing the quest.",
  waypoints:[[32317,32826,"Start at Liberty Bay depot"],[32300,32820,"Head west to boat"],[32270,32810,"Take boat to Kharos island"],[32230,32780,"Arrive on Kharos, head SW"],[32200,32755,"Navigate volcanic terrain"],[32175,32730,"Continue through lava fields"],[32150,32710,"Cross dangerous terrain south"],[32135,32695,"Approach Ferumbras Citadel"],[32128,32690,"Enter citadel, go down"],[32128,32690,"Underground: Ferumbras Citadel",8],[32125,32688,"Navigate citadel corridors",8],[32122,32686,"Main hunting area",8]],
  access:"Ferumbras' Ascension Quest required.",
  premium:true,
  creatures:[
    {name:"Hellflayer",hp:14000,xp:9800,charm:"divine_wrath",charmPts:50},
    {name:"Vexclaw",hp:12000,xp:8800,charm:"freeze",charmPts:50},
    {name:"Grimeleech",hp:11500,xp:8600,charm:"enflame",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["800 Ultimate Health Potion","400 Strong Mana Potion","100 Ultimate Spirit Potion"],
    paladin:["600 Great Spirit Potion","800 Spectral Bolt"],
    sorcerer:["1000 Strong Mana Potion","200 Sudden Death Rune"],
    druid:["1000 Strong Mana Potion","80 Wild Growth Rune"]
  },
  trinket:"Enchanted Theurgic Amulet",
  drops:["Blade of Destruction","Bow of Destruction","Wand of Destruction","Rod of Destruction"],
  tips:"One of the hardest regular spawns. Drops Destruction-tier weapons. Different element protection for each creature: Holy for Hellflayers (demon type), Ice for Vexclaws, Fire for Grimeleeches. Massive supplies needed.",
  gear:{
    "250-300":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers",
    "300+"   :"Soulmantle, Soulstrider, Soulbastion, Dreamwalkers"
  }
},
{
  name:"Edron Hero Cave",
  prot:["physical"],
  city:"Edron",level:[60,100],voc:["knight","paladin"],
  team:"solo",expH:"300k-500k",profitH:"50k-120k",
  cx:33164,cy:31638,
  waypoints:[[33211,31830,"Start at Edron depot"],[33205,31810,"Head north from depot"],[33198,31790,"Continue north past buildings"],[33192,31770,"Follow path NW towards hills"],[33185,31740,"Cross bridge north"],[33178,31710,"Continue through forest"],[33172,31685,"Approach Hero Cave area"],[33168,31665,"Follow trail to cave entrance"],[33164,31645,"Enter cave, go down stairs"],[33164,31645,"Underground: Hero Cave",8],[33162,31640,"Navigate cave tunnels",8],[33160,31638,"Main Hero hunting area",8]],
  route:"From Edron depot head north through the forest. Follow the trail towards the mountains where the Hero Cave entrance is located.",
  access:"None — free access.",
  premium:false,
  creatures:[
    {name:"Hero",hp:1400,xp:1200,charm:"wound",charmPts:15},
    {name:"Vile Grandmaster",hp:1700,xp:1400,charm:"wound",charmPts:15}
  ],
  imbuements:["1x Vampirism","1x Void"],
  supplies:{
    knight:["200 Strong Health Potion","50 Strong Mana Potion"],
    paladin:["150 Great Spirit Potion","200 Crystalline Arrow"]
  },
  trinket:null,
  drops:["Crown Armor","Crown Legs","Crown Shield","Great Health Potion"],
  tips:"Classic spot for knights 60-100. Heroes can combo hard — approach carefully. Wound charm (physical weakness). Use full HP approach. Crown equipment drops are decent early game profit.",
  gear:{
    "60-80":"Royal Helmet, Magic Plate Armor, Crown Legs, Boots of Haste",
    "80-100":"Zaoan Helmet, Magic Plate Armor, Golden Legs, Boots of Haste"
  }
},
{
  name:"Upper Spike",
  prot:["earth","physical"],
  city:"Kazordoon",level:[50,80],voc:["knight","druid"],
  team:"solo",expH:"200k-350k",profitH:"30k-60k",
  cx:32580,cy:31900,
  waypoints:[[32631,31925,"Start at Kazordoon depot"],[32625,31922,"Head west through dwarf city"],[32618,31918,"Enter mine area"],[32610,31915,"Take mine cart down"],[32600,31910,"Arrive at Spike entrance, go down"],[32600,31910,"Underground: Upper Spike floor -1",8],[32596,31908,"Follow gnome tunnels",8],[32590,31905,"Continue through caves",8],[32585,31902,"Go down another level",8],[32585,31902,"Underground: Lower Spike floor -2",9],[32582,31900,"Navigate deeper tunnels",9],[32580,31898,"Main hunting area",9]],
  route:"From Kazordoon depot take the mine cart system down. Follow signs to the Spike entrance in the lower levels of the city.",
  access:"Spike Tasks Quest — talk to Gnome NPCs in Kazordoon.",
  premium:true,
  creatures:[
    {name:"Wyvern",hp:1550,xp:515,charm:"enflame",charmPts:15},
    {name:"Corym Vanguard",hp:700,xp:490,charm:"wound",charmPts:5},
    {name:"Corym Skirmisher",hp:530,xp:260,charm:"wound",charmPts:5}
  ],
  imbuements:["1x Vampirism"],
  supplies:{
    knight:["150 Strong Health Potion","30 Mana Potion"],
    druid:["200 Strong Mana Potion","20 Avalanche Rune"]
  },
  trinket:null,
  drops:["Wyvern Talisman","Corym Bag","Small Ruby"],
  tips:"Good team spot. Druids heal knight, knight blocks groups. Wyverns weak to Fire — Enflame charm. Coryms weak to Physical — Wound.",
  gear:{
    "50-70":"Soldier Helmet, Blue Robe, Crown Legs, Boots of Haste",
    "70-80":"Royal Helmet, Magic Plate Armor, Crown Legs, Boots of Haste"
  }
},
{
  name:"Krailos Steppe",
  prot:["physical","earth"],
  city:"Edron",level:[60,100],voc:["knight","paladin","druid"],
  team:"solo",expH:"350k-600k",profitH:"40k-100k",
  cx:33540,cy:31610,
  waypoints:[[33594,31899,"Start at Rathleton depot"],[33590,31880,"Head to Krailos boat"],[33585,31860,"Take boat to Krailos"],[33575,31800,"Arrive on Krailos"],[33570,31770,"Head north on surface"],[33565,31740,"Cross the open steppe"],[33560,31710,"Continue north through grasslands"],[33555,31670,"Follow path through ogre territory"],[33548,31640,"Approach hunting grounds"],[33543,31620,"Enter main Krailos hunting area"],[33540,31610,"Arrive at ogre camp"]],
  route:"From Edron take the boat/teleport to Krailos. The steppe hunting grounds are on the surface — head north from the arrival point.",
  access:"None after reaching Krailos.",
  premium:true,
  creatures:[
    {name:"Ogre Brute",hp:2400,xp:800,charm:"wound",charmPts:15},
    {name:"Ogre Savage",hp:2600,xp:900,charm:"wound",charmPts:15},
    {name:"Ogre Shaman",hp:1800,xp:700,charm:"wound",charmPts:15}
  ],
  imbuements:["1x Vampirism","1x Void"],
  supplies:{
    knight:["200 Strong Health Potion","50 Strong Mana Potion"],
    paladin:["150 Great Spirit Potion","200 Crystalline Arrow"],
    druid:["300 Strong Mana Potion","20 Avalanche Rune"]
  },
  trinket:null,
  drops:["Ogre Ear Stud","Ogre Nose Ring","Crown Armor"],
  tips:"Ogres have high physical damage. Earth protection helps against Shamans. Wound charm (neutral to most). Good spot for leveling 60-100.",
  gear:{
    "60-80":"Royal Helmet, Magic Plate Armor, Crown Legs, Boots of Haste",
    "80-100":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots"
  }
},
{
  name:"Demon Forge — Goroma",
  prot:["fire","death","energy"],
  city:"Liberty Bay",level:[200,350],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"3kk-5kk",profitH:"200k-500k",
  cx:32095,cy:32583,
  waypoints:[[32317,32826,"Start at Liberty Bay depot"],[32300,32820,"Head west to dock"],[32280,32810,"Take boat to Goroma"],[32250,32780,"Arrive on Goroma island"],[32220,32755,"Head south through volcanic terrain"],[32190,32730,"Cross lava fields"],[32170,32705,"Continue south past volcanos"],[32145,32680,"Navigate dangerous terrain"],[32125,32660,"Approach Demon Forge entrance"],[32110,32640,"Enter forge, go down"],[32110,32640,"Underground: Demon Forge",8],[32105,32620,"Navigate underground forges",8],[32100,32600,"Continue through demon halls",8],[32098,32585,"Arrive at Demon Forge hunting area",8]],
  route:"From Liberty Bay take the boat to Goroma island. Navigate through the volcanic terrain south to the demon forge entrance.",
  access:"None after reaching Goroma.",
  premium:true,
  creatures:[
    {name:"Demon",hp:8200,xp:6000,charm:"divine_wrath",charmPts:50},
    {name:"Dark Torturer",hp:7350,xp:4650,charm:"divine_wrath",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["500 Ultimate Health Potion","200 Strong Mana Potion"],
    paladin:["400 Great Spirit Potion","500 Spectral Bolt"],
    sorcerer:["700 Strong Mana Potion","100 Sudden Death Rune"],
    druid:["700 Strong Mana Potion","40 Wild Growth Rune"]
  },
  trinket:"Enchanted Theurgic Amulet",
  drops:["Demon Horn","Demonrage Sword","Magic Plate Armor","Demon Legs","Fire Axe"],
  tips:"Classic demon hunting. Fire protection ESSENTIAL — Demons deal massive fire damage. Divine Wrath charm (demons weak to Holy). Demons can combo very hard — knight must be experienced.",
  gear:{
    "200-250":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers",
    "250+"   :"Soulmantle, Soulstrider, Dreamwalkers"
  }
},
{
  name:"Soul War — Zarganash",
  prot:["death","fire","physical"],
  city:"Rathleton",level:[300,999],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"10kk-20kk",profitH:"500k-2kk",
  cx:33604,cy:31495,
  waypoints:[[33594,31899,"Start at Rathleton depot"],[33590,31880,"Head to Feyrist portal entrance"],[33585,31860,"Navigate through outskirts"],[33580,31840,"Follow path to portal"],[33575,31810,"Continue west"],[33570,31780,"Approach portal area"],[33565,31750,"Enter Feyrist portal"],[33560,31700,"Teleported to Zarganash realm"],[33570,31650,"Navigate soul planes"],[33580,31600,"Clear through taint levels"],[33590,31550,"Continue deeper"],[33600,31520,"Approach hunting grounds"],[33604,31500,"Arrive at Soul War hunting area"]],
  route:"Enter Zarganash through the Feyrist portal. Navigate through soul planes — different taint levels unlock different areas.",
  access:"Soul War Quest required (many prerequisites, months of preparation).",
  premium:true,
  creatures:[
    {name:"Brachiodemon",hp:21000,xp:17500,charm:"divine_wrath",charmPts:50},
    {name:"Capricious Phantom",hp:18000,xp:15000,charm:"wound",charmPts:50},
    {name:"Turbulent Elemental",hp:16500,xp:14000,charm:"wound",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["1000 Ultimate Health Potion","500 Strong Mana Potion","200 Ultimate Spirit Potion"],
    paladin:["800 Great Spirit Potion","1000 Spectral Bolt","100 Ultimate Spirit Potion"],
    sorcerer:["1500 Strong Mana Potion","200 Sudden Death Rune"],
    druid:["1500 Strong Mana Potion","100 Wild Growth Rune"]
  },
  trinket:"Enchanted Theurgic Amulet",
  drops:["Soulmantle","Soulstrider","Soulbastion","Soulcutter","Soulpiercer","Soultainter","Soulbleeder"],
  tips:"THE endgame of Tibia. Best-in-slot Soul equipment drops here. Requires a dedicated team of 30+. Massive supplies. Each boss requires perfect teamwork and different protection rotations.",
  gear:{
    "300-400":"Falcon full set, Dreamwalkers",
    "400+"   :"Soul equipment (from this very spawn)"
  }
},
// ===== LOW LEVEL SPOTS (8-60) =====
{
  name:"Mintwallin Minotaurs",
  city:"Thais",level:[15,40],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"20k-80k",profitH:"5k-20k",
  prot:["physical"],
  cx:32356,cy:32170,
  route:"From Thais depot head north through the city. Follow the path west past the troll cave. Enter the underground hole — Mintwallin is a massive underground minotaur city.",
  waypoints:[[32369,32241,"Start at Thais depot"],[32368,32230,"Head north from depot"],[32367,32218,"Follow road north through city"],[32365,32206,"Continue past temple"],[32363,32195,"Head north towards Ancient Temple"],[32360,32185,"Follow path north"],[32358,32178,"Approach Ancient Temple entrance"],[32356,32170,"Enter Ancient Temple, go down"],[32356,32170,"Underground: Ancient Temple tunnels",8],[32358,32168,"Navigate tunnels south",8],[32360,32160,"Follow passages deeper",8],[32365,32150,"Continue through caves",8],[32370,32140,"Enter Mintwallin outskirts",8],[32375,32130,"Main Mintwallin hunting area",8]],
  access:"None — free access. Bring a rope and shovel.",
  premium:false,
  creatures:[
    {name:"Minotaur",hp:100,xp:50,charm:"wound",charmPts:5},
    {name:"Minotaur Guard",hp:185,xp:160,charm:"wound",charmPts:5},
    {name:"Minotaur Archer",hp:100,xp:65,charm:"wound",charmPts:5},
    {name:"Minotaur Mage",hp:155,xp:150,charm:"wound",charmPts:5}
  ],
  imbuements:[],
  supplies:{
    knight:["50 Health Potion","10 Mana Potion"],
    paladin:["30 Health Potion","50 Spear"],
    sorcerer:["50 Mana Potion"],
    druid:["50 Mana Potion"]
  },
  trinket:null,
  drops:["Minotaur Leather","Plate Armor","Battle Shield","Brass Helmet","Minotaur Horn"],
  tips:"Classic beginner dungeon. Minotaur Guards and Mages hit hard for their level — don't pull big groups. Good money from Minotaur Leather and equipment drops. Bring a rope to exit!",
  gear:{"15-30":"Studded Helmet, Scale Armor, Plate Legs, Leather Boots","30-40":"Soldier Helmet, Noble Armor, Crown Legs, Leather Boots"}
},
{
  name:"Amazon Camp — Venore",
  city:"Venore",level:[20,50],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"30k-100k",profitH:"10k-30k",
  prot:["physical"],
  cx:32960,cy:32140,
  route:"From Venore depot head south through the swamps. Cross the wooden bridges and continue south-east to the Amazon camp on the hill.",
  waypoints:[[32957,32076,"Start at Venore depot"],[32958,32085,"Head south from depot"],[32958,32095,"Follow swamp boardwalk south"],[32958,32108,"Cross first wooden bridge"],[32959,32118,"Continue SE through swamps"],[32960,32128,"Cross second bridge"],[32960,32135,"Approach Amazon camp on hill"],[32960,32140,"Arrive at Amazon Camp"]],
  access:"None — free access.",
  premium:false,
  creatures:[
    {name:"Amazon",hp:110,xp:60,charm:"freeze",charmPts:5},
    {name:"Valkyrie",hp:190,xp:85,charm:"freeze",charmPts:5},
    {name:"Witch",hp:300,xp:120,charm:"freeze",charmPts:10}
  ],
  imbuements:[],
  supplies:{
    knight:["50 Health Potion","10 Mana Potion"],
    paladin:["30 Health Potion","100 Spear"],
    sorcerer:["60 Mana Potion"],
    druid:["60 Mana Potion"]
  },
  trinket:null,
  drops:["Amazon Armor","Amazon Helmet","Amazon Shield","Skull","Protective Charm"],
  tips:"Amazon Armor and Helmet sell well to NPCs. Witches can summon creatures — kill them first. Valkyries combo hard in groups. All weak to Ice — Freeze charm if available.",
  gear:{"20-35":"Steel Helmet, Plate Armor, Plate Legs, Leather Boots","35-50":"Soldier Helmet, Noble Armor, Crown Legs, Boots of Haste"}
},
{
  name:"Cyclops Camp — Edron",
  city:"Edron",level:[25,55],voc:["knight","paladin"],
  team:"solo",expH:"40k-120k",profitH:"15k-40k",
  prot:["physical"],
  cx:33250,cy:31850,
  route:"From Edron depot go south-east past the castle walls. The cyclops camp is on the surface near the mountain east of town.",
  waypoints:[[33217,31814,"Start at Edron depot"],[33222,31818,"Head SE from depot"],[33228,31824,"Pass castle walls"],[33234,31830,"Continue east on road"],[33240,31836,"Follow path towards mountain"],[33245,31842,"Cross open field"],[33250,31848,"Approach Cyclops territory"],[33253,31852,"Arrive at Cyclops Camp"]],
  access:"None — free access.",
  premium:false,
  creatures:[
    {name:"Cyclops",hp:260,xp:150,charm:"wound",charmPts:5},
    {name:"Cyclops Smith",hp:435,xp:255,charm:"wound",charmPts:10},
    {name:"Cyclops Drone",hp:325,xp:200,charm:"wound",charmPts:5}
  ],
  imbuements:["1x Vampirism"],
  supplies:{
    knight:["50 Health Potion","20 Mana Potion"],
    paladin:["50 Health Potion","100 Royal Spear"]
  },
  trinket:null,
  drops:["Cyclops Toe","Battle Shield","Plate Armor","Club Ring","Cyclops Trophy"],
  tips:"Excellent solo knight spot. Cyclops Toe is valuable for Vampirism imbuements. Smith hits hardest — be careful. Wound charm works well. Good physical armor needed.",
  gear:{"25-40":"Steel Helmet, Plate Armor, Plate Legs, Leather Boots","40-55":"Soldier Helmet, Noble Armor, Crown Legs, Boots of Haste"}
},
{
  name:"Larvas & Scarabs — Ankrahmun",
  city:"Ankrahmun",level:[30,60],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"50k-150k",profitH:"15k-50k",
  prot:["earth","physical"],
  cx:33190,cy:32660,
  route:"From Ankrahmun depot head south-west to the desert tombs. Larvas are on the upper floors, Ancient Scarabs deeper down.",
  waypoints:[[33162,32688,"Start at Ankrahmun depot"],[33158,32685,"Head SW through desert"],[33152,32680,"Follow sand path SW"],[33148,32675,"Continue past palm trees"],[33145,32670,"Approach tomb entrance"],[33142,32666,"Enter tombs, go down"],[33142,32666,"Underground: Ankrahmun Tombs",8],[33144,32664,"Navigate upper tomb corridors",8],[33148,32660,"Follow passages deeper",8],[33152,32658,"Reach Ancient Scarab area",8]],
  access:"None — free access (premium island).",
  premium:true,
  creatures:[
    {name:"Larva",hp:70,xp:44,charm:"freeze",charmPts:5},
    {name:"Scarab",hp:320,xp:120,charm:"freeze",charmPts:5},
    {name:"Ancient Scarab",hp:1000,xp:720,charm:"freeze",charmPts:15}
  ],
  imbuements:["1x Vampirism"],
  supplies:{
    knight:["80 Health Potion","30 Mana Potion"],
    paladin:["60 Health Potion","100 Royal Spear"],
    sorcerer:["100 Mana Potion","20 Sudden Death Rune"],
    druid:["100 Mana Potion"]
  },
  trinket:"Terra Amulet",
  drops:["Scarab Coin","Ancient Amulet","Scarab Shield","Scarab Amulet","Piece of Scarab Shell"],
  tips:"Ancient Scarabs hit hard and PARALYZE — Terra Amulet for earth protection is essential! Scarab Coins sell well. Piece of Scarab Shell used for imbuements. All weak to Ice — Freeze charm.",
  gear:{"30-45":"Soldier Helmet, Noble Armor, Crown Legs, Leather Boots","45-60":"Royal Helmet, Magic Plate Armor, Golden Legs, Boots of Haste"}
},
{
  name:"Orc Fortress — Edron",
  city:"Edron",level:[30,60],voc:["knight","paladin"],
  team:"solo",expH:"40k-100k",profitH:"10k-30k",
  prot:["physical"],
  cx:33240,cy:31870,
  route:"From Edron depot go south past the castle walls. Continue south-east to the orcish fortification. Enter through the wooden gate.",
  waypoints:[[33217,31814,"Start at Edron depot"],[33220,31820,"Head south from depot"],[33222,31828,"Continue south past castle walls"],[33225,31838,"Follow road SE"],[33228,31848,"Cross field towards fort"],[33232,31858,"Approach orc fortification"],[33236,31865,"Enter through wooden gate"],[33240,31870,"Arrive at Orc Fortress"]],
  access:"None — free access.",
  premium:false,
  creatures:[
    {name:"Orc Leader",hp:450,xp:270,charm:"wound",charmPts:10},
    {name:"Orc Berserker",hp:210,xp:195,charm:"wound",charmPts:5},
    {name:"Orc Warlord",hp:950,xp:670,charm:"wound",charmPts:15}
  ],
  imbuements:["1x Vampirism"],
  supplies:{
    knight:["60 Health Potion","20 Mana Potion"],
    paladin:["50 Health Potion","100 Royal Spear"]
  },
  trinket:null,
  drops:["Orc Tooth","Plate Armor","Dark Helmet","Amazon Armor","Warrior Helmet"],
  tips:"Orc Warlords are very strong — never pull groups of them! Orc Tooth needed for Strike imbuement. Good spot to learn blocking for knights.",
  gear:{"30-45":"Soldier Helmet, Noble Armor, Crown Legs, Leather Boots","45-60":"Royal Helmet, Magic Plate Armor, Golden Legs, Boots of Haste"}
},
// ===== MID LEVEL SPOTS (50-120) =====
{
  name:"Giant Spider Cave — Port Hope",
  city:"Port Hope",level:[50,80],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"80k-200k",profitH:"20k-60k",
  prot:["earth"],
  cx:32660,cy:32780,
  route:"From Port Hope depot head east into the jungle. Cross the bridge over the river. Enter the cave south-east of the jungle village.",
  waypoints:[[32623,32753,"Start at Port Hope depot"],[32630,32755,"Head east into jungle"],[32638,32760,"Follow jungle path east"],[32645,32765,"Cross river bridge"],[32652,32772,"Continue SE through dense jungle"],[32658,32778,"Find cave entrance in hillside"],[32662,32782,"Enter spider cave, go down"],[32662,32782,"Underground: Giant Spider Cave",8],[32664,32784,"Navigate dark tunnels",8],[32666,32786,"Main spider hunting area",8]],
  access:"None — free access.",
  premium:true,
  creatures:[
    {name:"Giant Spider",hp:1300,xp:900,charm:"enflame",charmPts:15},
    {name:"Crystal Spider",hp:1250,xp:900,charm:"enflame",charmPts:15}
  ],
  imbuements:["1x Vampirism","1x Void"],
  supplies:{
    knight:["100 Strong Health Potion","30 Mana Potion"],
    paladin:["80 Health Potion","150 Royal Star"],
    sorcerer:["200 Mana Potion"],
    druid:["200 Mana Potion"]
  },
  trinket:"Terra Amulet",
  drops:["Spider Silk","Knight Armor","Plate Armor","Steel Helmet","Time Ring"],
  tips:"Giant Spiders PARALYZE — Terra Amulet is mandatory! Spider Silk is valuable. They're weak to Fire — use Enflame charm. Watch for surprise spawns around corners.",
  gear:{"50-65":"Soldier Helmet, Noble Armor, Crown Legs, Boots of Haste","65-80":"Royal Helmet, Magic Plate Armor, Golden Legs, Boots of Haste"}
},
{
  name:"Werehyaenas — Darashia",
  city:"Darashia",level:[60,100],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"200k-500k",profitH:"80k-200k",
  prot:["death","physical"],
  cx:33250,cy:32450,
  route:"From Darashia depot head east through the desert. Enter the underground cave system beneath the sand hills.",
  waypoints:[[33224,32432,"Start at Darashia depot"],[33228,32436,"Head east through desert"],[33234,32440,"Follow sand path east"],[33240,32443,"Continue past sand dunes"],[33246,32446,"Approach cave in hills"],[33250,32448,"Enter Werehyaena cave, go down"],[33250,32448,"Underground: Werehyaena Den",8],[33252,32450,"Navigate dark tunnels",8],[33254,32452,"Follow passage deeper",8],[33256,32454,"Main hunting area",8]],
  access:"Short access quest.",
  premium:true,
  creatures:[
    {name:"Werehyaena",hp:2200,xp:1800,charm:"zap",charmPts:25},
    {name:"Werehyaena Shaman",hp:2700,xp:2100,charm:"zap",charmPts:25}
  ],
  imbuements:["2x Vampirism","2x Void"],
  supplies:{
    knight:["150 Strong Health Potion","40 Strong Mana Potion"],
    paladin:["150 Great Spirit Potion","200 Crystalline Arrow"],
    sorcerer:["300 Strong Mana Potion","30 Sudden Death Rune"],
    druid:["300 Strong Mana Potion","20 Wild Growth Rune"]
  },
  trinket:"Foxtail Amulet",
  drops:["Werehyaena Talisman","Werehyaena Trophy","Moonstone","Moonlight Crystals"],
  tips:"Weak to Energy — Zap charm on both. Death protection helps (Foxtail Amulet). Shamans heal others — target them first. Good loot from Moon items. Only during full moon!",
  gear:{"60-80":"Royal Helmet, Magic Plate Armor, Golden Legs, Boots of Haste","80-100":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots"}
},
{
  name:"Mutated Humans — Yalahar",
  city:"Yalahar",level:[60,100],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"150k-400k",profitH:"50k-150k",
  prot:["energy","earth"],
  cx:32810,cy:31285,
  route:"From Yalahar depot go to the Alchemist Quarter. Navigate through the mutated areas in the northern quarter of the city.",
  waypoints:[[32792,31274,"Start at Yalahar depot"],[32795,31276,"Head NE to Alchemist Quarter"],[32798,31278,"Enter quarter through gate"],[32802,31280,"Navigate through mutated streets"],[32806,31282,"Continue north past buildings"],[32808,31284,"Follow path through rubble"],[32810,31286,"Enter main mutated area"],[32812,31288,"Arrive at Mutated Humans zone"]],
  access:"In Service of Yalahar Quest required.",
  premium:true,
  creatures:[
    {name:"Mutated Human",hp:3500,xp:2450,charm:"freeze",charmPts:25},
    {name:"Mutated Rat",hp:550,xp:450,charm:"freeze",charmPts:10},
    {name:"Mutated Tiger",hp:1100,xp:750,charm:"freeze",charmPts:15}
  ],
  imbuements:["2x Vampirism","2x Void"],
  supplies:{
    knight:["150 Strong Health Potion","50 Strong Mana Potion"],
    paladin:["150 Great Spirit Potion","200 Royal Star"],
    sorcerer:["300 Strong Mana Potion"],
    druid:["300 Strong Mana Potion"]
  },
  trinket:null,
  drops:["Mutated Flesh","Strange Talisman","Berserk Potion","Fist on a Stick"],
  tips:"Very popular for 80-100 range — great XP/h! Deal energy and earth damage. All weak to Ice — Freeze charm. Be careful of large pulls — they combo hard. Mutated Humans hit the hardest.",
  gear:{"60-80":"Royal Helmet, Magic Plate Armor, Golden Legs, Boots of Haste","80-100":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots"}
},
{
  name:"Wyrms — Drefia",
  city:"Darashia",level:[70,120],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"200k-500k",profitH:"50k-150k",
  prot:["energy","fire"],
  cx:33018,cy:32443,
  route:"From Darashia depot head north-east through the desert. Cross the sand bridge to the Drefia underground crypt entrance.",
  waypoints:[[33224,32432,"Start at Darashia depot"],[33210,32432,"Head west from depot"],[33190,32430,"Follow desert road west"],[33170,32430,"Continue west through desert"],[33150,32432,"Cross sand expanse"],[33120,32435,"Keep heading west"],[33090,32438,"Approach Drefia area"],[33060,32440,"Follow path to crypt entrance"],[33030,32442,"Near Drefia underground entrance"],[33018,32443,"Enter Drefia Crypt, go down"],[33018,32443,"Underground: Drefia Wyrm area",8],[33020,32445,"Navigate crypt tunnels",8],[33022,32448,"Main Wyrm hunting area",8]],
  access:"Access through Drefia underground crypt.",
  premium:true,
  creatures:[
    {name:"Wyrm",hp:1825,xp:1550,charm:"freeze",charmPts:15},
    {name:"Elder Wyrm",hp:2700,xp:2700,charm:"freeze",charmPts:25}
  ],
  imbuements:["2x Vampirism","2x Void"],
  supplies:{
    knight:["150 Strong Health Potion","50 Strong Mana Potion"],
    paladin:["150 Great Spirit Potion","200 Crystalline Arrow"],
    sorcerer:["300 Strong Mana Potion","30 Sudden Death Rune"],
    druid:["300 Strong Mana Potion","20 Wild Growth Rune"]
  },
  trinket:null,
  drops:["Wyrm Scale","Dragon Scale Mail","Shiny Blade","Focus Cape","Dragonbone Staff"],
  tips:"Wyrms deal energy and fire damage — rotate protection. Elder Wyrms hit VERY hard — careful when pulling multiples. Both weak to Ice — Freeze charm ideal. Great XP for solo 90-120.",
  gear:{"70-90":"Royal Helmet, Magic Plate Armor, Golden Legs, Boots of Haste","90-120":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots"}
},
// ===== MID-HIGH LEVEL SPOTS (100-200) =====
{
  name:"Upper Spike — Kazordoon",
  city:"Kazordoon",level:[100,160],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"500k-1kk",profitH:"100k-300k",
  prot:["earth","physical"],
  cx:32640,cy:31940,
  route:"From Kazordoon depot head to the mine entrance in the mountain. Take the elevator down to the Spike. Navigate to the upper levels.",
  waypoints:[[32631,31925,"Start at Kazordoon depot"],[32634,31928,"Head west to mine entrance"],[32636,31930,"Enter mine area"],[32638,31932,"Take elevator down"],[32638,31932,"Underground: Spike entrance floor -1",8],[32639,31934,"Navigate gnome tunnels",8],[32640,31936,"Follow passage to deeper level",8],[32640,31936,"Underground: Spike floor -2",9],[32640,31938,"Continue through caves",9],[32640,31940,"Main Upper Spike hunting area",9]],
  access:"Gnomish access quest required.",
  premium:true,
  creatures:[
    {name:"Crystalcrusher",hp:3500,xp:2700,charm:"freeze",charmPts:25},
    {name:"Deepworm",hp:2600,xp:2100,charm:"enflame",charmPts:25},
    {name:"Diremaw",hp:3000,xp:2500,charm:"freeze",charmPts:25}
  ],
  imbuements:["2x Vampirism","2x Void","1x Strike"],
  supplies:{
    knight:["200 Strong Health Potion","60 Strong Mana Potion"],
    paladin:["200 Great Spirit Potion","200 Crystalline Arrow"],
    sorcerer:["400 Strong Mana Potion","40 Sudden Death Rune"],
    druid:["400 Strong Mana Potion","20 Wild Growth Rune"]
  },
  trinket:"Terra Amulet",
  drops:["Crystal Bone","Crystalline Armor","Gnome Sword","Spike Sword","Red Gem"],
  tips:"Earth protection important — Diremaws deal earth damage. Crystalcrushers hit hard physically. Good XP for 120-160 range. Freeze charm works on most creatures here.",
  gear:{"100-130":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots","130-160":"Cobra Hood, Prismatic Armor, Ornate Legs, Dreamwalkers"}
},
{
  name:"Banuta — Port Hope",
  city:"Port Hope",level:[100,160],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"600k-1.2kk",profitH:"100k-300k",
  prot:["earth","physical"],
  cx:32807,cy:32542,
  route:"From Port Hope depot head south into the deep jungle. Cross the river and navigate to the ape city entrance at Banuta.",
  waypoints:[[32623,32753,"Start at Port Hope depot"],[32640,32740,"Head north from depot"],[32660,32725,"Follow jungle path NW"],[32680,32710,"Continue through jungle"],[32700,32690,"Cross river bridge"],[32720,32665,"Follow trail north"],[32740,32640,"Head NE through clearings"],[32760,32610,"Continue towards Banuta"],[32780,32580,"Approach ape city area"],[32795,32555,"Near Banuta entrance"],[32807,32542,"Enter Banuta, go down"],[32807,32542,"Underground: Banuta floor -1",8],[32805,32540,"Navigate ape city corridors",8],[32803,32538,"Main Banuta hunting area",8]],
  access:"Ape City Quest for full access. Partial access without quest.",
  premium:true,
  creatures:[
    {name:"Medusa",hp:4500,xp:4050,charm:"freeze",charmPts:25},
    {name:"Serpent Spawn",hp:3000,xp:3050,charm:"freeze",charmPts:25},
    {name:"Hydra",hp:2350,xp:2100,charm:"freeze",charmPts:15}
  ],
  imbuements:["2x Vampirism","2x Void","1x Strike"],
  supplies:{
    knight:["200 Strong Health Potion","80 Strong Mana Potion"],
    paladin:["200 Great Spirit Potion","200 Crystalline Arrow"],
    sorcerer:["400 Strong Mana Potion","50 Sudden Death Rune"],
    druid:["400 Strong Mana Potion","20 Wild Growth Rune"]
  },
  trinket:"Terra Amulet",
  drops:["Medusa Shield","Strand of Medusa Hair","Sacred Tree Amulet","Serpent Spawn Scale","Hydra Head"],
  tips:"Strand of Medusa Hair = valuable for Epiphany imbuement! Medusas PARALYZE — Terra Amulet essential. All weak to Ice — Freeze charm. Don't get cornered — they combo hard.",
  gear:{"100-130":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots","130-160":"Cobra Hood, Prismatic Armor, Ornate Legs, Dreamwalkers"}
},
{
  name:"Nightmare Isles — Roshamuul",
  city:"Roshamuul",level:[130,200],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"1kk-2kk",profitH:"100k-300k",
  prot:["death","physical"],
  cx:33540,cy:32350,
  route:"From Roshamuul dock navigate north-east. Cross the dangerous surface (beware of Guzzlemaws!). Enter the Nightmare Isles area.",
  waypoints:[[33513,32363,"Start at Roshamuul dock"],[33518,32361,"Head NE from dock"],[33522,32359,"Navigate dangerous surface"],[33527,32357,"Avoid Guzzlemaws on path!"],[33532,32355,"Continue NE carefully"],[33536,32353,"Approach Nightmare Isles area"],[33540,32351,"Enter Nightmare Isles zone"],[33542,32349,"Main hunting area"]],
  access:"Roshamuul Quest required.",
  premium:true,
  creatures:[
    {name:"Nightmare",hp:2700,xp:2150,charm:"wound",charmPts:25},
    {name:"Nightmare Scion",hp:1400,xp:1350,charm:"wound",charmPts:15},
    {name:"Plaguesmith",hp:5000,xp:4000,charm:"wound",charmPts:25}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["250 Strong Health Potion","80 Strong Mana Potion","20 Ultimate Health Potion"],
    paladin:["200 Great Spirit Potion","300 Crystalline Arrow"],
    sorcerer:["500 Strong Mana Potion","50 Sudden Death Rune"],
    druid:["500 Strong Mana Potion","30 Wild Growth Rune"]
  },
  trinket:"Foxtail Amulet",
  drops:["Nightmare Blade","Skeleton Decoration","Plaguesmith Trophy","Cluster of Solace"],
  tips:"Death protection essential — Foxtail Amulet mandatory. Plaguemiths hit extremely hard physically. Wound charm recommended (neutral to elements). Great solo knight spot for 150+.",
  gear:{"130-150":"Zaoan Helmet, Prismatic Armor, Zaoan Legs, Guardian Boots","150-200":"Cobra Hood, Prismatic Armor, Ornate Legs, Dreamwalkers"}
},
// ===== HIGH LEVEL SPOTS (150-300+) =====
{
  name:"Carnivoras — Port Hope",
  city:"Port Hope",level:[150,250],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"1.5kk-3kk",profitH:"200k-600k",
  prot:["physical","earth"],
  cx:32640,cy:32770,
  route:"From Port Hope depot head south-east into the jungle. Navigate to the Carnivora's Rocks area through the mountain pass.",
  waypoints:[[32623,32753,"Start at Port Hope depot"],[32626,32756,"Head SE from depot"],[32630,32760,"Follow jungle trail south"],[32634,32764,"Continue through dense vegetation"],[32637,32767,"Navigate mountain pass"],[32640,32770,"Enter Carnivora's Rocks area"],[32642,32772,"Main Carnivora hunting zone"]],
  access:"Short access quest from Port Hope.",
  premium:true,
  creatures:[
    {name:"Carnivostrich",hp:5500,xp:4200,charm:"freeze",charmPts:50},
    {name:"Sabretooth",hp:4700,xp:3900,charm:"freeze",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Strike"],
  supplies:{
    knight:["300 Strong Health Potion","100 Strong Mana Potion","20 Ultimate Health Potion"],
    paladin:["250 Great Spirit Potion","300 Crystalline Arrow"],
    sorcerer:["500 Strong Mana Potion","50 Sudden Death Rune"],
    druid:["500 Strong Mana Potion","30 Wild Growth Rune"]
  },
  trinket:null,
  drops:["Sabretooth Fur","Carnivostrich Feather","Green Gem","Blue Gem"],
  tips:"Very popular solo spot for 180-250. Physical protection important. Both weak to Ice — Freeze charm. Sabretooths can combo hard — keep distance as mage.",
  gear:{"150-200":"Cobra Hood, Prismatic Armor, Ornate Legs, Dreamwalkers","200-250":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers"}
},
{
  name:"Crazed Winter Elves — Feyrist",
  city:"Feyrist",level:[200,300],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"3kk-6kk",profitH:"300k-800k",
  prot:["ice","holy"],
  cx:33565,cy:32215,
  route:"Access through fairy portals from Ab'Dendriel or Carlin to Feyrist. Navigate to the Crazed Winter area in the northern part of the island.",
  waypoints:[[33558,32240,"Arrive at Feyrist portal"],[33558,32232,"Head north from portal"],[33560,32225,"Follow path through enchanted forest"],[33562,32220,"Continue north past fairy gardens"],[33564,32218,"Cross crystal bridge"],[33565,32215,"Enter Crazed Winter zone"],[33566,32210,"Navigate icy corridors"],[33567,32205,"Main hunting area"]],
  access:"A Threatened Dream Quest + separate access for Crazed area.",
  premium:true,
  creatures:[
    {name:"Crazed Winter Rearguard",hp:6200,xp:5000,charm:"enflame",charmPts:50},
    {name:"Crazed Winter Vanguard",hp:7500,xp:6200,charm:"enflame",charmPts:50},
    {name:"Arachnophobica",hp:5500,xp:4800,charm:"wound",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Strike"],
  supplies:{
    knight:["400 Ultimate Health Potion","200 Strong Mana Potion"],
    paladin:["350 Great Spirit Potion","400 Spectral Bolt"],
    sorcerer:["600 Strong Mana Potion","80 Sudden Death Rune"],
    druid:["600 Strong Mana Potion","40 Wild Growth Rune"]
  },
  trinket:"Glacier Amulet",
  drops:["Dream Matter","Crazed Winter Rearguard Trophy","Winter Blade"],
  tips:"Winter Elves deal heavy ice and holy damage — Glacier Amulet essential. Fire-based attacks deal bonus damage — Enflame charm. Very fast respawn. Popular solo mage spot for 250+.",
  gear:{"200-250":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers","250-300":"Soulmantle, Soulstrider, Dreamwalkers"}
},
{
  name:"Issavi Sewers — Kilmaresh",
  city:"Issavi",level:[200,300],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"2kk-4kk",profitH:"200k-500k",
  prot:["earth","death"],
  cx:33907,cy:31512,
  route:"From Issavi depot head east through the city to the sewers entrance. Navigate through the underground tunnel system.",
  waypoints:[[33907,31512,"Start at Issavi depot"],[33912,31510,"Head east from depot"],[33918,31508,"Follow road through city"],[33925,31505,"Continue past marketplace"],[33932,31502,"Cross eastern plaza"],[33938,31498,"Find sewers entrance grate"],[33940,31495,"Enter sewers, go down"],[33940,31495,"Underground: Issavi Sewers",8],[33938,31492,"Navigate sewer tunnels",8],[33935,31488,"Follow passages west",8],[33932,31485,"Main Usurper hunting area",8]],
  access:"Kilmaresh Quest for Issavi access.",
  premium:true,
  creatures:[
    {name:"Usurper Archer",hp:7000,xp:5200,charm:"wound",charmPts:50},
    {name:"Usurper Knight",hp:8500,xp:6000,charm:"wound",charmPts:50},
    {name:"Usurper Warlock",hp:6500,xp:5500,charm:"wound",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["400 Ultimate Health Potion","200 Strong Mana Potion"],
    paladin:["350 Great Spirit Potion","400 Spectral Bolt"],
    sorcerer:["600 Strong Mana Potion","80 Sudden Death Rune"],
    druid:["600 Strong Mana Potion","40 Wild Growth Rune"]
  },
  trinket:"Foxtail Amulet",
  drops:["Green Gem","Blue Gem","Gold Ingot","Usurper Commander's Helmet"],
  tips:"Great solo spot for 250+. Wound charm on all (neutral elements). Death and earth protection recommended. Warlocks heal others — focus them first. Profitable and fast respawn.",
  gear:{"200-250":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers","250-300":"Soulmantle, Soulstrider, Dreamwalkers"}
},
{
  name:"Buried Cathedral",
  city:"Edron",level:[250,350],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"6kk-12kk",profitH:"300k-800k",
  prot:["death","physical"],
  cx:33200,cy:31860,
  route:"Access through underground tunnels from Edron. Navigate through the ancient cemetery and dark passages below the city.",
  waypoints:[[33211,31830,"Start at Edron depot"],[33210,31835,"Head south from depot"],[33208,31842,"Follow path towards cemetery"],[33205,31850,"Continue south past graveyard"],[33202,31855,"Approach underground entrance"],[33200,31860,"Enter crypt, go down stairs"],[33200,31860,"Underground: Cemetery tunnels",8],[33198,31862,"Navigate dark passages",8],[33196,31866,"Follow corridor deeper",8],[33194,31870,"Continue through catacombs",8],[33192,31875,"Enter Buried Cathedral area",8],[33190,31880,"Main hunting room",8]],
  access:"Grave Danger Quest required.",
  premium:true,
  creatures:[
    {name:"Retching Horror",hp:9000,xp:7500,charm:"wound",charmPts:50},
    {name:"Meandering Mushroom",hp:7800,xp:6500,charm:"enflame",charmPts:50},
    {name:"Branchy Crawler",hp:8200,xp:6800,charm:"enflame",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["600 Ultimate Health Potion","300 Strong Mana Potion"],
    paladin:["500 Great Spirit Potion","600 Spectral Bolt"],
    sorcerer:["800 Strong Mana Potion","100 Sudden Death Rune"],
    druid:["800 Strong Mana Potion","50 Wild Growth Rune"]
  },
  trinket:"Foxtail Amulet",
  drops:["Pair of Nightmare Boots","Fabulous Legs","Enchanted Theurgic Amulet","Brain Head"],
  tips:"Part of the Grave Danger quest area. Heavy death damage — Foxtail Amulet mandatory. Retching Horrors are the most dangerous and combo very hard. Great XP for 280+ teams.",
  gear:{"250-300":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers","300-350":"Soulmantle, Soulstrider, Soulbastion, Dreamwalkers"}
},
{
  name:"Claustrophobic Inferno",
  city:"Thais",level:[250,400],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"7kk-15kk",profitH:"200k-600k",
  prot:["fire","physical"],
  cx:32350,cy:32300,
  route:"Access through Pits of Inferno area south of Thais. Requires navigating through dangerous demon-filled corridors deep underground.",
  waypoints:[[32369,32241,"Start at Thais depot"],[32367,32250,"Head south from depot"],[32365,32260,"Follow road south"],[32362,32272,"Continue past southern gate"],[32360,32285,"Navigate towards PoI entrance"],[32358,32295,"Approach entrance, go down stairs"],[32358,32295,"Underground: PoI upper level",8],[32356,32298,"Navigate demon corridors",8],[32354,32300,"Follow tunnels deeper",8],[32352,32302,"Reach stairway down"],[32352,32302,"Deep underground: Level -2",9],[32350,32304,"Continue through inferno",9],[32348,32306,"Claustrophobic Inferno area",9],[32346,32308,"Main hunting room",9]],
  access:"Pits of Inferno Quest required + additional access.",
  premium:true,
  creatures:[
    {name:"Hellfire Fighter",hp:8800,xp:7500,charm:"freeze",charmPts:50},
    {name:"Magma Crawler",hp:7200,xp:6200,charm:"freeze",charmPts:50},
    {name:"Demon",hp:8200,xp:6000,charm:"freeze",charmPts:50}
  ],
  imbuements:["2x Vampirism","2x Void","1x Bash/Chop/Slash"],
  supplies:{
    knight:["600 Ultimate Health Potion","300 Strong Mana Potion","100 Ultimate Spirit Potion"],
    paladin:["500 Great Spirit Potion","600 Spectral Bolt"],
    sorcerer:["1000 Strong Mana Potion","150 Sudden Death Rune"],
    druid:["1000 Strong Mana Potion","50 Wild Growth Rune"]
  },
  trinket:"Magma Amulet",
  drops:["Magma Boots","Demon Trophy","Fire Axe","Golden Armor","Magic Plate Armor"],
  tips:"Extreme fire damage everywhere — Magma Amulet absolutely essential. All creatures weak to Ice — Freeze charm on everything. Very fast respawn. One of the best XP spots for 300+ teams.",
  gear:{"250-300":"Falcon Coif, Falcon Plate, Fabulous Legs, Dreamwalkers","300+"   :"Soulmantle, Soulstrider, Soulbastion, Dreamwalkers"}
}
];

// ================================================================
// EQUIPMENT DATA (with wiki image names)
// ================================================================
const EQUIPMENT = {
knight:{
"8-30":{helmet:{name:"Soldier Helmet",img:"Soldier_Helmet",stats:"Arm: 5",source:"Dwarf Guards, Orc Leaders"},armor:{name:"Plate Armor",img:"Plate_Armor",stats:"Arm: 12",source:"Cyclops, Orc Leaders"},legs:{name:"Plate Legs",img:"Plate_Legs",stats:"Arm: 7",source:"Dragon, Elf Arcanist"},boots:{name:"Leather Boots",img:"Leather_Boots",stats:"Arm: 1",source:"Various creatures"},shield:{name:"Dwarven Shield",img:"Dwarven_Shield",stats:"Def: 26",source:"Dwarf Guard"},weapon:{name:"Bright Sword",img:"Bright_Sword",stats:"Atk: 36, Def: 30",source:"Orc Leaders"},ring:{name:"Life Ring",img:"Life_Ring",stats:"+1 HP/turn",source:"NPC or loot"},amulet:{name:"Protection Amulet",img:"Protection_Amulet",stats:"Physical prot 6%",source:"NPC (100gp)"}},
"30-60":{helmet:{name:"Royal Helmet",img:"Royal_Helmet",stats:"Arm: 9",source:"Behemoths, Quests"},armor:{name:"Blue Robe",img:"Blue_Robe",stats:"Arm: 11, Magic +1",source:"Dragon Lords"},legs:{name:"Crown Legs",img:"Crown_Legs",stats:"Arm: 9",source:"Quests, Dragon Lords"},boots:{name:"Boots of Haste",img:"Boots_of_Haste",stats:"Speed +20",source:"Dragon Lords"},shield:{name:"Demon Shield",img:"Demon_Shield",stats:"Def: 35",source:"Demons"},weapon:{name:"Relic Sword",img:"Relic_Sword",stats:"Atk: 39, Def: 24",source:"Inquisition Quest"},ring:{name:"Life Ring",img:"Life_Ring",stats:"+1 HP/turn",source:"NPC"},amulet:{name:"Platinum Amulet",img:"Platinum_Amulet",stats:"Physical prot 4%",source:"NPC (2000gp)"}},
"60-100":{helmet:{name:"Royal Helmet",img:"Royal_Helmet",stats:"Arm: 9",source:"Behemoths"},armor:{name:"Magic Plate Armor",img:"Magic_Plate_Armor",stats:"Arm: 17",source:"Dragon Lords, Behemoths"},legs:{name:"Golden Legs",img:"Golden_Legs",stats:"Arm: 9",source:"Annihilator Quest"},boots:{name:"Boots of Haste",img:"Boots_of_Haste",stats:"Speed +20",source:"Dragon Lords"},shield:{name:"Blessed Shield",img:"Blessed_Shield",stats:"Def: 40",source:"Inquisition Quest"},weapon:{name:"Magic Longsword",img:"Magic_Longsword",stats:"Atk: 56, Def: 37",source:"Behemoths, Hydras"},ring:{name:"Ring of Healing",img:"Ring_of_Healing",stats:"+2 HP/turn",source:"NPC"},amulet:{name:"Amulet of Loss",img:"Amulet_of_Loss",stats:"No death penalty",source:"NPC"}},
"100-150":{helmet:{name:"Zaoan Helmet",img:"Zaoan_Helmet",stats:"Arm: 9, Sword +1",source:"Lizard City Zao"},armor:{name:"Prismatic Armor",img:"Prismatic_Armor",stats:"Arm: 16, Phys prot 5%",source:"Market"},legs:{name:"Zaoan Legs",img:"Zaoan_Legs",stats:"Arm: 9",source:"Lizard City Zao"},boots:{name:"Guardian Boots",img:"Guardian_Boots",stats:"Arm: 3, Speed +4",source:"Market"},shield:{name:"Ornate Shield",img:"Ornate_Shield",stats:"Def: 38",source:"Market"},weapon:{name:"Shiny Blade",img:"Shiny_Blade",stats:"Atk: 52, Sword +1",source:"Roshamuul"},ring:{name:"Prismatic Ring",img:"Prismatic_Ring",stats:"Phys prot 5%",source:"Market"},amulet:{name:"Foxtail Amulet",img:"Foxtail_Amulet",stats:"+4 Speed",source:"Were creatures"}},
"150-200":{helmet:{name:"Cobra Hood",img:"Cobra_Hood",stats:"Arm: 10, ML +1, Sword +2",source:"Cobra Bastion"},armor:{name:"Prismatic Armor",img:"Prismatic_Armor",stats:"Arm: 16, Phys prot 5%",source:"Market"},legs:{name:"Ornate Legs",img:"Ornate_Legs",stats:"Arm: 10",source:"Oramond Minos"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Arm: 3, Speed +10",source:"Dream Courts"},shield:{name:"Ornate Shield",img:"Ornate_Shield",stats:"Def: 38",source:"Market"},weapon:{name:"Blade of Destruction",img:"Blade_of_Destruction",stats:"Atk: 54, Sword +3",source:"Ferumbras Ascension"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Foxtail Amulet",img:"Foxtail_Amulet",stats:"+4 Speed",source:"Were creatures"}},
"200-300":{helmet:{name:"Falcon Coif",img:"Falcon_Coif",stats:"Arm: 11, Shielding +3",source:"Falcon Bastion"},armor:{name:"Falcon Plate",img:"Falcon_Plate",stats:"Arm: 17, Sword +3",source:"Falcon Bastion"},legs:{name:"Fabulous Legs",img:"Fabulous_Legs",stats:"Arm: 10, Speed +12",source:"Secret Library"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Arm: 3, Speed +10",source:"Dream Courts"},shield:{name:"Falcon Shield",img:"Falcon_Shield",stats:"Def: 41, Shielding +3",source:"Falcon Bastion"},weapon:{name:"Falcon Longsword",img:"Falcon_Longsword",stats:"Atk: 56, Sword +4",source:"Falcon Bastion"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}},
"300+":{helmet:{name:"Falcon Coif",img:"Falcon_Coif",stats:"Arm: 11, Shielding +3",source:"Falcon Bastion"},armor:{name:"Soulmantle",img:"Soulmantle",stats:"Arm: 18, Sword +4",source:"Soul War Quest"},legs:{name:"Soulstrider",img:"Soulstrider",stats:"Arm: 11, Speed +15",source:"Soul War Quest"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Arm: 3, Speed +10",source:"Dream Courts"},shield:{name:"Soulbastion",img:"Soulbastion",stats:"Def: 42, Shielding +4",source:"Soul War Quest"},weapon:{name:"Soulcutter",img:"Soulcutter",stats:"Atk: 55, Sword +4",source:"Soul War Quest"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}}
},
paladin:{
"8-30":{helmet:{name:"Soldier Helmet",img:"Soldier_Helmet",stats:"Arm: 5",source:"Dwarf Guards"},armor:{name:"Scale Armor",img:"Scale_Armor",stats:"Arm: 9",source:"Various"},legs:{name:"Plate Legs",img:"Plate_Legs",stats:"Arm: 7",source:"Various"},boots:{name:"Leather Boots",img:"Leather_Boots",stats:"Arm: 1",source:"Various"},shield:{name:"Dwarven Shield",img:"Dwarven_Shield",stats:"Def: 26",source:"Dwarf Guard"},weapon:{name:"Elvish Bow",img:"Elvish_Bow",stats:"Range: 6",source:"Elf Arcanist"},ring:{name:"Life Ring",img:"Life_Ring",stats:"+1 HP/turn",source:"NPC"},amulet:{name:"Protection Amulet",img:"Protection_Amulet",stats:"Phys prot 6%",source:"NPC"}},
"30-60":{helmet:{name:"Royal Helmet",img:"Royal_Helmet",stats:"Arm: 9",source:"Behemoths"},armor:{name:"Paladin Armor",img:"Paladin_Armor",stats:"Arm: 12, Dist +2",source:"Quest"},legs:{name:"Crown Legs",img:"Crown_Legs",stats:"Arm: 9",source:"Quest"},boots:{name:"Boots of Haste",img:"Boots_of_Haste",stats:"Speed +20",source:"Dragon Lords"},shield:{name:"Demon Shield",img:"Demon_Shield",stats:"Def: 35",source:"Demons"},weapon:{name:"Arbalest",img:"Arbalest",stats:"Range: 6, Atk: 49",source:"Market"},ring:{name:"Life Ring",img:"Life_Ring",stats:"+1 HP/turn",source:"NPC"},amulet:{name:"Platinum Amulet",img:"Platinum_Amulet",stats:"Phys prot 4%",source:"NPC"}},
"60-100":{helmet:{name:"Royal Helmet",img:"Royal_Helmet",stats:"Arm: 9",source:"Behemoths"},armor:{name:"Paladin Armor",img:"Paladin_Armor",stats:"Arm: 12, Dist +2",source:"Quest"},legs:{name:"Golden Legs",img:"Golden_Legs",stats:"Arm: 9",source:"Annihilator"},boots:{name:"Boots of Haste",img:"Boots_of_Haste",stats:"Speed +20",source:"Dragon Lords"},shield:{name:"Blessed Shield",img:"Blessed_Shield",stats:"Def: 40",source:"Inquisition"},weapon:{name:"Mycological Bow",img:"Mycological_Bow",stats:"Range: 6, Atk: 52",source:"Market"},ring:{name:"Ring of Healing",img:"Ring_of_Healing",stats:"+2 HP/turn",source:"NPC"},amulet:{name:"Amulet of Loss",img:"Amulet_of_Loss",stats:"No death penalty",source:"NPC"}},
"100-150":{helmet:{name:"Zaoan Helmet",img:"Zaoan_Helmet",stats:"Arm: 9, Dist +2",source:"Lizard City"},armor:{name:"Prismatic Armor",img:"Prismatic_Armor",stats:"Arm: 16, Phys 5%",source:"Market"},legs:{name:"Zaoan Legs",img:"Zaoan_Legs",stats:"Arm: 9",source:"Lizard City"},boots:{name:"Guardian Boots",img:"Guardian_Boots",stats:"Arm: 3, Speed +4",source:"Market"},shield:{name:"Ornate Shield",img:"Ornate_Shield",stats:"Def: 38",source:"Market"},weapon:{name:"Rift Bow",img:"Rift_Bow",stats:"Atk: 54, Dist +2",source:"Roshamuul"},ring:{name:"Prismatic Ring",img:"Prismatic_Ring",stats:"Phys prot 5%",source:"Market"},amulet:{name:"Foxtail Amulet",img:"Foxtail_Amulet",stats:"+4 Speed",source:"Were creatures"}},
"150-200":{helmet:{name:"Cobra Hood",img:"Cobra_Hood",stats:"Arm: 10, Dist +2",source:"Cobra Bastion"},armor:{name:"Prismatic Armor",img:"Prismatic_Armor",stats:"Arm: 16",source:"Market"},legs:{name:"Ornate Legs",img:"Ornate_Legs",stats:"Arm: 10",source:"Oramond"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Speed +10",source:"Dream Courts"},shield:{name:"Ornate Shield",img:"Ornate_Shield",stats:"Def: 38",source:"Market"},weapon:{name:"Bow of Destruction",img:"Bow_of_Destruction",stats:"Atk: 56, Dist +3",source:"Ferumbras"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}},
"200-300":{helmet:{name:"Falcon Coif",img:"Falcon_Coif",stats:"Arm: 11, Dist +3",source:"Falcon Bastion"},armor:{name:"Falcon Plate",img:"Falcon_Plate",stats:"Arm: 17, Dist +3",source:"Falcon Bastion"},legs:{name:"Fabulous Legs",img:"Fabulous_Legs",stats:"Arm: 10, Speed +12",source:"Secret Library"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Speed +10",source:"Dream Courts"},shield:{name:"Falcon Shield",img:"Falcon_Shield",stats:"Def: 41",source:"Falcon Bastion"},weapon:{name:"Falcon Bow",img:"Falcon_Bow",stats:"Atk: 57, Dist +4",source:"Falcon Bastion"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}},
"300+":{helmet:{name:"Falcon Coif",img:"Falcon_Coif",stats:"Arm: 11, Dist +3",source:"Falcon Bastion"},armor:{name:"Soulmantle",img:"Soulmantle",stats:"Arm: 18, Dist +4",source:"Soul War"},legs:{name:"Soulstrider",img:"Soulstrider",stats:"Arm: 11, Speed +15",source:"Soul War"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Speed +10",source:"Dream Courts"},shield:{name:"Soulbastion",img:"Soulbastion",stats:"Def: 42",source:"Soul War"},weapon:{name:"Soulpiercer",img:"Soulpiercer",stats:"Atk: 58, Dist +4",source:"Soul War"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}}
},
sorcerer:{
"8-30":{helmet:{name:"Magician's Hat",img:"Magician's_Hat",stats:"Arm: 2, ML +1",source:"NPC"},armor:{name:"Blue Robe",img:"Blue_Robe",stats:"Arm: 11, ML +1",source:"Dragon Lords"},legs:{name:"Plate Legs",img:"Plate_Legs",stats:"Arm: 7",source:"Various"},boots:{name:"Sandals",img:"Sandals",stats:"Arm: 1",source:"NPC"},shield:{name:"Spellbook of Mind Control",img:"Spellbook_of_Mind_Control",stats:"ML +1",source:"NPC"},weapon:{name:"Wand of Dragonbreath",img:"Wand_of_Dragonbreath",stats:"Fire: 13",source:"NPC"},ring:{name:"Life Ring",img:"Life_Ring",stats:"+1 HP/turn",source:"NPC"},amulet:{name:"Protection Amulet",img:"Protection_Amulet",stats:"Phys prot 6%",source:"NPC"}},
"30-60":{helmet:{name:"Magician's Hat",img:"Magician's_Hat",stats:"Arm: 2, ML +1",source:"NPC"},armor:{name:"Blue Robe",img:"Blue_Robe",stats:"Arm: 11, ML +1",source:"Dragon Lords"},legs:{name:"Crown Legs",img:"Crown_Legs",stats:"Arm: 9",source:"Quest"},boots:{name:"Boots of Haste",img:"Boots_of_Haste",stats:"Speed +20",source:"Dragon Lords"},shield:{name:"Spellbook of Warding",img:"Spellbook_of_Warding",stats:"ML +2",source:"Market"},weapon:{name:"Wand of Inferno",img:"Wand_of_Inferno",stats:"Fire: 56",source:"NPC"},ring:{name:"Energy Ring",img:"Energy_Ring",stats:"Mana Shield",source:"NPC"},amulet:{name:"Platinum Amulet",img:"Platinum_Amulet",stats:"Phys prot 4%",source:"NPC"}},
"60-100":{helmet:{name:"Yalahari Mask",img:"Yalahari_Mask",stats:"Arm: 5, ML +2",source:"Yalahar Quest"},armor:{name:"Blue Robe",img:"Blue_Robe",stats:"Arm: 11, ML +1",source:"Dragon Lords, Market"},legs:{name:"Golden Legs",img:"Golden_Legs",stats:"Arm: 9",source:"Annihilator"},boots:{name:"Boots of Haste",img:"Boots_of_Haste",stats:"Speed +20",source:"Dragon Lords"},shield:{name:"Spellbook of Dark Mysteries",img:"Spellbook_of_Dark_Mysteries",stats:"ML +3",source:"Market"},weapon:{name:"Wand of Defiance",img:"Wand_of_Defiance",stats:"Energy: 85",source:"NPC"},ring:{name:"Ring of Healing",img:"Ring_of_Healing",stats:"+2 HP/turn",source:"NPC"},amulet:{name:"Amulet of Loss",img:"Amulet_of_Loss",stats:"No death penalty",source:"NPC"}},
"100-150":{helmet:{name:"Yalahari Mask",img:"Yalahari_Mask",stats:"Arm: 5, ML +2",source:"Yalahar Quest"},armor:{name:"Gill Coat",img:"Gill_Coat",stats:"Arm: 15, ML +2",source:"Market"},legs:{name:"Zaoan Legs",img:"Zaoan_Legs",stats:"Arm: 9",source:"Lizard City"},boots:{name:"Pair of Soft Boots",img:"Pair_of_Soft_Boots",stats:"+HP/MP regen",source:"Market"},shield:{name:"Spellbook of Dark Mysteries",img:"Spellbook_of_Dark_Mysteries",stats:"ML +3",source:"Market"},weapon:{name:"Wand of Everblazing",img:"Wand_of_Everblazing",stats:"Fire: 86",source:"Roshamuul"},ring:{name:"Prismatic Ring",img:"Prismatic_Ring",stats:"Phys prot 5%",source:"Market"},amulet:{name:"Foxtail Amulet",img:"Foxtail_Amulet",stats:"+4 Speed",source:"Were creatures"}},
"150-200":{helmet:{name:"Cobra Hood",img:"Cobra_Hood",stats:"Arm: 10, ML +2",source:"Cobra Bastion"},armor:{name:"Gill Coat",img:"Gill_Coat",stats:"Arm: 15, ML +2",source:"Market"},legs:{name:"Ornate Legs",img:"Ornate_Legs",stats:"Arm: 10",source:"Oramond"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Speed +10",source:"Dream Courts"},shield:{name:"Spellbook of Dark Mysteries",img:"Spellbook_of_Dark_Mysteries",stats:"ML +3",source:"Market"},weapon:{name:"Wand of Destruction",img:"Wand_of_Destruction",stats:"Fire: 90",source:"Ferumbras"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}},
"200-300":{helmet:{name:"Falcon Coif",img:"Falcon_Coif",stats:"Arm: 11, ML +3",source:"Falcon Bastion"},armor:{name:"Falcon Plate",img:"Falcon_Plate",stats:"Arm: 17, ML +3",source:"Falcon Bastion"},legs:{name:"Fabulous Legs",img:"Fabulous_Legs",stats:"Arm: 10, Speed +12",source:"Secret Library"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Speed +10",source:"Dream Courts"},shield:{name:"Falcon Escutcheon",img:"Falcon_Escutcheon",stats:"ML +3",source:"Falcon Bastion"},weapon:{name:"Falcon Wand",img:"Falcon_Wand",stats:"Fire: 92, ML +3",source:"Falcon Bastion"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}},
"300+":{helmet:{name:"Falcon Coif",img:"Falcon_Coif",stats:"Arm: 11, ML +3",source:"Falcon Bastion"},armor:{name:"Soulmantle",img:"Soulmantle",stats:"Arm: 18, ML +4",source:"Soul War"},legs:{name:"Soulstrider",img:"Soulstrider",stats:"Arm: 11, Speed +15",source:"Soul War"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Speed +10",source:"Dream Courts"},shield:{name:"Soulbastion",img:"Soulbastion",stats:"ML +4",source:"Soul War"},weapon:{name:"Soultainter",img:"Soultainter",stats:"Fire: 94, ML +4",source:"Soul War"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}}
},
druid:{
"8-30":{helmet:{name:"Magician's Hat",img:"Magician's_Hat",stats:"Arm: 2, ML +1",source:"NPC"},armor:{name:"Blue Robe",img:"Blue_Robe",stats:"Arm: 11, ML +1",source:"Dragon Lords"},legs:{name:"Plate Legs",img:"Plate_Legs",stats:"Arm: 7",source:"Various"},boots:{name:"Sandals",img:"Sandals",stats:"Arm: 1",source:"NPC"},shield:{name:"Spellbook of Mind Control",img:"Spellbook_of_Mind_Control",stats:"ML +1",source:"NPC"},weapon:{name:"Snakebite Rod",img:"Snakebite_Rod",stats:"Earth: 13",source:"NPC"},ring:{name:"Life Ring",img:"Life_Ring",stats:"+1 HP/turn",source:"NPC"},amulet:{name:"Protection Amulet",img:"Protection_Amulet",stats:"Phys prot 6%",source:"NPC"}},
"30-60":{helmet:{name:"Magician's Hat",img:"Magician's_Hat",stats:"Arm: 2, ML +1",source:"NPC"},armor:{name:"Blue Robe",img:"Blue_Robe",stats:"Arm: 11, ML +1",source:"Dragon Lords"},legs:{name:"Crown Legs",img:"Crown_Legs",stats:"Arm: 9",source:"Quest"},boots:{name:"Boots of Haste",img:"Boots_of_Haste",stats:"Speed +20",source:"Dragon Lords"},shield:{name:"Spellbook of Warding",img:"Spellbook_of_Warding",stats:"ML +2",source:"Market"},weapon:{name:"Underworld Rod",img:"Underworld_Rod",stats:"Death: 56",source:"NPC"},ring:{name:"Energy Ring",img:"Energy_Ring",stats:"Mana Shield",source:"NPC"},amulet:{name:"Platinum Amulet",img:"Platinum_Amulet",stats:"Phys prot 4%",source:"NPC"}},
"60-100":{helmet:{name:"Yalahari Mask",img:"Yalahari_Mask",stats:"Arm: 5, ML +2",source:"Yalahar Quest"},armor:{name:"Blue Robe",img:"Blue_Robe",stats:"Arm: 11, ML +1",source:"Dragon Lords, Market"},legs:{name:"Golden Legs",img:"Golden_Legs",stats:"Arm: 9",source:"Annihilator"},boots:{name:"Boots of Haste",img:"Boots_of_Haste",stats:"Speed +20",source:"Dragon Lords"},shield:{name:"Spellbook of Dark Mysteries",img:"Spellbook_of_Dark_Mysteries",stats:"ML +3",source:"Market"},weapon:{name:"Springsprout Rod",img:"Springsprout_Rod",stats:"Earth: 56",source:"NPC"},ring:{name:"Ring of Healing",img:"Ring_of_Healing",stats:"+2 HP/turn",source:"NPC"},amulet:{name:"Amulet of Loss",img:"Amulet_of_Loss",stats:"No death penalty",source:"NPC"}},
"100-150":{helmet:{name:"Yalahari Mask",img:"Yalahari_Mask",stats:"Arm: 5, ML +2",source:"Yalahar Quest"},armor:{name:"Gill Coat",img:"Gill_Coat",stats:"Arm: 15, ML +2",source:"Market"},legs:{name:"Zaoan Legs",img:"Zaoan_Legs",stats:"Arm: 9",source:"Lizard City"},boots:{name:"Pair of Soft Boots",img:"Pair_of_Soft_Boots",stats:"+HP/MP regen",source:"Market"},shield:{name:"Spellbook of Dark Mysteries",img:"Spellbook_of_Dark_Mysteries",stats:"ML +3",source:"Market"},weapon:{name:"Rod of Destruction",img:"Rod_of_Destruction",stats:"Ice: 90",source:"Ferumbras"},ring:{name:"Prismatic Ring",img:"Prismatic_Ring",stats:"Phys prot 5%",source:"Market"},amulet:{name:"Foxtail Amulet",img:"Foxtail_Amulet",stats:"+4 Speed",source:"Were creatures"}},
"150-200":{helmet:{name:"Cobra Hood",img:"Cobra_Hood",stats:"Arm: 10, ML +2",source:"Cobra Bastion"},armor:{name:"Gill Coat",img:"Gill_Coat",stats:"Arm: 15, ML +2",source:"Market"},legs:{name:"Ornate Legs",img:"Ornate_Legs",stats:"Arm: 10",source:"Oramond"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Speed +10",source:"Dream Courts"},shield:{name:"Spellbook of Dark Mysteries",img:"Spellbook_of_Dark_Mysteries",stats:"ML +3",source:"Market"},weapon:{name:"Rod of Destruction",img:"Rod_of_Destruction",stats:"Ice: 90",source:"Ferumbras"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}},
"200-300":{helmet:{name:"Falcon Coif",img:"Falcon_Coif",stats:"Arm: 11, ML +3",source:"Falcon Bastion"},armor:{name:"Falcon Plate",img:"Falcon_Plate",stats:"Arm: 17, ML +3",source:"Falcon Bastion"},legs:{name:"Fabulous Legs",img:"Fabulous_Legs",stats:"Arm: 10, Speed +12",source:"Secret Library"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Speed +10",source:"Dream Courts"},shield:{name:"Falcon Escutcheon",img:"Falcon_Escutcheon",stats:"ML +3",source:"Falcon Bastion"},weapon:{name:"Falcon Rod",img:"Falcon_Rod",stats:"Ice: 92, ML +3",source:"Falcon Bastion"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}},
"300+":{helmet:{name:"Falcon Coif",img:"Falcon_Coif",stats:"Arm: 11, ML +3",source:"Falcon Bastion"},armor:{name:"Soulmantle",img:"Soulmantle",stats:"Arm: 18, ML +4",source:"Soul War"},legs:{name:"Soulstrider",img:"Soulstrider",stats:"Arm: 11, Speed +15",source:"Soul War"},boots:{name:"Pair of Dreamwalkers",img:"Pair_of_Dreamwalkers",stats:"Speed +10",source:"Dream Courts"},shield:{name:"Soulbastion",img:"Soulbastion",stats:"ML +4",source:"Soul War"},weapon:{name:"Soultainter",img:"Soultainter",stats:"Ice: 94, ML +4",source:"Soul War"},ring:{name:"Ring of Blue Plasma",img:"Ring_of_Blue_Plasma",stats:"+2 ML",source:"Gnomprona"},amulet:{name:"Enchanted Theurgic Amulet",img:"Enchanted_Theurgic_Amulet",stats:"Phys 2%, ML +2",source:"Forgotten Knowledge"}}
}
};

// ================================================================
// QUESTS DATA
// ================================================================
const QUESTS = [
{name:"The Desert Dungeon Quest",level:0,premium:false,location:"Ankrahmun",npc:"—",desc:"Explore the crypt systems beneath Ankrahmun's desert sands. Multiple treasure rooms with decent loot for free account players.",requirements:["Rope","Shovel"],steps:["Travel to Ankrahmun, head east into the desert.","Find the hole in the sand, use shovel to dig down.","Navigate underground tunnels heading south.","Use rope to cross gaps and reach treasure rooms.","Open chests to collect rewards."],rewards:["Silver Brooch","Green Gem","150 gold"],dangers:["Skeleton","Ghoul","Mummy"],tips:"Bring health potions. Watch for poison fields."},
{name:"The Paradox Tower Quest",level:30,premium:true,location:"Edron",npc:"Spectulus",desc:"Climb the Paradox Tower by solving riddles from the Mad Mage. Each floor has a unique puzzle. One of Tibia's most iconic quests.",requirements:["200 gold","Rope","Level 30+"],steps:["Find the Paradox Tower northeast of Edron depot.","Enter and talk to the first NPC.","Answer the riddle correctly (relates to Tibia lore).","Second floor: solve the mathematical puzzle.","Third floor: use convince creature rune on the specific creature.","Fourth floor: navigate the maze (N, E, S, W, N).","Top floor: claim reward from chest."],rewards:["Wand of Cosmic Energy","3,000 exp"],dangers:["None (puzzle-based)"],tips:"Write down riddle answers. Each floor requires a different approach."},
{name:"The Djinn War Quest",level:40,premium:true,location:"Ankrahmun / Drefia",npc:"Fa'hradin / Malor",desc:"Choose between Marid (Blue Djinn) and Efreet (Green Djinn) factions. PERMANENT choice that unlocks the best NPC trade prices.",requirements:["Blue/Green Piece of Cloth","10,000 gold"],steps:["Travel to Ankrahmun, decide your faction.","Blue: Go to Blue Djinn Fortress south of Ab'Dendriel.","Green: Go to Green Djinn Tower near Drefia.","Complete 3 faction missions — retrieve artifacts, deliver messages, kill bosses.","Talk to faction leader for permanent NPC access."],rewards:["Blue/Green Djinn NPC trade access","Best prices for rare items"],dangers:["Efreet","Marid","Djinns"],tips:"PERMANENT choice! Blue Djinns buy creature products at best prices. Most players choose Blue."},
{name:"Pits of Inferno Quest",level:100,premium:true,location:"Edron / PoI",npc:"Hugo",desc:"Navigate 7 throne rooms representing deadly sins. Requires a full team of 4+ experienced players. One of Tibia's hardest classic quests.",requirements:["Blessed Wooden Stake","Holy Water","Level 100+","Full team (EK+ED+MS+RP)"],steps:["Form team of 4+ experienced players.","Enter through Edron's Hero Cave, go deeper.","Navigate initial tunnels to 7 throne rooms.","Throne 1 (Greed): Fight demons, collect Gem.","Throne 2-6: Each has unique mechanics — creatures, puzzles, mazes.","Throne 7 (Pride): Defeat final guardians.","Use all 7 gems to access reward room.","Choose ONE reward item."],rewards:["Arbalest","Soft Boots","Backpack of Holding","Stuffed Dragon"],dangers:["Demons","Juggernauts","Hellhounds","Destroyers"],tips:"Knight should be 120+ for comfortable blocking. Bring massive supplies."},
{name:"The Inquisition Quest",level:100,premium:true,location:"Multiple cities",npc:"Henricus",desc:"Join the Inquisition to fight evil. Massive questline with increasingly difficult bosses across multiple cities.",requirements:["Level 100+","Team of 5+"],steps:["Talk to Henricus in Thais temple.","Complete 4 investigation missions across cities.","Mission 5: Boss — Ushuriel (bring Energy protection).","Mission 6: Boss — Zugurosh (bring Fire protection).","Mission 7: Boss — Madareth (bring Earth protection).","Mission 8: Boss — Annihilon (bring full team).","Talk to Henricus for reward choice."],rewards:["Blessed Shield (Def 40)","Emerald Sword","Boss access"],dangers:["Ushuriel","Zugurosh","Madareth","Annihilon"],tips:"Each boss needs different elemental protection. Blessed Shield is best reward for knights."},
{name:"Wrath of the Emperor Quest",level:100,premium:true,location:"Zao",npc:"Emperor Kruzak",desc:"Infiltrate enemy lizard lines on Zao. Unlocks deep Zao content including Draken Walls hunting.",requirements:["Level 100+","New Frontier + Children of Revolution completed"],steps:["Talk to Emperor Kruzak in Zao's dragon stronghold.","Infiltrate the Lizard Chosen camp, steal documents.","Navigate muggy plains avoiding patrols.","Enter Dragon Palace, complete 3 internal missions.","Fight through Draken Walls to inner sanctum.","Defeat Lizard High Commander.","Return to Kruzak."],rewards:["Helmet of the Deep","Full Zao access","15,000 exp"],dangers:["Draken Spellweaver","Draken Elite","Lizard Chosen"],tips:"Fire protection for Draken Spellweavers. Unlocks top-tier hunting spots."},
{name:"In Service of Yalahar Quest",level:80,premium:true,location:"Yalahar",npc:"Palimuth",desc:"Explore and restore Yalahar's quarters. Multi-chapter quest with unique boss fights. Rewards the Yalahari Mask (ML +2).",requirements:["Level 80+","Rope","Shovel"],steps:["Arrive in Yalahar, talk to Palimuth.","Explore and fix Trade Quarter.","Clear Cemetery Quarter of undead.","Neutralize Alchemist Quarter mutations.","Resolve Foreign Quarter diplomacy.","Investigate Sunken Quarter (underwater).","Face Magician Quarter challenge.","Return to Palimuth for rewards."],rewards:["Yalahari Mask (ML +2)","Yalahari Leg Piece","Full Yalahar access"],dangers:["Mutated creatures","Vampires","Demons"],tips:"Yalahari Mask is best-in-slot for mages until 150+. Complete in order."},
{name:"The Annihilator Quest",level:100,premium:false,location:"Near Venore",npc:"—",desc:"THE classic 4-player quest. Face 6 Demons simultaneously in a tiny room. Perfect teamwork required.",requirements:["Exactly 4 players","Level 100+","Key 3600"],steps:["Form team of exactly 4 players (EK+ED+MS+RP ideal).","Travel to entrance southeast of Venore.","All 4 step on tiles simultaneously to open door.","Fight 6 Demons in a small room.","Knight blocks all 6, Druid heals with exura sio.","Sorcerer and Paladin deal damage.","Survive until all Demons dead.","Each player opens one of 4 reward chests."],rewards:["Demon Armor","Magic Plate Armor","Stonecutter Axe","Golden Legs"],dangers:["6 Demons simultaneously"],tips:"Knight MUST tank all 6. Druid spams exura sio. Pre-buff with utamo vita. Legendary quest."},
{name:"Forgotten Knowledge Quest",level:250,premium:true,location:"Multiple",npc:"Various",desc:"Fight powerful bosses to earn the Enchanted Theurgic Amulet — best-in-slot amulet for all vocations at high levels.",requirements:["Level 250+","Team of 10+","Multiple access quests"],steps:["Complete prerequisite quests for each boss location.","Boss 1: The Last Lore Keeper — ice protection.","Boss 2: Lloyd — energy protection.","Boss 3: The Sandking — earth protection.","Boss 4: Thorn Knight — physical protection.","Collect components from all bosses.","Combine to create Enchanted Theurgic Amulet."],rewards:["Enchanted Theurgic Amulet (Phys 2%, ML +2)"],dangers:["The Last Lore Keeper","Lloyd","The Sandking"],tips:"Best-in-slot amulet for ALL vocations at high levels. Worth the grind."},
{name:"Ferumbras' Ascension Quest",level:250,premium:true,location:"Edron",npc:"Mazarius",desc:"Stop Ferumbras from ascending. Hardest bosses in classic Tibia. Drops Destruction-tier weapons.",requirements:["Level 250+","Large team (20+)"],steps:["Talk to Mazarius in Edron.","Clear the Ascendant Tower entrance.","Complete 3 mini-boss rooms.","Fight through Hellflayers, Vexclaws, Grimeleeches.","Defeat Ferumbras Mortal Shell (main boss).","Access reward room, choose weapon."],rewards:["Blade/Bow/Wand/Rod of Destruction"],dangers:["Hellflayer","Vexclaw","Grimeleech","Ferumbras Mortal Shell"],tips:"Destruction weapons are best until Falcon/Soul tier. Massive supplies needed."},
{name:"Secret Library Quest",level:250,premium:true,location:"Multiple",npc:"Spectulus",desc:"Explore hidden library dimensions. Unlocks one of the best XP hunting areas in the game.",requirements:["Level 250+","Team for bosses"],steps:["Talk to Spectulus in Edron.","Complete access missions for each wing.","Clear Fire Wing (Burning Books, fire enemies).","Clear Ice Wing (Icecold Books, frost enemies).","Clear Energy Wing (Energized Raging Mages).","Defeat each wing boss.","Access final reward room."],rewards:["Fabulous Legs (Arm 10, Speed +12)","Library hunting access"],dangers:["Burning Book","Icecold Book","Energized Raging Mage"],tips:"Library = best XP/h for 300+. Fabulous Legs are excellent for all vocations."},
{name:"Soul War Quest",level:250,premium:true,location:"Feyrist / Zarganash",npc:"Spectulus",desc:"THE pinnacle of Tibia endgame. Enter the realm between life and death. Best-in-slot equipment for all vocations.",requirements:["Level 250+","Team of 30+","Many prerequisite quests"],steps:["Complete all prerequisite quests.","Enter Zarganash through Feyrist portal.","Navigate soul planes fighting powerful enemies.","Complete 5 tainting levels for boss access.","Boss 1: Goshnar's Cruelty — all protections.","Boss 2: Goshnar's Hatred — coordinate positions.","Boss 3: Goshnar's Malice — DPS race.","Boss 4: Goshnar's Spite — heal through AoE.","Boss 5: Goshnar's Megalomania — final boss, perfect teamwork.","Collect soul tokens, exchange for equipment."],rewards:["Soulmantle (Arm 18)","Soulstrider (Speed +15)","Soulbastion (Def 42)","Soulcutter/Soulpiercer/Soultainter"],dangers:["Goshnar's Cruelty","Goshnar's Megalomania"],tips:"Soul = best-in-slot for ALL vocations. Requires months of preparation and a dedicated team."},
{name:"Grave Danger Quest",level:250,premium:true,location:"Multiple",npc:"Investigator",desc:"Investigate undead lords. Unlocks Falcon equipment — second-best tier in game.",requirements:["Level 250+","Team of 15+"],steps:["Talk to Investigator to start questline.","Investigate 4 undead activity locations.","Fight through Falcon Knights and Paladins.","Defeat King Zelos and lieutenants.","Defeat Grand Master Oberon (final boss).","Collect Falcon equipment from drops."],rewards:["Falcon equipment access","Falcon Bastion hunting"],dangers:["Falcon Knight","Falcon Paladin","Grand Master Oberon"],tips:"Falcon equipment = second-best tier. Bastion is excellent hunting 300+."},
{name:"Killing in the Name of...",level:0,premium:true,location:"Port Hope",npc:"Grizzly Adams",desc:"Repeatable hunting task system. Hunt creatures for points and unlock rewards.",requirements:["Varies by task"],steps:["Talk to Grizzly Adams in Port Hope.","Choose creature task from available options.","Hunt required number (300-6000 creatures).","Return to turn in task.","Accumulate points for rewards and boss access."],rewards:["Task points","Outfit addons","Boss access"],dangers:["Varies"],tips:"Overlap tasks with normal hunting for efficiency."},
{name:"Oramond Quest",level:80,premium:true,location:"Rathleton",npc:"Jondrin",desc:"Unlock Oramond hunting grounds including the BEST PROFIT spot — Oramond Minos.",requirements:["Level 80+ (200+ for Minos)"],steps:["Sail to Rathleton, talk to Jondrin.","Complete tasks to earn reputation.","Unlock hunting ground access.","Complete 40 daily tasks for Mino access.","Optional: Unlock Glooth Bandit area."],rewards:["Oramond access","Mino hunting (BEST profit)"],dangers:["Glooth creatures","Minotaur Amazons"],tips:"40 daily tasks for Minos is 100% worth it. Best gold/hour in game at 200+."},
{name:"A Threatened Dream Quest",level:150,premium:true,location:"Feyrist",npc:"Fauns",desc:"Enter Feyrist dream realm. Unlocks beautiful hunting areas for 150-250 range.",requirements:["Level 150+"],steps:["Find Feyrist portal near Carlin/Ab'Dendriel.","Talk to Faun guardian.","Complete 3 purification rituals.","Fight corrupted Dream creatures.","Defeat Dream Court bosses."],rewards:["Feyrist access","Dream equipment"],dangers:["Boar Man","Dark Faun","Twisted Pooka"],tips:"Feyrist = best hunting for 150-250. Dream equipment is excellent."},
{name:"The Dream Courts Quest",level:200,premium:true,location:"Feyrist",npc:"Court NPCs",desc:"Challenge dream rulers for Pair of Dreamwalkers — best-in-slot boots.",requirements:["Level 200+","A Threatened Dream completed","Team of 10+"],steps:["Enter Dream Courts through Feyrist.","Complete Summer and Winter Court trials.","Defeat Dream Court bosses.","Challenge Maxxenius (ultimate dream boss).","Collect tokens for Dreamwalker boots."],rewards:["Pair of Dreamwalkers (Speed +10)"],dangers:["Court bosses","Maxxenius"],tips:"Dreamwalkers = best-in-slot boots at high levels."},
{name:"Cobra Bastion Quest",level:250,premium:true,location:"Issavi",npc:"Scarlett Etzel",desc:"Infiltrate the Cobra Bastion. Drops Cobra Hood — best helmet for mages.",requirements:["Level 250+","Team of 10+","Kilmaresh access"],steps:["Travel to Issavi.","Talk to Scarlett Etzel.","Navigate Cobra Bastion's 3 levels.","Defeat Cobra commanders.","Face final boss."],rewards:["Cobra Hood (Arm 10, ML +2)","Cobra equipment"],dangers:["Cobra Assassin","Cobra Scout","Cobra Vizier"],tips:"Cobra Hood = best helmet for mages 150-250."},
{name:"Roshamuul Quest",level:200,premium:true,location:"Roshamuul",npc:"A Bloodbeast",desc:"Access demon-infested prison island. Unlocks top-tier hunting for 250+.",requirements:["Level 200+"],steps:["Sail to Roshamuul.","Navigate dangerous terrain.","Complete access missions.","Clear first prison level.","Unlock Guzzlemaw Valley."],rewards:["Roshamuul access","Guzzlemaw Valley"],dangers:["Guzzlemaw","Frazzlemaw","Silencer"],tips:"Guzzlemaw Valley = top XP for 250+ teams."},
{name:"Adventurer's Guild Quest",level:0,premium:false,location:"Thais",npc:"Guild NPCs",desc:"Join the Adventurer's Guild for daily reward shrine access. Do this ASAP!",requirements:["None"],steps:["Find Adventurer's Guild in south Thais.","Talk to guild leader.","Complete simple initiation.","Use daily reward shrines worldwide."],rewards:["Daily reward shrine access"],dangers:["None"],tips:"Do this IMMEDIATELY on any new character. Daily rewards stack up."}
];
