# Trivia Cards — Product Requirements Document

## Overview

Trivia Cards is a web-based card game where players arrange cards in order based on a specific dimension (years, price, speed, height, weight, population, and 19 more). The game tests players' knowledge by having them place cards in the correct sequence. Incorrect placements result in losing a life, and the game tracks the player's best streak.

**Live**: https://avi-trivia.netlify.app

---

## Current Features (✅ Shipped)

### Card Format

Each card contains:
- **Value**: Numeric value for the dimension (hidden until placed)
- **Label**: Name of the subject (e.g., "Tesla Model 3", "Mount Everest")
- **Description**: Brief description of the subject
- **Property**: What the value represents (e.g., "born", "top speed", "costs")
- **Image**: Optional image (loaded from Wikimedia Commons)
- **Categories**: `instance_of` array for filtering

**Data Format**: Cards stored as NDJSON (newline-delimited JSON) in `public/items-{dimension}.json` files.

### Available Dimensions (25 total)

| Category | Dimensions |
|----------|------------|
| **Core** | Year, Price, Speed, Height, Weight, Population |
| **Science** | Lifespan, Distance, Temperature, Area, Depth, Calories |
| **Entertainment** | Duration, Box Office, Album Sales, Game Sales, Oscars, Spotify Streams |
| **Misc** | Net Worth, Followers, Stadium Capacity, Horsepower, Elevation, Year Founded, Prep Time |

Dimension metadata stored in `public/dimensions.json`.

### Gameplay Mechanics

- **Initial State**: Game starts with one card already placed
- **Card Placement**: Drag one card at a time from "next" area into the timeline
- **Ordering**: Cards must be in ascending order by value
- **Life System**: 3 lives, lose one on incorrect placement, game over at 0
- **Scoring**: Tracks current streak and best streak (persisted in localStorage)

### Smart Card Selection

- Random selection with filtering to avoid clustering
- Filters out "bad cards" (see `lib/bad-cards.ts`)
- Prevents answer leakage (value not shown in label/description)
- Preloads next cards for smooth gameplay

### User Interface

- Drag and drop via `react-beautiful-dnd`
- Card flip animations via `react-spring`
- Responsive design (SCSS modules)
- Dimension selector on instructions screen
- Game over screen with score and replay option
- **Gameplay hints**: Instructional arrows showing where to drag/drop cards (toggle via "?" button, preference persisted in localStorage)

---

## Technical Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (static export) |
| Language | TypeScript |
| Styling | SCSS Modules |
| Drag & Drop | react-beautiful-dnd |
| Animations | react-spring |
| Data | NDJSON files |
| Storage | Browser localStorage |
| Testing | Playwright (40+ E2E tests) |
| Deployment | Netlify (auto-deploy on master) |

### Key Files

| File | Purpose |
|------|---------|
| `lib/items.ts` | Card selection, correctness checking |
| `lib/create-state.ts` | Game state initialization |
| `lib/dimensions.ts` | Dimension definitions and formatting |
| `components/board.tsx` | Drag-and-drop, score tracking |
| `components/game.tsx` | Game lifecycle, localStorage |
| `components/item-card.tsx` | Card rendering, flip animation |
| `components/gameplay-hints.tsx` | Instructional hints overlay |
| `public/dimensions.json` | Dimension metadata |
| `public/items-*.json` | Card data per dimension |

---

## Roadmap

### ✅ Phase 1: Multi-Dimension Support (DONE)

- [x] Dimension abstraction (generic `value` field)
- [x] Dimension selector UI
- [x] 6 core dimensions (Year, Price, Speed, Height, Weight, Population)
- [x] 19 additional dimensions (25 total)

### 🔄 Phase 2: Quality Improvements (IN PROGRESS)

- [ ] Add 50+ items per dimension for better variety
- [ ] Add images to dimension items
- [ ] Improve value distribution to avoid clustering
- [ ] Add difficulty tiers within each dimension
- [ ] Create "mixed" mode combining multiple dimensions

### 📋 Phase 3: AI Card Generation (PLANNED)

- [ ] OpenAI API integration for generating cards
- [ ] Prompt engineering for well-formatted card data
- [ ] Validation to ensure generated cards are playable
- [ ] Rate limiting and caching
- [ ] On-demand generation during gameplay

### 💡 Phase 4: User Features (FUTURE)

- [ ] User accounts and authentication
- [ ] Leaderboards
- [ ] Custom dimension creation
- [ ] Personalized recommendations based on play history
- [ ] Multiplayer mode

---

## Card Data Guidelines

See [`public/guidelines.md`](public/guidelines.md) for detailed guidelines. Key points:

1. **Unique values** — no duplicates within a dimension
2. **Short labels** — ≤ 4 words before parentheses
3. **Recognizable items** — prefer widely known subjects
4. **Good distribution** — logarithmic spacing for large ranges
5. **No answer leakage** — value shouldn't appear in label/description
6. **NDJSON format** — one JSON object per line

---

## Development

See [`.cursorrules`](.cursorrules) for:
- Branch workflow (always use feature branches)
- Testing commands and troubleshooting
- How to add new dimensions
- Pre-deployment checklist
