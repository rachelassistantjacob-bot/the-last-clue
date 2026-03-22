# Work Plan: "The Last Clue" — Procedural Murder Mystery Game

## Goal
Build a fully playable, procedural murder mystery browser game using Next.js 14 (App Router) + Tailwind CSS, deployable to Vercel. The game must be genuinely different each playthrough.

## Stack
- Next.js 14 App Router (no backend needed — client-side only)
- TypeScript
- Tailwind CSS
- No external APIs — all generation is client-side JS

## Architecture Overview

All game logic lives in `lib/game/` as pure TypeScript modules:
- `lib/game/data.ts` — Static pools (suspects, rooms, weapons, dialogues)
- `lib/game/engine.ts` — Mystery generation (random killer, weapon, room, clues)
- `lib/game/types.ts` — All TypeScript interfaces

UI lives in `app/` (App Router):
- `app/page.tsx` — Entry point, renders GameShell
- `app/layout.tsx` — Root layout (dark theme)
- `components/GameShell.tsx` — Main controller using useReducer
- `components/MansionMap.tsx` — Clickable room grid
- `components/RoomView.tsx` — Room exploration view
- `components/InterviewView.tsx` — Suspect interview dialog
- `components/EvidenceBoard.tsx` — Collected clues sidebar
- `components/AccusationModal.tsx` — Win/lose modal
- `components/GameOver.tsx` — Outcome screen

## Data Pools

### Suspects (8 total)
1. **Lord Ashford** (host, role: Nobleman) — greedy, pompous
2. **Lady Miriam** (wife, role: Socialite) — manipulative, charming
3. **Dr. Harlow** (physician, role: Doctor) — nervous, secretive
4. **Chef Beaumont** (cook, role: Chef) — hotheaded, resentful
5. **Miss Vance** (secretary, role: Secretary) — calculating, loyal
6. **Butler Graves** (servant, role: Butler) — stoic, observant
7. **Colonel Finch** (guest, role: Military) — brash, vindictive
8. **Helena Cross** (niece, role: Heir) — anxious, suspicious

### Weapons (6 total)
Candlestick, Poison Vial, Letter Opener, Rope, Crystal Decanter, Fireplace Poker

### Rooms (8 total)
Study, Library, Ballroom, Kitchen, Wine Cellar, Garden Terrace, Master Bedroom, Drawing Room

### Victim
Always one of the 8 suspects (not the killer). The victim is "found dead" at game start.

## Clue Generation Rules

Generate 6-8 clues per mystery:
- **2-3 direct clues**: Point toward killer, weapon, OR room (real)
- **2-3 red herrings**: Point toward innocent suspects (false trails)
- **1 alibi hole**: The killer's alibi has an inconsistency
- Each clue has: `id`, `text`, `room` (where found), `type` (direct/herring), `discovered: false`

Each suspect gets an alibi for the time of murder:
- Innocent suspects: solid alibis ("Was seen in the ballroom at 10pm by two witnesses")
- Killer: alibi with a hole ("Claims to have been in the study, but the butler saw them near the wine cellar")

## Mystery Generation (`generateMystery()`)

```typescript
function generateMystery(): MysteryState {
  // 1. Pick victim (random from suspects pool)
  // 2. Pick killer (random from remaining suspects)
  // 3. Pick weapon (random)
  // 4. Pick murder room (random)
  // 5. Generate alibis for each suspect
  // 6. Generate clues (pointing to correct solution + red herrings)
  // 7. Shuffle clue discovery across rooms
  // Return complete mystery state
}
```

## Game State (useReducer)

```typescript
type GameState = {
  phase: 'intro' | 'explore' | 'interview' | 'accusation' | 'gameover'
  mystery: MysteryState
  currentRoom: string | null
  currentSuspect: string | null
  discoveredClues: string[]  // clue ids
  interviewedSuspects: string[]
  visitedRooms: string[]
  accusation: { suspect: string; weapon: string; room: string } | null
  gameResult: 'win' | 'lose' | null
}
```

Actions: START_GAME, ENTER_ROOM, DISCOVER_CLUE, START_INTERVIEW, ASK_QUESTION, MAKE_ACCUSATION, NEW_GAME, RETURN_TO_MAP

## UI Design

**Dark detective noir theme:**
- Background: `bg-gray-950` (near black)
- Cards: `bg-gray-900` with `border-gray-800`
- Accent: Amber/gold (`amber-400`, `amber-500`) for clues and highlights
- Text: `text-gray-100` primary, `text-gray-400` secondary
- Murder victim: red badge
- Evidence board: scrollable sidebar with amber card per clue

