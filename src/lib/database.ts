import { UserProfile, InteractiveCircuitState } from '../types/builder';
export type { UserProfile };
import { CircuitDesign } from '../types';
import { CIRCUIT_DESIGNS } from './circuitDesigns';
import { db, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';

const DB_USERS_KEY = 'sunacademy_db_users_v1';
const DB_SESSION_KEY = 'sunacademy_db_session_v1';
const DB_CIRCUITS_KEY = 'sunacademy_db_circuits_v1';

const defaultUser: UserProfile = {
  id: 'user-default-1',
  name: 'Kasujja Jerwestwood',
  email: 'kasujjajerwestwood@gmail.com',
  phone: '+1 (555) 234-5678',
  address: {
    street: '742 Hardware Way, Suite 101',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    country: 'United States'
  },
  role: 'Maker',
  createdAt: new Date().toISOString()
};

// --- User Database Methods ---
export const getUsers = (): UserProfile[] => {
  if (typeof window === 'undefined') return [defaultUser];
  try {
    const raw = localStorage.getItem(DB_USERS_KEY);
    if (!raw) {
      localStorage.setItem(DB_USERS_KEY, JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return JSON.parse(raw);
  } catch {
    return [defaultUser];
  }
};

export const getCurrentUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return defaultUser;
  try {
    const raw = localStorage.getItem(DB_SESSION_KEY);
    if (!raw) {
      localStorage.setItem(DB_SESSION_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch {
    return defaultUser;
  }
};

export const saveUser = (user: UserProfile): void => {
  const users = getUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
  localStorage.setItem(DB_SESSION_KEY, JSON.stringify(user));

  // Sync to Firebase Firestore asynchronously
  try {
    setDoc(doc(db, 'users', user.id), {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || '',
      role: user.role || 'Maker',
      createdAt: user.createdAt || new Date().toISOString()
    }).catch((err) => {
      console.warn('Firestore sync failed, local database active:', err);
    });
  } catch (err) {
    console.warn('Firestore write skipped:', err);
  }
};

export const signInUser = (email: string, password?: string): UserProfile => {
  const users = getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    localStorage.setItem(DB_SESSION_KEY, JSON.stringify(existing));
    saveUser(existing);
    return existing;
  }

  // Create new user profile if not found
  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    name: email.split('@')[0],
    email: email.toLowerCase(),
    phone: '+1 (555) 000-0000',
    address: {
      street: '123 Innovation Drive',
      city: 'Tech City',
      state: 'CA',
      zipCode: '94000',
      country: 'United States'
    },
    role: 'Student',
    createdAt: new Date().toISOString()
  };
  saveUser(newUser);
  return newUser;
};

export const signOutUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DB_SESSION_KEY);
};

// --- Circuits Database Methods ---
export const getDatabaseCircuits = (): CircuitDesign[] => {
  if (typeof window === 'undefined') return CIRCUIT_DESIGNS;
  try {
    const raw = localStorage.getItem(DB_CIRCUITS_KEY);
    if (!raw) {
      localStorage.setItem(DB_CIRCUITS_KEY, JSON.stringify(CIRCUIT_DESIGNS));
      return CIRCUIT_DESIGNS;
    }
    return JSON.parse(raw);
  } catch {
    return CIRCUIT_DESIGNS;
  }
};

export const saveDatabaseCircuits = (circuits: CircuitDesign[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_CIRCUITS_KEY, JSON.stringify(circuits));

    // Sync custom circuits to Firestore
    const custom = circuits.filter((c) => c.id.startsWith('circ-') && c.id.length > 10);
    custom.forEach((c) => {
      setDoc(doc(db, 'circuits', c.id), {
        id: c.id,
        title: c.title,
        category: c.category || 'Circuits',
        description: c.description || '',
        simulationType: c.simulationType || 'led',
        code: c.code || '',
        codeLanguage: c.codeLanguage || 'cpp',
        componentsCount: c.componentsCount || 1,
        lastEdited: c.lastEdited || new Date().toISOString()
      }).catch(() => {});
    });
  } catch (err) {
    console.error('Failed to save circuits to database', err);
  }
};
