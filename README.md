# CanDoList

A personal productivity app — task manager with habit tracking, a daily planner, and a timeline view.

## Philosophy

CanDoList separates your main task collection from your daily focus. Keep track of everything without being overwhelmed — only what you've chosen shows up in today's view.

## Views

| View | Description |
|---|---|
| **Daily Plan** | Default view; tasks pinned to today. Habits appear automatically. |
| **All Tasks** | Full task list with drag-and-drop reorder. |
| **Completed** | Archive browser. Completed habits and habits skipped today both appear here. |
| **Timeline** | GitHub-style heatmap + date-range task list. |
| **Habit Streaks** | Streak dashboard for all habit tasks. |

## Task Model

Every task has:

- **`category`**: `work` | `personal` | `green` *(Breakthrough)* | `chore` *(Habit)*
- **`priority`**: `high` | `regular`
- **`isOneTime`**: disappears after completion
- **`addedToDaily`**: pinned to the daily plan
- **`rank`**: lexicographic string for drag-and-drop ordering

Habit tasks (`chore`) carry additional streak fields: `currentStreak`, `longestStreak`, `lastCompletedDate`, `streakUpdatedAt`, `skippedDate`.

## Habit Behaviour

- Habits automatically appear in the Daily Plan unless completed or skipped for today.
- Completing a habit updates its streak and moves it to the Completed view.
- Habits can be re-added from the Completed view (Undo button).
- **Skip ("Won't do today")**: removes the habit from today's view without counting it as completed. Skipped habits appear in the Completed view with a "Skipped" badge and can be restored.
- Streak is **at risk** if last completion was yesterday; **broken** (reset to 0) if 2+ days ago.

## Architecture

Vite + React SPA following [Feature-Sliced Design](https://feature-sliced.design/).

```
src/
├── app/
│   └── providers/
│       ├── StorageProvider.tsx   # Initialises Firebase; provides TaskStorage via context
│       └── useStorage.ts
├── entities/
│   └── task/
│       ├── model/types.ts        # Task types + colour helpers
│       ├── model/rankUtils.ts    # Rank helpers for drag-and-drop ordering
│       └── ui/TaskCard.tsx
├── features/
│   ├── tasks/                    # Task CRUD, daily plan, completed view, drag-and-drop
│   ├── habits/                   # Streak tracking (streakUtils.ts, HabitStreaksView)
│   └── timeline/                 # Completion heatmap + date-range task list
├── shared/
│   ├── api/
│   │   ├── domain/types/         # View union type and cross-cutting types
│   │   ├── ports/out/storage/    # TaskStorage interface (port)
│   │   └── adapters/out/storage/ # FirebaseAdapter + LocalStorageAdapter
│   └── ui/                       # Heatmap, LoadingState, ErrorState primitives
└── widgets/
    └── navigation/               # Navbar, mobile menu, view-switching
```

**Layer rules**: `entities` ← `features` ← `widgets`. `shared` is available to all layers.

## Storage

- **Active adapter**: Firebase Firestore (`FirebaseAdapter`).
- **Offline/dev**: swap to `LocalStorageAdapter` via the commented-out lines in `StorageProvider.tsx`.
- **Config**: copy `.env.example` → `.env.local` and fill in `VITE_FIREBASE_*` values. Never commit `.env.local`.

## Tech Stack

- **Frontend**: React + TypeScript (strict mode)
- **Styling**: Material UI
- **State**: React Hooks
- **Database**: Firebase Firestore
- **Build**: Vite
- **Deploy**: GitHub Pages

## Getting Started

```bash
# Install dependencies
npm install

# Copy and fill in Firebase config
cp .env.example .env.local

# Start dev server (localhost:5173)
npm run dev
```

Other commands:

```bash
npm run build      # Type-check + production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

## CI/CD

GitHub Actions (`.github/workflows/build-and-deploy.yml`):

- **build** job: runs on every push and PR to `main` — installs deps, injects Firebase secrets, runs `npm run build`.
- **deploy** job: runs only on `main` after build passes — uploads `dist/` to GitHub Pages and writes a `CNAME` for the custom domain.

Firebase secrets are stored as GitHub Actions secrets (`VITE_FIREBASE_*`).

---

_Focus on what matters today, while keeping track of everything you can do._