**Layout (desktop):**
```
┌─────────────────────────────┬──────────────────┐
│  Main View (map/room/interview) │  Evidence Board  │
│                             │  (sticky sidebar) │
└─────────────────────────────┴──────────────────┘
```

**Layout (mobile):**
- Stacked vertically
- Evidence board as collapsible tab at bottom

## Files to Create/Modify

### Create:
1. `lib/game/types.ts` — All interfaces
2. `lib/game/data.ts` — Static data pools
3. `lib/game/engine.ts` — Mystery generation, clue generation
4. `components/GameShell.tsx` — Main controller
5. `components/MansionMap.tsx` — Room grid (8 rooms, click to explore)
6. `components/RoomView.tsx` — Room exploration, find clue button
7. `components/InterviewView.tsx` — Suspect dialogue with question choices
8. `components/EvidenceBoard.tsx` — Clue list sidebar
9. `components/AccusationModal.tsx` — Select suspect/weapon/room, submit
10. `components/SuspectCard.tsx` — Portrait card (emoji avatar, name, role, alibi)

### Modify:
1. `app/page.tsx` — Replace default with `<GameShell />`
2. `app/layout.tsx` — Set dark bg, font
3. `app/globals.css` — Keep Tailwind directives, remove default styles

## Implementation Steps

### Step 1: Types & Data (lib/game/)
Create `types.ts` with all interfaces, then `data.ts` with full suspect/room/weapon pools, then `engine.ts` with `generateMystery()`.

Verify: `tsc --noEmit` passes.

### Step 2: GameShell (core state)
Create `GameShell.tsx` with useReducer. Handles all state transitions. Renders child components based on phase.

### Step 3: MansionMap
8-room grid, each room clickable. Visited rooms get checkmark. Murder room shows skull after being visited.

### Step 4: RoomView
Shows room description. Lists suspects present (randomly assigned to rooms at mystery generation). Has "Search for clues" button — reveals any clues in that room. "Interview [Suspect]" button if suspect is here.

### Step 5: InterviewView
Shows suspect portrait (emoji + colored card), name, role, alibi. Player can ask:
- "Where were you when it happened?"
- "What do you know about [victim]?"
- "Did you see anything suspicious?"
Each question returns a pre-generated dialogue response (stored in mystery state).

### Step 6: EvidenceBoard
Fixed sidebar. Shows all discovered clues as cards. Each card: italic clue text, room found in. Empty state: "No clues yet."

### Step 7: AccusationModal
Triggered by "Make Accusation" button (always visible in header/sidebar). Three dropdowns: suspect, weapon, room. Submit button. Shows result (CORRECT / WRONG + solution reveal).

### Step 8: Polish
- Intro screen ("You've been called to Ashford Manor...")
- Win/lose outcome screen
- "New Case" button
- Mobile responsive (test with Tailwind sm: breakpoints)
- Loading spinner during mystery generation

### Step 9: Build Check
Run `npm run build` — must pass with no errors.

## Verification Steps

1. `npx tsc --noEmit` — No TypeScript errors
2. `npm run build` — Build succeeds
3. Manual check: GameShell renders without console errors
4. Manual check: generateMystery() produces different results on each call
5. Manual check: Accusation with correct killer/weapon/room → win
6. Manual check: Wrong accusation → lose with solution reveal

## Pitfalls to Avoid

1. **'use client' directive**: All interactive components need `'use client'` at top (App Router requirement)
2. **Math.random() in SSR**: Must call generateMystery() only client-side (in useEffect or event handler), NOT in server components
3. **TypeScript strict mode**: tsconfig.json has strict:true. All types must be explicit.
4. **Tailwind purge**: Only use standard Tailwind classes (no dynamic class construction like `bg-${color}-500`)
5. **Next.js 14 App Router**: No `getServerSideProps` or `getStaticProps` — use server components or client-side state

## Definition of Done

- [ ] All 8 suspects, 8 rooms, 6 weapons in data.ts
- [ ] generateMystery() produces unique mystery each call
- [ ] Full gameplay loop: explore → interview → accuse → outcome
- [ ] Evidence board tracks clues
- [ ] Win/lose conditions work
- [ ] "New Case" generates fresh mystery
- [ ] Mobile responsive
- [ ] `npm run build` passes
- [ ] Pushed to GitHub
