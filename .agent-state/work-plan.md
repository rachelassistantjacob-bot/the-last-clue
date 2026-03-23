# Work Plan — Fix 5 Playtest Bugs in The Last Clue

## Goal
Fix all 5 reported bugs so that: clues appear on evidence board, Helena has a proper emoji, visited rooms are visually distinct, victim is excluded from accusation, and rooms contain discoverable physical clues.

## Files to Modify
1. `lib/game/data.ts` — Fix Helena emoji
2. `components/MansionMap.tsx` — Add visitedRooms visual distinction
3. `components/GameShell.tsx` — Wire interview clues, fix accusation filter, pass visitedRooms
4. `components/InterviewView.tsx` — Add onDiscoverClue callback, make questions clickable and dispatch clues
5. `lib/game/engine.ts` — Distribute physical clues to all rooms

---

## Tasks

### Task 1: Fix Helena Cross emoji (Bug 2)
**File:** `lib/game/data.ts`
**Change:** Find the `cross` suspect entry. Change `avatar: '她们'` to `avatar: '🎨'`
**Verification:** Run `grep -n "她们" lib/game/data.ts` — should return nothing

---

### Task 2: Filter victim from accusation dropdown (Bug 4)
**File:** `components/GameShell.tsx`
**Change:** In the `AccusationModal` JSX block, filter the victim out:
```tsx
suspects={mystery.allSuspects
  .filter(s => s.id !== mystery.victim.id)
  .map(s => ({ id: s.id, name: s.name, avatar: s.avatar }))}
```
**Verification:** Visually inspect — victim id is `'ashford'`, they should not appear in the dropdown.

---

### Task 3: Add visited room indicators (Bug 3)
**File:** `components/MansionMap.tsx`
**Change:** 
1. Add `visitedRooms: string[]` to the props interface
2. In the room card, check if `visitedRooms.includes(room.id)` and apply a visited style:
   - Add a green checkmark badge or green border when visited
   - Slightly dim the card with `opacity-75` or `bg-gray-800` instead of `bg-gray-900`

Example:
```tsx
interface MansionMapProps {
  rooms: Room[];
  visitedRooms: string[];
  onEnterRoom: (roomId: string) => void;
}
// In JSX:
const isVisited = visitedRooms.includes(room.id);
// card className: add `border-green-800/50` and `opacity-80` when isVisited
// Add a small badge: {isVisited && <span className="text-xs text-green-500">✓ Visited</span>}
```

