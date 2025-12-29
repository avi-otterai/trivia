# Trivia Cards

A web-based card game where players arrange cards in order based on various dimensions — test your knowledge of years, prices, speeds, heights, populations, and 20+ more categories!

🎮 **[Play Now](https://avi-trivia.netlify.app)** | 📂 **[GitHub Repository](https://github.com/avi-otterai/trivia)**

[![Netlify Status](https://api.netlify.com/api/v1/badges/a89fca1a-298e-4bac-b12c-312ed5ea15cb/deploy-status)](https://app.netlify.com/projects/avi-trivia/deploys)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba4b?logo=playwright)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎮 How It Works

1. Choose a dimension (Year, Price, Speed, Height, etc.)
2. Cards appear with a subject (person, place, thing) and a hidden value
3. Drag and drop cards into the correct order based on the selected dimension
4. Get it right → keep your streak going!
5. Get it wrong → lose a life (you have 3)
6. Try to beat your high score!

---

## 🎯 Available Dimensions

The game includes **25 playable dimensions**:

| Category | Dimensions |
|----------|------------|
| **Core** | Year, Price, Speed, Height, Weight, Population |
| **Science** | Lifespan, Distance, Temperature, Area, Depth, Calories |
| **Entertainment** | Duration, Box Office, Album Sales, Game Sales, Oscars, Spotify Streams |
| **Misc** | Net Worth, Followers, Stadium Capacity, Horsepower, Elevation, Year Founded, Prep Time |

---

## 🚀 Quick Start

### Prerequisites

[Node.js](https://nodejs.org/) v18 or higher.

### Installation

```bash
git clone https://github.com/avi-otterai/trivia.git
cd trivia
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Test

```bash
npm run build    # Build for production
npm test         # Run E2E tests (always run before deploying!)
npm run lint     # Check for linting errors
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (static export)
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **Drag & Drop**: react-beautiful-dnd
- **Animations**: react-spring
- **Testing**: Playwright
- **Deployment**: Netlify (auto-deploy on `master` push)

---

## 📁 Project Structure

```
trivia/
├── components/       # React components (game, board, cards, etc.)
├── e2e/              # Playwright E2E tests
├── lib/              # Utility functions and game logic
├── pages/            # Next.js pages
├── public/           # Static assets and card data (JSON files)
├── styles/           # SCSS stylesheets
└── types/            # TypeScript type definitions
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and run tests (`npm test`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

> 📖 **For detailed development guidelines**, see [`.cursorrules`](.cursorrules) — includes testing commands, troubleshooting, branch workflow, and how to add new dimensions.

---

## 📝 Adding New Dimensions

Card data is stored in `public/items-{dimension}.json` files using NDJSON format (one JSON object per line).

See [`public/guidelines.md`](public/guidelines.md) for the format and guidelines on creating new dimension datasets.

---

## 📄 License

This project is open source under the MIT License — see [LICENSE.md](LICENSE.md) for details.

---

**Have fun playing!** 🎲
