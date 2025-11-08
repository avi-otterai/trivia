# WikiTrivia Product Requirements Document (PRD)

## Overview

WikiTrivia is a web-based card game where players arrange cards in chronological order based on a specific property (currently years). The game tests players' knowledge by having them place cards in the correct sequence on a timeline. Incorrect placements result in losing a life, and the game tracks the player's best streak.

**Target Audience**: This PRD is written for developers with Python/ML backgrounds who are new to web development.

---

## Current Features (✅ DONE)

### 1. Card Format
- **Number/Dimension**: Each card contains a numeric value (currently always a year)
- **Property**: Each card has a property that describes what the number represents:
  - `P569`: "born"
  - `P570`: "died"
  - `P571`: "created"
  - `P577`: "published"
  - `P582`: "ended"
  - `P580`: "started"
  - `P575`: "discovered/invented"
  - `P1619`: "officially opened"
  - And more (see `components/item-card.tsx` for full mapping)
- **Subject**: Each card has:
  - `label`: The name/title of the subject (e.g., "Belgium", "Diego Velázquez")
  - `description`: A brief description of the subject
  - `instance_of`: Categories the subject belongs to (e.g., ["human"], ["sovereign state"])
  - `occupations`: For people, their occupations (e.g., ["painter"], ["politician"])
- **Image**: Optional image displayed on the card (loaded from Wikimedia Commons)
- **Metadata**: Additional fields like `id`, `wikipedia_title`, `page_views`, etc.

**Implementation**: Cards are stored in `public/items.json` as newline-delimited JSON (NDJSON format). Each line is a JSON object representing one card.

### 2. Gameplay Mechanics
- **Initial State**: Game starts with one card already placed on the timeline
- **Card Placement**: Player drags one card at a time from the "next" area into the chronological queue
- **Chronological Ordering**: Cards must be arranged in ascending order based on their numeric value (year)
- **Correctness Check**: When a card is placed, the game checks if it's in the correct position by:
  1. Creating a sorted array of all cards (including the new one)
  2. Finding the correct index of the new card in the sorted array
  3. Comparing the player's chosen index with the correct index
- **Life System**: 
  - Player starts with 3 lives (displayed as hearts at the top)
  - Incorrect placement loses one life
  - Game ends when lives reach 0
- **Visual Feedback**: 
  - Incorrectly placed cards are visually indicated
  - Cards can be flipped to reveal full information (year, description, Wikipedia link)
  - Cards show a hint on the front (the property name like "born", "created", etc.) and the full year on the back

**Implementation**: Core logic in `lib/items.ts` (`checkCorrect` function) and `components/board.tsx` (drag-and-drop handling).

### 3. Scoring System
- **Streak Tracking**: Game tracks the number of consecutive correct placements
- **Top Streak**: Best streak is cached in browser's `localStorage` with key `"highscore"`
- **Display**: 
  - Current streak shown during gameplay
  - Best streak displayed on instructions screen and game over screen
  - Streak is calculated as: `state.played.filter((item) => item.played.correct).length - 1`

**Implementation**: See `components/game.tsx` for localStorage handling and `components/board.tsx` for score calculation.

### 4. Card Selection Algorithm
- **Random Selection**: Cards are selected randomly from the deck, but with smart filtering:
  - Avoids cards too close to already-played cards (distance varies based on game length)
  - Filters by time periods: [-100000, 1000], [1000, 1800], [1800, 2020]
  - Sometimes avoids people (50% chance) to add variety
- **Preloading**: Next two cards are preloaded to ensure smooth gameplay

**Implementation**: `lib/items.ts` (`getRandomItem` function) and `lib/create-state.ts`.

### 5. Data Filtering
- **Bad Cards**: Filters out cards listed in `lib/bad-cards.ts`
- **Answer Leakage**: Filters out cards where:
  - The label contains the year
  - The description contains the year
  - The description contains century references (e.g., "19th century")

**Implementation**: `components/game.tsx` (data fetching and filtering).

### 6. User Interface
- **Drag and Drop**: Uses `react-beautiful-dnd` library for smooth card dragging
- **Animations**: Uses `react-spring` for card flip animations and heart animations
- **Responsive Design**: SCSS modules for styling
- **Loading State**: Shows loading screen while fetching card data
- **Instructions Screen**: Shows before game starts with best streak display
- **Game Over Screen**: Shows final score, best streak, and option to play again

