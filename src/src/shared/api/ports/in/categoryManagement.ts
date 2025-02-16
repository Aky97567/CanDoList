import { Category } from '../../domain/category';

export interface CategoryManagementPort {
  createCategory(category: Omit<Category, 'id'>): Promise<Category>;
  updateCategory(category: Category): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  getCategories(): Promise<Category[]>;
}

export {};
