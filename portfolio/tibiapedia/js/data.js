// ================================================================
// TibiaVault — Game Data
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
  {name:"Thais",cx:32369,cy:32238},{name:"Carlin",cx:32335,cy:31782},
  {name:"Venore",cx:32920,cy:32076},{name:"Ab'Dendriel",cx:32681,cy:31687},
  {name:"Kazordoon",cx:32656,cy:31911},{name:"Ankrahmun",cx:33126,cy:32843},
  {name:"Darashia",cx:33214,cy:32460},{name:"Edron",cx:33210,cy:31814},
  {name:"Port Hope",cx:32627,cy:32742},{name:"Liberty Bay",cx:32335,cy:32837},
  {name:"Svargrond",cx:32263,cy:31141},{name:"Yalahar",cx:32786,cy:31248},
  {name:"Rathleton",cx:33634,cy:31895},{name:"Roshamuul",cx:33513,cy:32362},
  {name:"Issavi",cx:33921,cy:31480},{name:"Feyrist",cx:33558,cy:32224},
  {name:"Rookgaard",cx:32097,cy:31895},{name:"Dawnport",cx:32070,cy:31932},
  {name:"Zao",cx:33203,cy:31421},{name:"Farmine",cx:33026,cy:31454}
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
  cx:33304,cy:31720,
  route:"From Edron take the boat NE to Stonehome island. The ferryman Cornell takes you to Grimvale. Enter the cave during full moon.",
  verified:true,
  waypoints:[[33173,31818,"Start at Edron depot"],[33196,31846,"Head south-east"],[33243,31825,"Follow road east"],[33249,31786,"Turn north towards coast"],[33281,31743,"Continue NE along shore"],[33305,31721,"Speak with NPC (Hi - Passage - Yes)"],[33342,31693,"Walk to Grimvale cave"],[33353,31671,"Go down into cave"],[33353,31671,"Underground: Grimvale",8]],
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
  waypoints:[],
  access:"Level 40+ required (Gate of Expertise). Otherwise free access.",
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
  waypoints:[],
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
  waypoints:[],
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
  huntModes:{team:[200,300],duo:[280,350],solo:[320,350]},
  prot:["physical","fire"],
  cx:33651,cy:31942,
  route:"From Rathleton depot head east through the city. Cross over the hill to reach the Oramond Eastern Plains. The Minotaur Camp is on the surface with 3 sub-areas: East Plains, North Plains, and Hills.",
  waypoints:[],
  access:"Oramond Quest — need 40 daily task completions (voting + tasks). Takes ~2 weeks!",
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
  cx:33659,cy:31958,
  route:"From Rathleton depot head to the Workshop Quarter. Find the building east of stairs to Upper Rathleton. Use the Slime Slide inside to enter the Underground Glooth Factory.",
  waypoints:[],
  access:"Rathleton Quest — need Citizen rank (300 votes cast) to use Slime Slide.",
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
  route:"From Port Hope depot head east through the Tiquanda jungle. Climb into the Kha'zeel mountains heading NE. The palace entrance is in the mountain pass — go down stairs into the underground palace.",
  waypoints:[],
  access:"None — free access. No quest required to enter.",
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
  waypoints:[],
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
  huntModes:{team:[130,200],duo:[180,250]},
  prot:["fire","energy"],
  cx:33350,cy:31700,
  route:"From Zao outpost navigate south through the steppe, past Zzaion. Cross the lava rivers south to the Draken fortress entrance.",
  waypoints:[],
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
  huntModes:{team:[200,350],duo:[300,400]},
  prot:["physical","death"],
  cx:33588,cy:32433,
  route:"From Roshamuul temple head south through dangerous terrain. Cross bridge to the prison entrance. Be careful of surface Guzzlemaws!",
  waypoints:[],
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
  huntModes:{team:[250,400],duo:[350,400]},
  prot:["physical","holy"],
  cx:33362,cy:31343,
  route:"Complex ritual access. North of Edron, go up ramp at Wyvern Mountain, cross bridge south, find chalk bed. Levitate UP facing south at SE corner. Go up stairs to Falcon Outpost. Pick up Page from chest. Perform ritual: pour Blood, then Water on symbol, use Chalk. Teleported to Falcon Bastion.",
  waypoints:[],
  access:"Grave Danger Quest / Secret Library Quest required (level 250+). Complex ritual access.",
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
  huntModes:{team:[250,400],duo:[350,400]},
  prot:["fire","ice","energy"],
  cx:32177,cy:31927,
  route:"Access through portals in north-western Tiquanda after completing the Secret Library Quest. Different wings accessible from different portal locations.",
  waypoints:[],
  access:"Secret Library Quest required (level 250+). Access via Isle of the Kings: use a Scythe on the Monument near the Altar. Teleported to library. Choose wing: Fire/Ice/Energy/Earth.",
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
  waypoints:[],
  access:"Grave Danger Quest required (level 250+). Need Kilmaresh access, Cheesy Figurine and Vial of Potent Holy Water.",
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
  cx:33584,cy:32207,
  route:"For Summer Court: use a gem on a Holy Shrine in any temple to teleport to Feyrist (Threatened Dreams Quest required first). Head NE to court area. For Winter Court: go to Svargrond → Tyrsung → climb mountain.",
  waypoints:[],
  access:"The Dream Courts Quest required (level 250+). Threatened Dreams Quest + multiple prerequisites. Use gem on Holy Shrine for Feyrist access.",
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
  name:"Pirats — The Wreckoning",
  prot:["physical"],
  city:"Issavi",level:[200,300],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"2kk-4kk",profitH:"300k-800k",
  cx:33900,cy:31420,
  waypoints:[],
  route:"From Issavi depot head north through Kilmaresh to The Wreckoning area. The Pirat spawn is on the surface north of Issavi.",
  access:"No specific quest. Level 150+ recommended.",
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
  city:"Yalahar",level:[250,400],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"6kk-12kk",profitH:"400k-1kk",
  cx:32962,cy:31497,
  route:"From Yalahar take the boat to Vengoth (NPC Harlow, Trade Quarter docks, 100gp). On Vengoth find the invisible teleport to Zarganash. Navigate through soul planes to reach the Lost Soul hunting areas.",
  waypoints:[],
  access:"Blood Brothers Quest (Vengoth access) + Feaster of Souls Quest (level 250+).",
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
  route:"First talk to NPC Zoltan in Edron — ask for 'permission' and pay 500gp. Then travel to Liberty Bay and take the boat to the Forbidden Islands / Kharos. The citadel has multiple tower floors (UP) and a basement (DOWN).",
  waypoints:[],
  access:"The Shattered Isles Quest required. Talk to Zoltan in Edron, pay 500gp for permission.",
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
  waypoints:[],
  route:"From Edron depot head north-west through the forest to Hero Cave entrance.",
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
  cx:32246,cy:32601,
  waypoints:[],
  route:"From Kazordoon depot head to the temple area. Find NPC Xelvar and use the northern teleporter nearby — it takes you directly into The Spike underground. No walking needed!",
  access:"Spike Tasks Quest — talk to Gnome NPCs. Level 25-49 only for Upper Spike!",
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
  city:"Rathleton",level:[60,100],voc:["knight","paladin","druid"],
  team:"solo",expH:"350k-600k",profitH:"40k-100k",
  cx:33580,cy:31584,
  waypoints:[],
  route:"From Rathleton head NW through Oramond towards Krailos steppe. The ogre camp is on the surface.",
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
  name:"Demon Forge",
  prot:["fire","death","energy"],
  city:"Edron",level:[200,350],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"3kk-5kk",profitH:"200k-500k",
  cx:33164,cy:31638,
  waypoints:[],
  route:"From Edron depot head north to Hero Cave. Navigate through the cave going deeper and deeper. Pass through the Temple of Xayepocax and the level 100 door to reach the Demon Forge on floor -7.",
  access:"The Inquisition Quest required (level 100+). Must complete Mission 6 and absorb a spirit from Pits of Inferno Quest.",
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
  city:"Yalahar",level:[300,999],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"10kk-20kk",profitH:"500k-2kk",
  cx:32962,cy:31497,
  waypoints:[],
  route:"From Yalahar go to Trade Quarter docks. Talk to NPC Harlow and pay 100gp for boat to Vengoth. On Vengoth island find the invisible teleport to Zarganash. Choose from 5 Fog Portals for different hunting areas.",
  access:"Blood Brothers Quest (Vengoth access) + Feaster of Souls Quest (level 250+). Soul War Quest for boss areas.",
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
  route:"From Thais depot head north to the Ancient Temple. Descend 6-7 levels deep through rotworm caves, poison fields, and cyclops areas. Mintwallin is a massive underground minotaur city at floor -6/-7. Bring rope, shovel, and Antidote Runes!",
  waypoints:[],
  access:"None — free access. Bring rope, shovel and Antidote Runes. Watch for one-way holes!",
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
  cx:32853,cy:31924,
  route:"From Venore depot head north-west past the swamps. Cross the bridge and continue to the Amazon camp on the hill.",
  waypoints:[],
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
  name:"Cyclops Camp — Thais",
  city:"Thais",level:[25,55],voc:["knight","paladin"],
  team:"solo",expH:"40k-120k",profitH:"15k-40k",
  prot:["physical"],
  cx:32352,cy:32391,
  route:"From Thais depot head south through the city gate. Cross Mt. Sternum and continue south to the Cyclops camp.",
  waypoints:[],
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
  cx:33072,cy:32760,
  route:"From Ankrahmun depot head west into the Kha'labal desert. Dig with a shovel to enter the Larva Caves underground.",
  waypoints:[],
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
  name:"Orc Fortress — Ulderek's Rock",
  city:"Venore",level:[30,60],voc:["knight","paladin"],
  team:"solo",expH:"40k-100k",profitH:"10k-30k",
  prot:["physical"],
  cx:32930,cy:31774,
  route:"From Venore depot head north towards Ab'Dendriel. The Orc Fortress (Ulderek's Rock) is east of Ferngrims Gate.",
  waypoints:[],
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
  cx:32845,cy:32871,
  route:"From Port Hope depot head south-east into the Tiquanda jungle to the Spider Caves.",
  waypoints:[],
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
  cx:33256,cy:32325,
  route:"From Darashia depot head north through the desert to the Wyrm Hills area. Werehyaenas spawn on the surface during night. For permanent spawn, enter the Hyaena Lairs underground (go down).",
  waypoints:[],
  access:"Grimvale Quest — An Ancient Feud. Surface spawn only during in-game night. Lairs permanent.",
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
  cx:32677,cy:31132,
  route:"From Yalahar depot go to the Alchemist Quarter in the NW part of the city.",
  waypoints:[],
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
  waypoints:[],
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
  cx:32246,cy:32601,
  route:"From Kazordoon depot head to the temple area. Use the teleporter near NPC Xelvar — it takes you directly into The Spike underground. No walking needed!",
  waypoints:[],
  access:"Spike Tasks Quest — talk to Gnome NPCs in Kazordoon. Level 50-99 for Mid Spike, 100+ for Lower.",
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
  waypoints:[],
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
  name:"Nightmare Isles — Darashia",
  city:"Darashia",level:[130,200],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"1kk-2kk",profitH:"100k-300k",
  prot:["death","physical"],
  cx:33037,cy:32404,
  route:"Mini World Change event — portals appear randomly near Drefia, Darashia coast, or Ankrahmun tar pits. Check TibiaBosses.com for active portal location. Portals only appear when the event is active!",
  waypoints:[],
  access:"Mini World Change event — portals only appear when active. No quest required. Level 250+ recommended.",
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
  cx:32760,cy:32628,
  route:"From Port Hope depot head north into the Tiquanda jungle. Carnivora's Rocks is underground north of the city.",
  waypoints:[],
  access:"No quest required. Level 250+ minimum (restriction since Feb 2019).",
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
  name:"Crazed Winter Elves — Court of Winter",
  city:"Svargrond",level:[200,300],voc:["knight","paladin","sorcerer","druid"],
  team:"solo",expH:"3kk-6kk",profitH:"300k-800k",
  prot:["ice","holy"],
  cx:32263,cy:31141,
  route:"From Svargrond travel to Tyrsung island. Climb UP the mountain to the top to find the Court of Winter portal. Enter the portal to reach the hunting area.",
  waypoints:[],
  access:"The Dream Courts Quest required (level 250+). Prerequisites: Threatened Dreams Quest, access to Tyrsung, Okolnir, Feyrist.",
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
  cx:33921,cy:31480,
  route:"From Issavi depot head east through the city to the sewers entrance. Navigate through the underground tunnel system.",
  waypoints:[],
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
  city:"Roshamuul",level:[250,350],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"6kk-12kk",profitH:"300k-800k",
  prot:["death","physical"],
  cx:33618,cy:32546,
  route:"Access through Grave Danger Quest portals. The Buried Cathedral is deep underground south of Roshamuul, beneath the sea.",
  waypoints:[],
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
  city:"Yalahar",level:[250,400],voc:["knight","paladin","sorcerer","druid"],
  team:"team",expH:"7kk-15kk",profitH:"200k-600k",
  prot:["fire","physical"],
  cx:32962,cy:31497,
  route:"Access via Soul War teleport hub in Zarganash. From Yalahar take boat to Vengoth (NPC Harlow), find invisible teleport to Zarganash. Talk to Flickering Soul NPC and enter the Claustrophobic Inferno Fog Portal.",
  waypoints:[],
  access:"Soul War Quest (level 250+). Requires: Blood Brothers Quest, Feaster of Souls Quest. Level 600+ recommended!",
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

// Backward-compatible migration: team → huntModes
HUNTING_SPOTS.forEach(s => {
  if (s.huntModes) return;
  s.huntModes = s.team === 'team' ? { team: true } : { solo: true };
});

// Helper: resolve huntMode range for a spot
function getHuntModeRange(spot, mode) {
  const val = spot.huntModes?.[mode];
  if (!val) return null;
  return val === true ? spot.level : val;
}

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