**Implementation**: Various component files in `components/` directory.

---

## Future Features (📋 TODO)

### Phase 1: Generalize to Non-Year Dimensions

#### TODO 1.1: Dimension Abstraction
- **Goal**: Support dimensions other than years (e.g., speed, price, height, weight)
- **Tasks**:
  - [ ] Create a `Dimension` type/interface that defines:
    - Dimension name (e.g., "year", "speed", "price")
    - Unit (e.g., "years", "km/h", "USD")
    - Comparison function (for sorting)
    - Display format (how to show the number)
  - [ ] Refactor `Item` interface to use a generic `value` field instead of hardcoded `year`
  - [ ] Update all sorting/comparison logic to use the dimension's comparison function
  - [ ] Update UI to display dimension-appropriate labels and units

#### TODO 1.2: Static JSON Files for Different Dimensions
- **Goal**: Create static JSON files similar to `public/items.json` for different dimensions
- **Tasks**:
  - [ ] Create `public/items-speed.json` with cards like:
    - Cheetah: 120 km/h
    - Rocket: 40,000 km/h
    - Usain Bolt: 37.58 km/h
    - Fastest human cyclist: 89.59 km/h
  - [ ] Create `public/items-price.json` with cards like:
    - Median California home: $800,000
    - Smallest yacht: $100,000
    - Tesla Model 3: $40,000
    - iPhone 15: $800
  - [ ] Create dimension metadata files (e.g., `public/dimensions.json`) that map dimension names to their JSON files
  - [ ] Update game initialization to load the selected dimension's data

#### TODO 1.3: Dimension Selection UI
- **Goal**: Allow players to choose which dimension to play
- **Tasks**:
  - [ ] Add dimension selector to instructions screen
  - [ ] Store selected dimension in game state
  - [ ] Update card display to show appropriate units and formatting
  - [ ] Update property labels to be dimension-appropriate (e.g., "top speed" instead of "born")

### Phase 2: GPT-Based Card Generation

#### TODO 2.1: OpenAI Integration Setup
- **Goal**: Set up OpenAI API integration for generating cards
- **Tasks**:
  - [ ] Add OpenAI SDK dependency (`openai` npm package)
  - [ ] Create environment variable for OpenAI API key (`OPENAI_API_KEY`)
  - [ ] Set up API route in Next.js (`pages/api/generate-cards.ts` or use Vercel Edge Function)
  - [ ] Implement secure key storage (use Vercel environment variables, never commit to git)

#### TODO 2.2: Card Generation Prompt Engineering
- **Goal**: Create prompts that generate well-formatted card data
- **Tasks**:
  - [ ] Design prompt template that requests:
    - Subject name (label)
    - Numeric value for the dimension
    - Property description
    - Brief description
    - Categories (instance_of)
    - Wikipedia title (for linking)
  - [ ] Specify JSON output format matching the `Item` interface
  - [ ] Include examples in the prompt (few-shot learning)
  - [ ] Add validation to ensure generated cards match expected format

#### TODO 2.3: Card Generation API Endpoint
- **Goal**: Create API endpoint that generates cards on-demand
- **Tasks**:
  - [ ] Create Next.js API route or Vercel Edge Function
  - [ ] Accept parameters: dimension, number of cards, difficulty level
  - [ ] Call OpenAI API with appropriate prompt
  - [ ] Parse and validate response
  - [ ] Return generated cards as JSON
  - [ ] Add rate limiting to prevent abuse
  - [ ] Cache generated cards to reduce API calls

#### TODO 2.4: Output Format Validation
- **Goal**: Ensure generated cards are valid and playable
- **Tasks**:
  - [ ] Create validation function that checks:
    - Required fields are present
    - Numeric value is valid
    - No answer leakage (year/value not in label/description)
    - Wikipedia title is valid format
  - [ ] Filter out invalid cards automatically
  - [ ] Log validation failures for debugging
  - [ ] Retry generation if too many cards fail validation

### Phase 3: On-Demand Generation

#### TODO 3.1: Dynamic Card Loading
- **Goal**: Generate cards dynamically during gameplay instead of loading all at once
- **Tasks**:
  - [ ] Modify card selection to fetch new cards when deck runs low
  - [ ] Implement card generation queue
  - [ ] Pre-generate cards in background while player is playing
  - [ ] Handle loading states gracefully

