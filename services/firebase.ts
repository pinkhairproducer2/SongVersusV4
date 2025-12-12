import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  addDoc,
  increment
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import type { User, Battle, Territory, Duffle } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const usersCollection = collection(db, 'users');
export const battlesCollection = collection(db, 'battles');
export const territoriesCollection = collection(db, 'territories');

export async function getUsers(): Promise<User[]> {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getUserById(userId: string): Promise<User | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User;
  }
  return null;
}

export async function searchUsers(searchTerm: string): Promise<User[]> {
  const snapshot = await getDocs(usersCollection);
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  return users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);
}

export async function getLeaderboard(limitCount: number = 10): Promise<User[]> {
  const q = query(usersCollection, orderBy('reputation', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getBattles(): Promise<Battle[]> {
  const snapshot = await getDocs(battlesCollection);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      endsAt: data.endsAt?.toMillis?.() || data.endsAt
    } as Battle;
  });
}

export async function getBattleById(battleId: string): Promise<Battle | null> {
  const docRef = doc(db, 'battles', battleId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return { 
      id: docSnap.id, 
      ...data,
      endsAt: data.endsAt?.toMillis?.() || data.endsAt
    } as Battle;
  }
  return null;
}

export async function getTrendingBattles(limitCount: number = 5): Promise<Battle[]> {
  const q = query(
    battlesCollection, 
    where('status', 'in', ['hot', 'active']),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      endsAt: data.endsAt?.toMillis?.() || data.endsAt
    } as Battle;
  });
}

export async function getBattlesByUser(userId: string): Promise<Battle[]> {
  const snapshot = await getDocs(battlesCollection);
  return snapshot.docs
    .map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        endsAt: data.endsAt?.toMillis?.() || data.endsAt
      } as Battle;
    })
    .filter(battle => 
      battle.challenger?.id === userId || battle.defender?.id === userId
    );
}

export async function getTerritories(): Promise<Territory[]> {
  const snapshot = await getDocs(territoriesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Territory));
}

export async function updateBattleVotes(
  battleId: string, 
  side: 'challenger' | 'defender'
): Promise<void> {
  const docRef = doc(db, 'battles', battleId);
  const field = side === 'challenger' ? 'votesChallenger' : 'votesDefender';
  await updateDoc(docRef, { [field]: increment(1) });
}

export async function updateUserCoins(userId: string, amount: number): Promise<void> {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, { coins: increment(amount) });
}

export async function createBattle(battle: Omit<Battle, 'id'>): Promise<string> {
  const docRef = await addDoc(battlesCollection, {
    ...battle,
    endsAt: Timestamp.fromMillis(battle.endsAt)
  });
  return docRef.id;
}

export async function initializeSampleData(): Promise<void> {
  const usersSnapshot = await getDocs(usersCollection);
  if (usersSnapshot.empty) {
    console.log('Database is empty - please add data through Firebase Console');
  }
}

export async function signUp(email: string, password: string, username: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  const newUser: User = {
    id: firebaseUser.uid,
    username: username,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    coins: 500,
    reputation: 0,
    rank: 'Newcomer',
    role: 'Producer',
    duffles: [],
    unlockedVisualizers: ['Bars'],
    activeVisualizer: 'Bars'
  };
  
  await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
  return newUser;
}

export async function signIn(email: string, password: string): Promise<FirebaseUser> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
  return firebaseOnAuthStateChanged(auth, callback);
}

export { onSnapshot, query, where, orderBy, limit };
