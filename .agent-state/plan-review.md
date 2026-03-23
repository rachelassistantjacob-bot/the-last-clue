# Plan Review

## NEEDS_REVISION

The plan covers the right files and identifies the correct root causes, but has **two critical bugs** that will cause the implementation to silently fail. The clue wiring (Bug 1) and room search (Bug 5) fixes will appear to work at code level but won't produce visible results for the player.

---

## Critical Issues

### 1. Interview clues will NEVER appear on the Evidence Board (Task 4 — broken)

The plan creates new `Clue` objects in `handleQuestionAsked` and dispatches `DISCOVER_CLUES`. But look at what `DISCOVER_CLUES` actually does:

```tsx
// Reducer — only stores IDs, not clue objects
case 'DISCOVER_CLUES': {
  const newClueIds = action.clues
    .filter((c) => !state.discoveredClues.includes(c.id))
    .map((c) => c.id);
  return {
    ...state,
    discoveredClues: [...state.discoveredClues, ...newClueIds],
  };
}
```

Then the EvidenceBoard receives:
```tsx
clues={mystery.clues.filter((c) => discoveredClues.includes(c.id))}
```

**The problem:** `mystery.clues` is set once during `generateMystery()` and never modified. Interview clues created in `handleQuestionAsked` are ephemeral — their IDs get stored in `discoveredClues`, but the actual clue objects don't exist in `mystery.clues`. The EvidenceBoard filter will never find them.

**Fix options (pick one):**
- **A) Add a `dynamicClues: Clue[]` array to `GameState`** that accumulates interview clues, and change EvidenceBoard to filter against `[...mystery.clues, ...dynamicClues]`
- **B) Pre-generate interview clues in `generateMystery()`** and add them to `mystery.clues` with `revealed: false`, so `DISCOVER_CLUES` just reveals them by ID (matching the existing pattern for room clues)

Option B is cleaner — it matches how room clues already work and requires no state shape changes.

### 2. "Search for Clues" button NEVER appears (Task 5 depends on this)

The `ENTER_ROOM` reducer adds the room to `visitedRooms` **in the same dispatch** as setting `currentRoom`:

```tsx
case 'ENTER_ROOM': {
  const visitedRooms = state.visitedRooms.includes(action.roomId)
    ? state.visitedRooms
    : [...state.visitedRooms, action.roomId];
  return {
    ...state,
    currentRoom: action.roomId,
    visitedRooms,         // ← room already marked visited
    phase: 'room',
  };
}
```

Then in JSX:
```tsx
isNewRoom={!visitedRooms.includes(currentRoom!)}  // ← ALWAYS false
```

The room is added to `visitedRooms` before the component renders, so `isNewRoom` is always `false`, and the "Search for Clues" button **never appears**. Adding physical clues per room (Task 5) is useless if the search button is invisible.

**Fix:** Either:
- **A)** Change the check to `isNewRoom={!state.discoveredClues.some(id => roomClues.some(c => c.id === id))}` — show button when room has undiscovered clues, not based on visit status
- **B)** Track "searched rooms" separately from "visited rooms" — visit on enter, mark searched only after clicking search
- **C)** Always show the search button (remove `isNewRoom` gate entirely) and disable it when all room clues are already discovered

Option A or C is simplest. Option B is cleanest from a gameplay perspective.

---

## Important Issues

### 3. Missing `useState` import in InterviewView (Task 4 — TypeScript will fail)

The plan adds `useState` usage (`const [askedQuestions, setAskedQuestions] = useState(...)`) but `InterviewView.tsx` currently has **no React imports at all** — it's a pure component. Need to add:
```tsx
import { useState } from 'react';
```

### 4. Duplicate dialogue data — potential confusion

`InterviewView.tsx` has its own hardcoded `dialogue` Record (lines 26-75), completely separate from `suspectDialogues` in `data.ts`. The `data.ts` version has garbled text (Chinese characters mixed in: `"准备"`, `"ルuding 讲"`, `"TheXi"`). The plan doesn't mention which dialogue source to use or whether to consolidate. This isn't a blocker but will cause maintenance confusion.

**Recommendation:** Delete the hardcoded dialogue from InterviewView and use the `dialogue` prop from `mystery.dialogue` (already available on `MysteryState`). But first fix the garbled text in `data.ts`.

### 5. Verification step 6 (`npm run build`) should be step 1, not last

Run the build BEFORE making changes to establish a baseline. If the build is already broken, you need to know that upfront.

---

## Minor Issues

### 6. `onSearch` signature mismatch in RoomView

The plan correctly notes this is intentional (GameShell ignores the argument). But `RoomView.handleSearch` reconstructs clues from `clues` (which is already-discovered clues), hardcoding `type: 'direct'`. This means if the search button DID work, RoomView would pass already-discovered clues back. The actual discovery happens in GameShell's `onSearch` closure which uses `roomClues`. This works but is confusing — a code comment would help.

### 7. MansionMap `visitedRooms` should NOT be optional

The plan says "The MansionMap visitedRooms prop must be optional or GameShell will fail TypeScript." This is wrong — GameShell always has `visitedRooms` (initialized as `[]` in `initialState`). Making the prop required is fine and safer.

### 8. Helena emoji choice

`'🎨'` works but is generic. Since Helena is described as "Niece / Heir" who is "Anxious, suspicious, always watching," something like `'🎭'` (drama masks — fits her suspicious nature) might be better. But `'🎭'` is already used for the Drawing Room icon. `'🖼️'` (framed picture) or `'💐'` could work. Minor aesthetic choice — not a blocker.

Wait — `'🎨'` actually works fine if her name is "Helena Cross" and she's the niece/artist type. Ignore this.

---

## Files Checklist

| File | Listed? | Actually needs changes? | Notes |
|------|---------|------------------------|-------|
| `lib/game/data.ts` | ✅ | ✅ | Fix emoji + fix garbled suspectDialogues text |
| `components/MansionMap.tsx` | ✅ | ✅ | Add visitedRooms prop |
| `components/GameShell.tsx` | ✅ | ✅ | Multiple changes + fix isNewRoom bug |
| `components/InterviewView.tsx` | ✅ | ✅ | Add useState import, onQuestionAsked |
| `lib/game/engine.ts` | ✅ | ✅ | Add physical clues + pre-generate interview clues (if using fix B for Critical #1) |
| `lib/game/types.ts` | ❌ | Maybe | If using fix A for Critical #1, needs `dynamicClues` on GameState |
| `components/RoomView.tsx` | ❌ | Maybe | If changing isNewRoom logic to always-show-search |
| `components/EvidenceBoard.tsx` | ❌ | Should verify | Plan never checks if EvidenceBoard renders clue types correctly |

---

## Summary

The plan's structure is good and the bug identification is accurate. But the two critical issues (interview clues invisible on evidence board, search button never appears) mean the implementation would silently fail on 2 of 5 bugs. Fix those architectural issues before implementing.

**Recommended revision order:**
1. Fix Critical #2 (isNewRoom) first — this unblocks Task 5
2. Fix Critical #1 (clue storage) — this unblocks Task 4
3. Then proceed with Tasks 1-5 as written (with the useState import fix)
4. Run `npm run build` before AND after