**File:** `components/GameShell.tsx`
**Change:** Pass `visitedRooms={visitedRooms}` to `<MansionMap>` (it's already in scope from destructuring)

**Verification:** `grep -n "visitedRooms" components/MansionMap.tsx` should show the prop and usage.

---

### Task 4: Wire interview clues to evidence board (Bug 1)
**Root cause:** `InterviewView` renders answers but has no callback when a question is clicked. `isQuestionAsked` is hardcoded to `() => false`. No clue is ever added when dialogue is viewed.

**File:** `components/InterviewView.tsx`
**Changes:**
1. Add `onQuestionAsked?: (questionIndex: number, answer: string) => void` to props interface
2. Track local state: `const [askedQuestions, setAskedQuestions] = useState<Set<number>>(new Set())`
3. On each question click, if not already asked: call `onQuestionAsked(index, answers[index])`, add to local set
4. Remove the `isQuestionAsked` prop (hardcoded to false, useless) OR keep but use local state
5. Style asked questions as revealed/dimmed

**File:** `components/GameShell.tsx`
**Changes:**
1. Add `onQuestionAsked` handler:
```tsx
const handleQuestionAsked = (questionIndex: number, suspectId: string, answer: string) => {
  if (!mystery) return;
  const suspect = mystery.allSuspects.find(s => s.id === suspectId);
  if (!suspect) return;
  const clue: Clue = {
    id: `interview-${suspectId}-${questionIndex}`,
    text: answer,
    roomId: currentRoom || 'unknown',
    roomName: mystery.allRooms.find(r => r.id === currentRoom)?.name || 'Interview',
    type: 'direct',
    revealed: true,
  };
  dispatch({ type: 'DISCOVER_CLUES', clues: [clue] });
};
```
2. Pass to InterviewView:
```tsx
onQuestionAsked={(questionIndex, answer) => handleQuestionAsked(questionIndex, currentSuspect!, answer)}
```

**Verification:** After implementing, the evidence board count should increase when dialogue is clicked.

---

### Task 5: Add physical room clues (Bug 5)
**Root cause:** `generateClues` in `engine.ts` only puts clues in the murder room (3 clues) and 3 herring rooms (at index 0,1,2). Rooms 3,5,6,7 have no clues. Also, the search button only appears for `isNewRoom` and only the already-filtered (empty) clues are shown.

**File:** `lib/game/engine.ts`
**Change in `generateClues`:** After the existing clues, add physical evidence clues for each room:

```ts
// Physical room clues — one per room
const roomPhysicalClues: Record<string, string> = {
  study: 'A torn letter on the desk reveals a heated argument over finances',
  library: 'A bookmark left in a book on poisons — someone was researching methods',
  ballroom: 'Muddy footprints on the polished floor lead toward the study',
  kitchen: 'A knocked-over spice rack and fresh blood on the counter',
  cellar: 'An empty wine bottle with a cloth stopper — could have held poison',
  terrace: 'A half-smoked cigar with unusual burn marks near the railing',
  bedroom: 'A hidden compartment in the vanity contains a threatening note',
  drawing: 'Overturned furniture and a broken vase — signs of a struggle',
};

rooms.forEach((room) => {
  const clueText = roomPhysicalClues[room.id];
  if (clueText) {
    clues.push({
      id: generateId(),
      text: clueText,
      roomId: room.id,
      roomName: room.name,
      type: 'herring' as const,
      revealed: false,
    });
  }
});
```

Also check `RoomView.tsx` — the `onSearch` in GameShell currently passes `roomClues.filter(c => discoveredClues.includes(c.id))` which is the DISCOVERED ones, not the undiscovered ones. This is already being passed as the `clues` prop for displaying. The `onSearch` in GameShell passes ALL roomClues. Let's verify:

In `GameShell.tsx`:
```tsx
onSearch={() => {
  const newClues = roomClues.map(c => ({ ...c, revealed: true }));
  handleDiscoverClues(newClues);
}}
```
`roomClues` here is `mystery.clues.filter(c => c.roomId === currentRoom)` — this is ALL room clues (not filtered by discovered). So the search should work once clues exist in each room. Good.

But also: `RoomView` shows "Search for Clues" button only when `isNewRoom`. After the first search, `isNewRoom` becomes false (room is in visitedRooms). But the clues are already discovered — they'll show in the EvidenceBoard. So this flow is actually OK once room clues exist.

Wait — there's another issue: `RoomView` takes `clues={roomClues.filter(c => discoveredClues.includes(c.id))}`. The `clues` prop in RoomView is for showing DISCOVERED clues IN the room. The search button calls `onSearch` which discovers them. This is fine.

**Verification:** After adding physical clues to engine, enter any room, click "Search for Clues" — the evidence board should show a clue.

---

## Verification Commands (Run After All Changes)

```bash
# 1. Helena emoji fixed
grep -n "她们" lib/game/data.ts && echo "FAIL: still has bad emoji" || echo "PASS: emoji fixed"

# 2. Check MansionMap has visitedRooms prop
grep -n "visitedRooms" components/MansionMap.tsx | wc -l

# 3. Check victim filter in GameShell
grep -n "victim.id" components/GameShell.tsx

# 4. Check InterviewView has onQuestionAsked
grep -n "onQuestionAsked" components/InterviewView.tsx

# 5. Check engine has room physical clues
grep -n "roomPhysicalClues\|Physical" lib/game/engine.ts

# 6. Build passes
npm run build
```

## Pitfalls
- `InterviewView` currently uses `isQuestionAsked: () => false`. Remove this dead code or replace with local state.
- Don't break the `Clue` type — ensure interview clues match the interface.
- `roomClues` in GameShell is computed outside the JSX — make sure it still filters correctly.
- The `MansionMap` visitedRooms prop must be optional or GameShell will fail TypeScript.
- `onSearch` in `RoomView` signature is `(clues: Clue[]) => void` but GameShell ignores the argument and uses its own `roomClues`. This is intentional — don't change it.
