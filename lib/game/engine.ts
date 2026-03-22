// --- Mystery Generation Engine for The Last Clue ---

import { Suspect, Room, Weapon, Clue, MysteryState, SuspectDialogue } from './types';
import { suspects, rooms, weapons, suspectDialogues } from './data';

// Simple unique ID generator
let uniqueIdCounter = 0;
function generateId(): string {
  return `id-${Date.now()}-${uniqueIdCounter++}`;
}

// Helper: Shuffle array
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate alibis for all suspects (killer gets alibi with hole)
function generateAlibis(killerId: string, allSuspects: Suspect[]): Suspect[] {
  return allSuspects.map((suspect) => {
    if (suspect.id === killerId) {
      return {
        ...suspect,
        alibiHole: true,
      };
    }
    return suspect;
  });
}

// Generate clues
function generateClues(
  killer: Suspect,
  weapon: Weapon,
  murderRoom: Room,
  allSuspects: Suspect[]
): Clue[] {
  const clues: Clue[] = [];
  
  // Direct clues
  clues.push({
    id: generateId(),
    text: `The ${weapon.name} was found near the body, hidden behind a curtain in the ${murderRoom.name}`,
    roomId: murderRoom.id,
    roomName: murderRoom.name,
    type: 'direct',
    revealed: false,
  });

  clues.push({
    id: generateId(),
    text: `A witness saw ${killer.name} arguing with the victim in the ${murderRoom.name} shortly before the murder`,
    roomId: murderRoom.id,
    roomName: murderRoom.name,
    type: 'direct',
    revealed: false,
  });

  clues.push({
    id: generateId(),
    text: `${killer.name} was seen near the ${murderRoom.name} earlier, claiming they were "checking something"`,
    roomId: murderRoom.id,
    roomName: murderRoom.name,
    type: 'direct',
    revealed: false,
  });

  // Red herrings (innocent suspects with suspicious activity)
  const innocentSuspects = allSuspects.filter((s) => s.id !== killer.id);
  const shuffledInnocent = shuffle(innocentSuspects).slice(0, 3);

  shuffledInnocent.forEach((suspect, index) => {
    clues.push({
      id: generateId(),
      text: `${suspect.name} was seen acting nervous in the ${rooms[index % rooms.length].name} around the time of the murder`,
      roomId: rooms[index % rooms.length].id,
      roomName: rooms[index % rooms.length].name,
      type: 'herring',
      revealed: false,
    });
  });

  // Alibi hole clue
  clues.push({
    id: generateId(),
    text: `The butler overheard ${killer.name} near the ${rooms[4].name} (wine cellar) when they claimed to be elsewhere`,
    roomId: rooms[4].id,
    roomName: rooms[4].name,
    type: 'direct',
    revealed: false,
  });

  return shuffle(clues);
}

// Assign suspects to rooms
function assignSuspectsToRooms(
  allSuspects: Suspect[],
  murderRoom: Room,
  killerId: string
): Record<string, string> {
  const assignment: Record<string, string> = {};
  
  assignment[allSuspects.find((s) => s.id === 'ashford')!.id] = murderRoom.id;
  
  const otherRooms = rooms.filter((r) => r.id !== murderRoom.id);
  const killerRoom = otherRooms[Math.floor(Math.random() * otherRooms.length)];
  assignment[killerId] = killerRoom.id;
  
  const remainingRooms = [...rooms];
  const remainingSuspects = allSuspects.filter((s) => s.id !== 'ashford' && s.id !== killerId);
  
  remainingSuspects.forEach((suspect, index) => {
    const roomIndex = index % remainingRooms.length;
    assignment[suspect.id] = remainingRooms[roomIndex].id;
  });
  
  return assignment;
}

// Main mystery generation function
export function generateMystery(): MysteryState {
  const victim = suspects[0];
  const remainingSuspects = suspects.filter((s) => s.id !== victim.id);
  const killer = remainingSuspects[Math.floor(Math.random() * remainingSuspects.length)];
  
  const weapon = weapons[Math.floor(Math.random() * weapons.length)];
  const murderRoom = rooms[Math.floor(Math.random() * rooms.length)];
  const allSuspectsWithAlibis = generateAlibis(killer.id, suspects);
  const suspectLocation = assignSuspectsToRooms(suspects, murderRoom, killer.id);
  
  const dialogue: Record<string, SuspectDialogue> = {};
  suspects.forEach((suspect) => {
    dialogue[suspect.id] = suspectDialogues[suspect.id] || {
      question1: 'I was elsewhere at the time.',
      question2: 'The victim was a difficult man.',
      question3: 'I didn\'t notice anything unusual.',
    };
  });
  
  const clues = generateClues(killer, weapon, murderRoom, suspects);
  
  return {
    victim,
    killer,
    weapon,
    murderRoom,
    allSuspects: allSuspectsWithAlibis,
    allRooms: rooms,
    allWeapons: weapons,
    suspectLocation,
    clues,
    dialogue,
  };
}