#### TODO 3.2: Dimension-Specific Generation
- **Goal**: Generate cards for any dimension on-demand
- **Tasks**:
  - [ ] Create dimension-specific prompt templates
  - [ ] Allow players to request custom dimensions
  - [ ] Store generated cards temporarily (session storage)
  - [ ] Optionally save popular dimensions to static files

### Phase 4: User Personalization (Future)

#### TODO 4.1: ChatGPT History Integration
- **Goal**: Generate games based on user's ChatGPT conversation history
- **Tasks**:
  - [ ] Create prompt for users to summarize their ChatGPT history
  - [ ] Parse user summary to extract topics and interests
  - [ ] Generate dimension suggestions based on topics
  - [ ] Create custom card sets for user's interests

#### TODO 4.2: User Profile System
- **Goal**: Store user preferences and game history
- **Tasks**:
  - [ ] Set up Supabase database schema for users
  - [ ] Store favorite dimensions
  - [ ] Track game history and statistics
  - [ ] Implement user authentication (optional)

#### TODO 4.3: Personalized Recommendations
- **Goal**: Suggest dimensions and cards based on user's past games
- **Tasks**:
  - [ ] Analyze user's game history
  - [ ] Recommend dimensions they might enjoy
  - [ ] Generate cards in topics they've shown interest in
  - [ ] Track difficulty preferences

---

## Technical Architecture

### Current Stack
- **Framework**: Next.js 14 (React framework)
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **Drag & Drop**: react-beautiful-dnd
- **Animations**: react-spring
- **Data Format**: NDJSON (newline-delimited JSON)
- **Storage**: Browser localStorage (for highscore)

### Proposed Stack Additions
- **Database**: Supabase (PostgreSQL)
- **Backend Functions**: Vercel Edge Functions or Supabase Edge Functions
- **AI Integration**: OpenAI API
- **Deployment**: Vercel

---

## Deployment Guide

### Prerequisites
1. **GitHub Account**: For version control
2. **Vercel Account**: For hosting (free tier available)
3. **Supabase Account**: For database (free tier available)
4. **OpenAI Account**: For API access (pay-as-you-go)

### Step 1: Set Up Supabase Database

1. **Create Supabase Project**:
   - Go to https://supabase.com
   - Sign up/login
   - Click "New Project"
   - Choose organization, name your project (e.g., "wikitrivia")
   - Set database password (save this!)
   - Choose region closest to your users
   - Wait for project to be created (~2 minutes)

2. **Create Database Schema** (using Supabase SQL Editor):
   ```sql
   -- Users table (optional, for future features)
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Game sessions table
   CREATE TABLE game_sessions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     dimension TEXT NOT NULL,
     score INTEGER NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Generated cards cache table
   CREATE TABLE generated_cards (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     dimension TEXT NOT NULL,
     card_data JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     usage_count INTEGER DEFAULT 0
   );

   -- Create index for faster lookups
   CREATE INDEX idx_generated_cards_dimension ON generated_cards(dimension);
   CREATE INDEX idx_game_sessions_user ON game_sessions(user_id);
   ```

3. **Get Supabase Credentials**:
   - Go to Project Settings → API
   - Copy:
     - `Project URL` (e.g., `https://xxxxx.supabase.co`)
     - `anon` `public` key (for client-side access)
     - `service_role` key (for server-side access - keep secret!)

### Step 2: Set Up Vercel Deployment

1. **Install Vercel CLI** (optional, for local testing):
   ```bash
   npm i -g vercel
   ```

2. **Connect GitHub Repository**:
   - Push your code to GitHub
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables** (in Vercel Dashboard):
   - Go to Project Settings → Environment Variables
   - Add the following:
     ```
     OPENAI_API_KEY=sk-... (your OpenAI API key)
     SUPABASE_URL=https://xxxxx.supabase.co
     SUPABASE_ANON_KEY=eyJ... (anon public key)
     SUPABASE_SERVICE_ROLE_KEY=eyJ... (service role key - for server-side)
     NODE_ENV=production
     ```

