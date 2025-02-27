import { atom } from "jotai";

export interface AuthState {
  isAuthenticated: boolean;
  lastAuthTime: number | null;
  // 5 minutes expiration time
  expirationTime: number;
}

const initialState: AuthState = {
  isAuthenticated: false,
  lastAuthTime: null,
  expirationTime: 5 * 60 * 1000, // 5 minutes in milliseconds
};

export const authStateAtom = atom<AuthState>(initialState);
