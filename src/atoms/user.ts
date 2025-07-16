import { atom } from 'jotai';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
}

// ✅ Explicit writable atom
export const userAtom = atom<User | null, [User | null], void>(
  null,
  (get, set, newValue) => set(userAtom, newValue)
);
