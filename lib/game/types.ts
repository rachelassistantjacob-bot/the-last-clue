// --- Types for The Last Clue ---

export interface Suspect {
  id: string;
  name: string;
  role: string;
  personality: string;
  motive: string;
  avatar: string;
  alibi: string;
  alibiHole: boolean;
  alibiWitness?: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  atmosphere: string;
  icon: string;
}

export interface Weapon {
  id: string;
  name: string;
  description: string;
}

export interface Clue {
  id: string;
  text: string;
  roomId: string;
  roomName: string;
  type: 'direct' | 'herring';
  revealed: boolean;
}

export interface SuspectDialogue {
  question1: string;
  question2: string;
  question3: string;
}

export interface MysteryState {
  victim: Suspect;
  killer: Suspect;
  weapon: Weapon;
  murderRoom: Room;
  allSuspects: Suspect[];
  allRooms: Room[];
  allWeapons: Weapon[];
  suspectLocation: Record<string, string>;
  clues: Clue[];
  dialogue: Record<string, SuspectDialogue>;
}

export type GamePhase = 'intro' | 'explore' | 'room' | 'interview' | 'accusation' | 'gameover';

export interface GameState {
  phase: GamePhase;
  mystery: MysteryState | null;
  currentRoom: string | null;
  currentSuspect: string | null;
  discoveredClues: string[];
  interviewedSuspects: string[];
  visitedRooms: string[];
  accusation: { suspect: string; weapon: string; room: string } | null;
  gameResult: 'win' | 'lose' | null;
}

export type GameAction =
  | { type: 'START_GAME'; mystery: MysteryState }
  | { type: 'BEGIN_INVESTIGATION' }
  | { type: 'ENTER_ROOM'; roomId: string }
  | { type: 'DISCOVER_CLUES'; clues: Clue[] }
  | { type: 'START_INTERVIEW'; suspectId: string }
  | { type: 'RETURN_TO_ROOM' }
  | { type: 'RETURN_TO_MAP' }
  | { type: 'OPEN_ACCUSATION' }
  | { type: 'CLOSE_ACCUSATION' }
  | { type: 'MAKE_ACCUSATION'; suspect: string; weapon: string; room: string }
  | { type: 'ASK_QUESTION'; questionIndex: number; suspectId: string }
  | { type: 'NEW_GAME' };
