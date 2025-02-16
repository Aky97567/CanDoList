#!/bin/zsh

# Create FSD structure with entities and widgets
mkdir -p src/features/{tasks,categories,daily-plan,auth}/{ui,model,lib}
mkdir -p src/entities/{task,category,user}/{ui,model,lib}
mkdir -p src/widgets/{layout,navigation,filters}/{ui,model,lib}
mkdir -p src/shared/{ui,api/{domain,ports/{in,out},adapters/{in,out/{localStorage,firebase},auth}}}
mkdir -p src/app/{styles,providers,router}

# Create domain files in shared layer
cat > src/shared/api/domain/task.ts << 'EOF'
export interface Task {
  id: string;
  title: string;
  category: string;
  isDaily?: boolean;
  isOneTime?: boolean;
  userId?: string;  // For auth
}

export {};
EOF

cat > src/shared/api/domain/user.ts << 'EOF'
export interface User {
  id: string;
  email: string;
  displayName?: string;
}

export {};
EOF

# Create entity model files
cat > src/entities/task/model/types.ts << 'EOF'
export type TaskPriority = 'high' | 'regular';
export type TaskCategory = 'work' | 'personal' | 'chore';
export type TaskColor = 'black' | 'blue' | 'pink' | 'green' | 'red';

export interface TaskEntity {
  id: string;
  title: string;
  category: TaskCategory;
  color: TaskColor;
  priority: TaskPriority;
  isDaily?: boolean;
  isOneTime?: boolean;
}

export {};
EOF

cat > src/entities/category/model/types.ts << 'EOF'
export interface CategoryEntity {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

export {};
EOF

# Create auth ports
cat > src/shared/api/ports/in/authManagement.ts << 'EOF'
import { User } from '../../domain/user';

export interface AuthManagementPort {
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export {};
EOF

cat > src/shared/api/ports/out/authRepository.ts << 'EOF'
import { User } from '../../domain/user';

export interface AuthRepositoryPort {
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export {};
EOF

# Create task and category related ports
cat > src/shared/api/ports/in/taskManagement.ts << 'EOF'
import { Task } from '../../domain/task';

export interface TaskManagementPort {
  createTask(task: Omit<Task, 'id'>): Promise<Task>;
  updateTask(task: Task): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  getTasks(): Promise<Task[]>;
  getDailyTasks(): Promise<Task[]>;
}

export {};
EOF

cat > src/shared/api/ports/in/categoryManagement.ts << 'EOF'
import { Category } from '../../domain/category';

export interface CategoryManagementPort {
  createCategory(category: Omit<Category, 'id'>): Promise<Category>;
  updateCategory(category: Category): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  getCategories(): Promise<Category[]>;
}

export {};
EOF

# Create placeholder files
# Auth
touch src/shared/api/adapters/auth/FirebaseAuthRepository.ts
touch src/features/auth/ui/SignInForm.tsx
touch src/features/auth/ui/UserProfile.tsx
touch src/features/auth/model/store.ts
touch src/app/providers/AuthProvider.tsx

# Tasks
touch src/features/tasks/ui/TaskList.tsx
touch src/features/tasks/ui/TaskCard.tsx
touch src/entities/task/ui/TaskView.tsx
touch src/entities/task/ui/TaskForm.tsx

# Categories
touch src/entities/category/ui/CategoryBadge.tsx
touch src/entities/category/ui/CategorySelect.tsx

# Widgets
touch src/widgets/layout/ui/MainLayout.tsx
touch src/widgets/navigation/ui/Navbar.tsx
touch src/widgets/navigation/ui/Sidebar.tsx
touch src/widgets/filters/ui/CategoryFilter.tsx
touch src/widgets/filters/ui/PriorityFilter.tsx

# Daily Plan
touch src/features/daily-plan/ui/DailyView.tsx
touch src/features/daily-plan/ui/DailyTaskList.tsx

# Repositories
touch src/shared/api/adapters/out/localStorage/LocalStorageTaskRepository.ts
touch src/shared/api/adapters/out/firebase/FirebaseTaskRepository.ts

echo "Project structure with FSD layers created successfully!"