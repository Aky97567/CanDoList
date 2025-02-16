import { User } from '../../domain/user';

export interface AuthRepositoryPort {
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export {};