4. **Deploy**:
   - Vercel will automatically deploy on every push to main branch
   - Or click "Deploy" button in dashboard
   - Wait for deployment (~2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Step 3: Create API Routes for Card Generation

Create `pages/api/generate-cards.ts` (or use Vercel Edge Function):

```typescript
// Example structure (you'll need to implement this)
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dimension, count } = req.body;

  // TODO: Implement card generation logic
  // 1. Create prompt
  // 2. Call OpenAI API
  // 3. Parse response
  // 4. Validate cards
  // 5. Return cards

  res.status(200).json({ cards: [] });
}
```

### Step 4: Update Next.js Configuration

Update `next.config.js` to support API routes (if using Edge Functions):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep static export for frontend, but add API routes
  // Remove `output: "export"` if you want API routes
  // Or use Vercel Edge Functions instead
};
```

**Note**: If you use `output: "export"`, you cannot use API routes. Instead, use Vercel Edge Functions (create `api/` folder in project root).

### Step 5: Set Up Supabase Client

1. **Install Supabase Client**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create Supabase Client** (`lib/supabase.ts`):
   ```typescript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

3. **Update Environment Variables**:
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel
   - Prefix with `NEXT_PUBLIC_` so they're available in browser

### Step 6: Testing Deployment

1. **Test Locally** (with Vercel CLI):
   ```bash
   vercel dev
   ```
   - This runs your app locally with Vercel's environment

2. **Test Production**:
   - Visit your Vercel URL
   - Check browser console for errors
   - Test card generation (if implemented)
   - Check Supabase dashboard for data

### Step 7: Domain Setup (Optional)

1. **Add Custom Domain**:
   - Go to Vercel Project Settings → Domains
   - Add your domain (e.g., `wikitrivia.com`)
   - Follow DNS configuration instructions
   - Wait for DNS propagation (~24 hours)

---

## Development Workflow for Python/ML Developers

### Key Differences from Python Development

1. **Package Management**: 
   - Python uses `pip` and `requirements.txt`
   - JavaScript uses `npm` and `package.json`
   - Install packages: `npm install package-name`
   - Update packages: `npm update`

2. **Type System**:
   - Python has dynamic typing (or type hints)
   - TypeScript has static typing (like Python type hints, but enforced)
   - Files end in `.ts` (TypeScript) instead of `.py`

3. **Async/Await**:
   - Similar to Python, but syntax is slightly different
   - `async function name() { await ... }` instead of `async def name(): await ...`

4. **Imports**:
   - `import { function } from './file'` instead of `from file import function`
   - Default exports: `export default function` → `import Function from './file'`

5. **Environment Variables**:
   - Use `.env.local` file (like Python's `.env`)
   - Access with `process.env.VARIABLE_NAME`
   - Client-side variables need `NEXT_PUBLIC_` prefix

### Common Commands

```bash
# Install dependencies (like pip install -r requirements.txt)
npm install

# Run development server (like python manage.py runserver)
npm run dev

# Build for production (like python setup.py build)
npm run build

# Run production build locally
npm start

# Format code (like black)
npm run format

# Lint code (like flake8)
npm run lint
```

### File Structure Overview

```
trivia/
├── components/          # React components (like Python modules)
│   ├── game.tsx        # Main game component
│   ├── board.tsx       # Game board with drag-and-drop
│   └── ...
├── lib/                # Utility functions (like Python lib/)
│   ├── items.ts        # Card logic
│   └── ...
├── pages/              # Next.js pages (like Flask routes)
│   ├── index.tsx       # Home page
│   └── api/            # API endpoints (like Flask @app.route)
├── public/             # Static files (like Flask static/)
│   └── items.json      # Card data
├── styles/             # SCSS stylesheets
├── types/              # TypeScript type definitions
└── package.json        # Dependencies (like requirements.txt)
```

---

## Security Considerations

1. **API Keys**: Never commit API keys to git. Use environment variables.
2. **Rate Limiting**: Implement rate limiting on card generation API to prevent abuse.
3. **Input Validation**: Validate all user inputs and API responses.
4. **CORS**: Configure CORS properly if making cross-origin requests.
5. **Supabase RLS**: Use Row Level Security (RLS) policies in Supabase for data access control.

---

## Next Steps

1. **Start with Phase 1**: Implement dimension abstraction (TODO 1.1-1.3)
2. **Create Test Data**: Generate sample JSON files for speed and price dimensions
3. **Set Up Infrastructure**: Deploy to Vercel and set up Supabase
4. **Implement GPT Integration**: Start with TODO 2.1-2.4
5. **Iterate**: Test with users and gather feedback

---

## Questions or Issues?

- Check Next.js docs: https://nextjs.org/docs
- Check Supabase docs: https://supabase.com/docs
- Check Vercel docs: https://vercel.com/docs
- Check OpenAI docs: https://platform.openai.com/docs

