# Succes Dex

A streamer achievement encyclopedia built with Next.js 16, featuring game-specific achievements with progress tracking.

## Features

- **Multi-game support** - Track achievements across Pokemon, Breath of the Wild, and Elden Ring
- **Category filtering** - Filter achievements by category (Intrigue, Pokemon, Quetes, Collection, Divers)
- **Real-time search** - Search achievements with accent-insensitive and case-insensitive matching
- **Progress tracking** - Visual progress bars showing completion percentage per game
- **Admin authentication** - Magic link authentication via Resend for admin access
- **Optimistic UI** - Instant feedback when toggling achievement completion

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Neon PostgreSQL + Drizzle ORM |
| Authentication | Magic Link via Resend |
| Language | TypeScript |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- Neon PostgreSQL database
- Resend API key

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=your_neon_database_url
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_admin_email
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm drizzle-kit push

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
succes-dex/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (games)/           # Game achievement pages
│   └── api/               # API routes
├── components/            # React components
│   ├── achievements/      # Achievement-related components
│   └── ui/               # Reusable UI components
├── data/
│   ├── achievements/      # Game achievement JSON files
│   └── games.ts          # Game metadata
├── lib/
│   ├── auth/             # Authentication utilities
│   └── db/               # Database client and schema
├── actions/              # Server actions
└── types/                # TypeScript type definitions
```

## Games

| Game | Achievements | Categories |
|------|-------------|------------|
| Pokemon | 113 | Intrigue, Pokemon, Quetes, Collection, Divers |
| Breath of the Wild | 105 | Histoire, Divers, Completion, Challenge |
| Elden Ring | 52 | Histoire, Combat, Exploration, Completion, Challenge, Divers |

## License

MIT
