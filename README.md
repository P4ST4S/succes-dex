## Succes Pokemon Heartgold & Soulsilver

Challenge run tracker for Pokemon Heartgold & Soulsilver achievements created by Josplay. Built with Next.js App Router, strict TypeScript, and Tailwind CSS v4. Achievements are loaded from a static JSON file and completion state is stored locally in the browser.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

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
     "icon": "/icons/default.svg",
     "category": "Category Name"
   }
   ```
3. Keep the `id` unique—this key is also what gets stored in LocalStorage.
4. Optionally drop a new SVG icon inside `public/icons/` and reference it through the `icon` field.

Changes are picked up automatically at runtime thanks to `resolveJsonModule` and static imports.

> Categories are defined implicitly based on the `category` field in each achievement object. New categories will appear automatically in the UI.

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
