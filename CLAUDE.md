# Grindare Studio - Notatki projektu

## O projekcie
Strona web agency oferująca tworzenie stron dla małych firm.
Wielojęzyczna: EN, PL, RO, ES, HI

## Ostatnie zmiany (Luty 2026)

### DeckVault CR - Nowe portfolio demo
Zastąpiło Serenity Spa. Interaktywna aplikacja webowa:
- Clash Royale deck builder
- 47 kart z emoji ikonami
- Filtrowanie po rzadkości (Common, Rare, Epic, Legendary, Champion)
- Wyszukiwarka kart
- Kalkulator średniego kosztu elixiru
- Featured meta decks
- Leaderboardy (Trophy, War)
- Ciemny gaming theme (purple/blue gradients)

**Grafiki** w `/portfolio/deck-vault/images/`:
- Logo: `ideogram-v3.0_DeckVault_gaming_logo...jpg`
- Hero background: `lucid-origin_Abstract_dark_gaming_arena...jpg`
- Card pattern: `lucid-origin_Playing_card_back...jpg`
- Arena floor: `lucid-origin_Top-down_view...jpg`

### TibiaPedia - Nowe portfolio demo
Interaktywna strona companion dla Tibia MMORPG:
- Bestiary z TibiaData API v4 (900+ stworzeń, lazy loading, cache)
- 55 hunting spotów z filtrami vocation/level
- Equipment planner (4 vocations × 7 level brackets × 8 slotów)
- Interaktywna mapa (Leaflet.js + floor-07 PNG z tibiamaps.github.io)
- 35 questów z wyszukiwarką i filtrami
- Dark medieval theme: Cinzel + Crimson Text, gold/amber akcenty
- Jeden plik index.html z embedded CSS + JS (wzorzec DeckVault)

**Grafiki** w `/portfolio/tibiapedia/images/`:
- Hero background: `lucid-origin_Dark_medieval_fantasy_dungeon...jpg`
- Logo: `ideogram-v3.0_TibiaPedia_medieval_fantasy_logo...jpg`

### ROI Kalkulator (naprawiony)
Problem: Kalkulator był nastawiony na firmy dachowe, nie pasował do kawiarni.
Rozwiązanie: Dynamiczna liczba klientów na podstawie wartości zlecenia:
```
≤50 PLN    → 300 klientów/mies (kawiarnia)
≤200 PLN   → 80 klientów/mies (salon)
≤500 PLN   → 30 klientów/mies
≤1500 PLN  → 10 klientów/mies
≤5000 PLN  → 4 klientów/mies
>5000 PLN  → 2 klientów/mies (premium)
```

### SEO
- Blog z artykułami
- Hreflang tagi dla wszystkich wersji językowych
- Sitemap
- Google Business Profile
- FreeIndex

## Struktura plików
```
/Users/void/grindarestudio/
├── index.html (EN)
├── services.html
├── pl/index.html
├── ro/index.html
├── es/index.html
├── hi/index.html
├── blog/
│   └── why-your-business-needs-professional-website-2026.html
├── portfolio/
│   ├── aurum-roofing/ (firma dachowa)
│   ├── ember-brew/ (kawiarnia)
│   ├── deck-vault/ (gaming app)
│   └── tibiapedia/ (Tibia MMORPG companion)
└── demo/
```

## Kontakt
- WhatsApp: +447392305505
- Email: patrykmajecki30@gmail.com
