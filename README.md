# TaskFlow - Personal Task Management System

TaskFlow is a modern task management application built with React, TypeScript, and Firebase. It helps you organize your tasks across different categories and views while providing a motivational timeline to track your progress.

## Features

- **Multiple Task Views**:

  - **Daily Plan**: Focus on today's tasks
  - **All Tasks**: View and manage all your incomplete tasks
  - **Completed Tasks**: Review tasks you've completed
  - **Timeline**: A motivational GitHub-style contribution view of your archived tasks

- **Task Categories**:

  - **Personal**: For your personal life tasks
  - **Work**: Work-related responsibilities
  - **Breakthrough**: Tasks you might be avoiding due to mental blocks
  - **Habit**: Recurring tasks that appear daily (supplements, exercise, etc.)

- **Rich Task Management**:

  - Prioritize tasks
  - Complete tasks
  - Archive completed tasks
  - Add tasks to your daily plan
  - Track recurring habits

- **Additional Features**:
  - Filter work tasks in/out of view
  - Drag-and-drop task reordering
  - Task archiving with completion history

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
git clone https://github.com/yourusername/taskflow.git
cd taskflow
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

## Usage

### Task Management Workflow

1. **Create tasks** in various categories
2. **Add important tasks** to your daily plan
3. **Complete tasks** when finished
4. **Archive completed tasks** to track your progress over time
5. **Maintain habits** with recurring tasks

### Habit Tasks

Habit tasks represent recurring activities like taking supplements or daily routines. They:

- Always appear in the Daily Plan view
- Can be completed but will reappear the next day
- Cannot be deleted as they are intended to be recurring

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

_Note: TaskFlow is a personal project and is continuously evolving._
