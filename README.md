# CanDoList - Intelligent Task Management Without Overwhelm

CanDoList is a modern task management application that tackles a common problem with traditional to-do lists: the overwhelming feeling of seeing all your tasks at once. With CanDoList, you can keep track of everything you need to do while focusing only on what matters today.

## Core Philosophy

CanDoList separates your master task collection from your daily focus. This allows you to:

- Capture all tasks without creating mental burden
- Focus only on what's relevant for today
- Balance work and personal tasks with dedicated modes
- Track your progress with a motivational timeline

## Features

- **Multiple Task Views**:

  - **Daily Plan**: Your focused today view - the real "to-do list"
  - **All Tasks**: Your master collection of tasks (the "can do" list)
  - **Completed Tasks**: Review tasks you've completed
  - **Timeline**: A motivational GitHub-style contribution view of your archived tasks

- **Task Categories**:

  - **Personal**: For your personal life tasks
  - **Work**: Work-related responsibilities
  - **Breakthrough**: Tasks you might be avoiding due to mental blocks
  - **Habit**: Recurring tasks that appear daily (supplements, exercise, etc.)

- **Work/Life Balance Modes**:

  - **After Work/Weekend/Vacation Mode**: Hides all work tasks
  - **Work Mode** (planned): Focus exclusively on work tasks

- **Rich Task Management**:
  - Prioritize tasks
  - Complete tasks
  - Archive completed tasks
  - Add tasks to your daily plan
  - Track recurring habits

## Task Workflow

### Standard Tasks (Personal, Work, Breakthrough)

1. Create in All Tasks view
2. Add selected tasks to Daily Plan
3. Complete tasks when finished
4. Archive completed tasks

### Habit Tasks

- Automatically appear in Daily Plan
- Can be completed but will reappear the next day
- Cannot be deleted as they are recurring

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Material UI (@mui)
- **State Management**: React Hooks
- **Database**: Firebase Firestore
- **Build Tool**: Vite

## Project Structure

The project follows a feature-oriented architecture:

- **app/**: Application-level providers and configuration
- **entities/**: Core business entities (tasks)
- **features/**: Feature modules (task management, timeline)
- **shared/**: Shared utilities, API interfaces, and UI components
- **widgets/**: Composite components used across features

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Firebase account (for database)

### Installation

1. Clone the repository

```bash
git clone https://github.com/aky97567/candolist.git
cd candolist
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Configure Firebase
   - Create a `.env` file in the project root
   - Add your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint

### Extending the Project

The project uses a modular architecture that makes it easy to extend:

- Add new task categories by updating the `TaskCategory` type
- Create new views by following the pattern of existing view components
- Extend the Firebase adapter for additional data operations

## License

[MIT](LICENSE)

---

_CanDoList: Focus on what matters today, while keeping track of everything you can do._
