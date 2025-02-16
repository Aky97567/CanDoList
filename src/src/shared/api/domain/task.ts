export interface Task {
  id: string;
  title: string;
  category: string;
  isDaily?: boolean;
  isOneTime?: boolean;
  userId?: string;  // For auth
}

export {};
