# Adding a New Game

This guide explains how to add a new game to Succes Dex.

## Overview

Adding a new game requires 3 steps:

1. Create the achievements JSON file
2. Register the game in the games data
3. Add the game font (optional)

---

## Step 1: Create the Achievements JSON

Create a new file in `data/achievements/` named after your game slug (e.g., `hollow-knight.json`).

### JSON Structure

```json
{
  "gameId": "hollow-knight",
  "gameName": "Hollow Knight",
  "version": "1.0.0",
  "background": "/backgrounds/hollow-knight-bg.webp",
  "categories": [
    {
      "id": "story",
      "name": "Histoire",
      "icon": "scroll",
      "color": "#3B82F6"
    },
    {
      "id": "exploration",
      "name": "Exploration",
      "icon": "map",
      "color": "#22C55E"
    },
    {
      "id": "combat",
      "name": "Combat",
      "icon": "sword",
      "color": "#EF4444"
    }
  ],
  "achievements": [
    {
      "id": "hollow-knight-story-001",
      "title": "First Achievement",
      "description": "Description of what the player needs to do",
      "category": "story"
    },
    {
      "id": "hollow-knight-exploration-001",
      "title": "Explorer",
      "description": "Discover a hidden area",
      "category": "exploration"
    }
  ]
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gameId` | string | Yes | Unique identifier matching the slug |
| `gameName` | string | Yes | Display name of the game |
| `version` | string | Yes | Version of the achievement list |
| `background` | string | No | Path to background image in `/public/backgrounds/` |
| `categories` | array | Yes | List of category definitions |
| `achievements` | array | Yes | List of achievements |

### Category Definition

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique category identifier (lowercase, no spaces) |
| `name` | string | Display name for the category |
| `icon` | string | Icon identifier (for future use) |
| `color` | string | Hex color code for the category badge |

### Achievement Definition

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique achievement identifier |
| `title` | string | Achievement title |
| `description` | string | What the player needs to do |
| `category` | string | Must match a category `id` |

### Sorting Convention

Achievements should be sorted by:
1. Category (in the order defined in the categories array)
2. Title (alphabetically within each category)

---

## Step 2: Register the Game

Edit `data/games.ts` to add your game to the `GAMES` array.

### Update the Type

First, add your game slug to the `GameSlug` type in `types/game.ts`:

```typescript
export type GameSlug = 'pokemon' | 'breath-of-the-wild' | 'elden-ring' | 'hollow-knight';
```

### Add Game Metadata

Then add the game to `data/games.ts`:

```typescript
export const GAMES: GameMeta[] = [
  // ... existing games
  {
    slug: 'hollow-knight',
    name: 'Hollow Knight',
    fontFamily: 'var(--font-hollow-knight)', // or use a system font
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    backgroundImage: '/backgrounds/hollow-knight-bg.webp',
    themeColor: '#1a1a2e',
    achievementCount: 57, // Total number of achievements
  },
];
```

### GameMeta Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | GameSlug | URL-friendly identifier (lowercase, hyphens) |
| `name` | string | Display name |
| `fontFamily` | string | CSS font-family value |
| `gradient` | string | CSS gradient for card background fallback |
| `backgroundImage` | string | Path to background image (optional) |
| `themeColor` | string | Primary color for progress bar and accents |
| `achievementCount` | number | Total achievements (must match JSON) |

---

## Step 3: Add Custom Font (Optional)

If you want a custom font for the game title:

### 1. Add Font File

Place your font file in `public/fonts/`:
- `public/fonts/HollowKnight.ttf`

### 2. Load the Font

Edit `app/layout.tsx` to load the font:

```typescript
import localFont from 'next/font/local';

const hollowKnightFont = localFont({
  src: '../public/fonts/HollowKnight.ttf',
  variable: '--font-hollow-knight',
});

// In the RootLayout component, add the variable to the body className:
<body className={`${pokemonFont.variable} ${zeldaFont.variable} ${eldenFont.variable} ${hollowKnightFont.variable}`}>
```

---

## Step 4: Add Background Image (Optional)

Place a background image in `public/backgrounds/`:
- Recommended format: WebP
- Recommended size: 1920x1080 or similar aspect ratio
- File name should match the path in your JSON

---

## Verification Checklist

After adding a new game, verify:

- [ ] JSON file is valid (no syntax errors)
- [ ] All achievement `category` values match a defined category `id`
- [ ] `achievementCount` in games.ts matches the actual number of achievements
- [ ] Game slug in JSON matches the slug in games.ts
- [ ] Game appears on the home page
- [ ] Game page loads without errors
- [ ] Category filters work correctly
- [ ] Search finds achievements

---

## Example: Complete Flow

### 1. Create `data/achievements/dark-souls.json`

```json
{
  "gameId": "dark-souls",
  "gameName": "Dark Souls",
  "version": "1.0.0",
  "background": "/backgrounds/dark-souls-bg.webp",
  "categories": [
    { "id": "boss", "name": "Boss", "icon": "skull", "color": "#DC2626" },
    { "id": "covenant", "name": "Covenant", "icon": "shield", "color": "#7C3AED" },
    { "id": "collection", "name": "Collection", "icon": "treasure", "color": "#F59E0B" }
  ],
  "achievements": [
    { "id": "ds-boss-001", "title": "Asylum Demon", "description": "Defeat the Asylum Demon", "category": "boss" },
    { "id": "ds-boss-002", "title": "Bell Gargoyles", "description": "Defeat the Bell Gargoyles", "category": "boss" },
    { "id": "ds-covenant-001", "title": "Warrior of Sunlight", "description": "Join the Warriors of Sunlight", "category": "covenant" }
  ]
}
```

### 2. Update `types/game.ts`

```typescript
export type GameSlug = 'pokemon' | 'breath-of-the-wild' | 'elden-ring' | 'dark-souls';
```

### 3. Update `data/games.ts`

```typescript
{
  slug: 'dark-souls',
  name: 'Dark Souls',
  fontFamily: 'var(--font-elden)', // Reuse Elden Ring font or add custom
  gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%)',
  backgroundImage: '/backgrounds/dark-souls-bg.webp',
  themeColor: '#DC2626',
  achievementCount: 3,
},
```

### 4. Test

```bash
pnpm dev
# Visit http://localhost:3000/dark-souls
```
