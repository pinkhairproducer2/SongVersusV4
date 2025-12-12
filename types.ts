
export interface Duffle {
  id: string;
  acquiredAt: number;
  unlocksAt: number;
  status: 'locked' | 'ready' | 'opened';
  type: 'Standard' | 'Gold' | 'Diamond';
}

export type VisualizerType = 'Bars' | 'Wave' | 'Orb';

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  coins: number; 
  reputation: number;
  duffles: Duffle[]; 
  rank: string;
  crew?: string;
  bio?: string;
  wins?: number;
  losses?: number;
  role: 'Artist' | 'Producer';
  unlockedVisualizers?: VisualizerType[];
  activeVisualizer?: VisualizerType;
}

export interface Battle {
  id: string;
  title: string;
  genre: string;
  challenger: User;
  defender?: User;
  endsAt: number; // Changed from timeLeft string to timestamp
  votesChallenger: number;
  votesDefender: number;
  status: 'active' | 'ended' | 'hot' | 'open';
  coverImage?: string;
  audioPreviewUrl?: string;
  bpm: number;
  entryFee: number;
  type: 'BEAT' | 'SONG';
}

export interface Territory {
  id: string;
  name: string;
  genre: string;
  control: string; // User/Crew name
  color: string;
  battleCount: number;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  isBot?: boolean;
}
