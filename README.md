# Trivia Cards

A web-based card game where players arrange cards in order based on various dimensions — test your knowledge of years, prices, speeds, heights, populations, and 20+ more categories!

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 How It Works

1. Cards appear with a subject (person, place, thing) and a hidden value
2. Drag and drop cards into the correct order based on the selected dimension
3. Get it right → keep your streak going!
4. Get it wrong → lose a life (you have 3)
5. Try to beat your high score!

## 🚀 Quick Start

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/trivia.git
cd trivia

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create a production build
npm run build

# Serve the production build locally
npm start
```

## 📁 Project Structure

```
trivia/
├── components/       # React components (game, board, cards, etc.)
├── lib/              # Utility functions and game logic
├── pages/            # Next.js pages and routes
├── public/           # Static assets and card data (JSON files)
├── styles/           # SCSS stylesheets
├── types/            # TypeScript type definitions
└── package.json      # Dependencies and scripts
```

## 🎯 Available Dimensions

The game includes **25 playable dimensions**:

| Category | Dimensions |
|----------|------------|
| **Core** | Year, Price, Speed, Height, Weight, Population |
| **Science** | Lifespan, Distance, Temperature, Area, Depth, Calories |
| **Entertainment** | Duration, Box Office, Album Sales, Game Sales, Oscars, Spotify Streams |
| **Misc** | Net Worth, Followers, Stadium Capacity, Horsepower, Elevation, Year Founded, Prep Time |

## 🌐 Deploying to Netlify

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign up/log in
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **GitHub** and authorize Netlify
   - Select your `trivia` repository

3. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - Click **"Deploy site"**

4. **Done!** 🎉
   - Netlify will build and deploy your site
   - You'll get a URL like `https://your-site-name.netlify.app`
   - Every push to `main` will trigger an automatic redeploy!

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize your site (run from project root)
netlify init

# Deploy to production
netlify deploy --prod
```

## 🔄 Auto-Deploy on GitHub Push

Once you've connected your repository to Netlify (via the dashboard), auto-deploy is **enabled by default**. Here's what happens:

| Event | Action |
|-------|--------|
| Push to `main` | Automatically deploys to production |
| Pull Request | Creates a deploy preview with unique URL |
| Push to other branches | Creates branch deploy (optional) |

### Customizing Auto-Deploy

In your Netlify dashboard:

1. Go to **Site settings** → **Build & deploy** → **Continuous Deployment**
2. Configure options:
   - **Production branch:** Which branch triggers production deploys
   - **Deploy previews:** Enable/disable PR previews
   - **Branch deploys:** Deploy specific branches

### Deploy Notifications

Set up notifications in **Site settings** → **Build & deploy** → **Deploy notifications**:
- Slack notifications
- Email alerts
- Webhook integrations

## ⚙️ Environment Variables

If you need environment variables (for future features like API integration):

1. **Netlify Dashboard:** Site settings → Environment variables
2. **Local development:** Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```

> ⚠️ Never commit `.env.local` to git — it's already in `.gitignore`

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Serve production build |
| `npm run lint` | Check for linting errors |
| `npm run lint-fix` | Fix linting errors automatically |
| `npm run format` | Format code with Prettier |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Adding New Dimensions

Card data is stored in `public/items-{dimension}.json` files. See `public/guidelines.md` for the format and guidelines on creating new dimension datasets.

## 📄 License

This project is open source under the MIT License — see [LICENSE.md](LICENSE.md) for details.

---

**Have fun playing!** 🎲
