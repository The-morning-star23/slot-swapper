import { createContext } from 'react';

// Define the shape of the user object
export interface User {
  id: string;
  name: string;
  email: string;
}

// Define the shape of the context value
export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create and export the context itself
// We provide a 'null' default which will be overridden by the provider.
// We cast it to the type to satisfy TypeScript.
export const AuthContext = createContext<AuthContextType | null>(null);