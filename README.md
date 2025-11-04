## Succes Pokemon Heartgold & Soulsilver

Challenge run tracker for Pokemon Heartgold & Soulsilver achievements created by Josplay. Built with Next.js App Router, strict TypeScript, and Tailwind CSS v4. Achievements are loaded from a static JSON file and completion state is stored locally in the browser.

### Stack
- Next.js 14 App Router with modular architecture
- React 19 with server-first layouts
- Tailwind CSS v4 with a custom Pokemon-inspired palette
- Typed custom hooks with separation of concerns
- Canvas-confetti for achievement animations
- Server sync capabilities for sharing progress

### Getting started

```bash
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) and start unlocking achievements. Useful commands:

- `pnpm lint` – ESLint with Next.js + TypeScript rules
- `pnpm build` – production build (prerequisite for deployment)

### Project layout

- `app/` – App Router entry points and global layout
- `components/` – UI building blocks (modular, < 200 lines each)
  - `achievements/` – Sub-components (AchievementHeader, AchievementFilters, CategoryDivider, StatusDivider, EmptyState)
  - `auth/` – Authentication components (AuthModal, AuthForm)
- `hooks/` – Custom React hooks following 2025 best practices
  - `useLocalStorage.ts` – Browser-safe localStorage wrapper
  - `useAuth.ts` – Authentication state with useReducer
  - `useToast.ts` – Toast notification manager
  - `useAchievementAnimation.ts` – Confetti animation logic
  - `useAchievementStats.ts` – Achievement statistics calculator
  - `useAchievementFilters.ts` – Search, filter and sort logic
- `config/` – Configuration files (achievements, confetti)
- `lib/` – Utility functions (text normalization)
- `public/` – Statically served assets (`successes.json`, icons)
- `types/` – Shared TypeScript contracts

### Architecture

The codebase follows Next.js 14 best practices with strict separation of concerns:

- **UI Components** (< 100-200 lines) – Pure presentation, minimal logic
- **Custom Hooks** – Business logic, state management with useReducer where appropriate
- **Configuration Files** – Constants, colors, labels externalized
- **Utility Functions** – Reusable helpers (text normalization, etc.)

All major components have been refactored to be modular, testable, and maintainable.

### Adding or editing achievements

1. Open `public/successes.json`.
2. Add a new object following the existing shape:
   ```json
   {
     "id": "unique-id",
     "title": "Achievement title",
     "description": "What the player needs to do",
     "icon": "/icons/default.svg"
   }
   ```
3. Keep the `id` unique—this key is also what gets stored in LocalStorage.
4. Optionally drop a new SVG icon inside `public/icons/` and reference it through the `icon` field.

Changes are picked up automatically at runtime thanks to `resolveJsonModule` and static imports.

### Local storage & reset

- Completion state lives under the key `mii-achievements::completed`.
- Use the "Reinitialiser" button in the UI to clear the stored data.

### Server sync

The app includes sync buttons to share progress with a server:
- **Synchroniser** – Upload your current progress to the server
- **Récupérer** – Download and merge progress from the server

Both features require authentication credentials configured on the backend.

### Theming

Tailwind tokens are defined in `tailwind.config.ts`. The palette includes Pokemon-themed colors with Mii Channel inspiration for a playful, nostalgic feel.
