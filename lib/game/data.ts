// --- Data Pools for The Last Clue ---

import { Suspect, Room, Weapon, SuspectDialogue } from './types';

// 8 Suspects
export const suspects: Suspect[] = [
  {
    id: 'ashford',
    name: 'Lord Ashford',
    role: 'Host / Nobleman',
    personality: 'Greedy, pompous, always shows off his wealth',
    motive: 'Desperate for money, victim threatened to expose his financial troubles',
    avatar: '👑',
    alibi: 'Was in the library checking his investments on the antique telephone',
    alibiHole: false,
    alibiWitness: 'Chef Beaumont saw him there',
  },
  {
    id: 'miriam',
    name: 'Lady Miriam',
    role: 'Wife / Socialite',
    personality: 'Manipulative, charming, wraps everyone around her finger',
    motive: 'Victim discovered her affair and threatened to expose it',
    avatar: '💎',
    alibi: 'Was in the master bedroom preparing for dinner',
    alibiHole: false,
    alibiWitness: 'Butler Graves confirmed she was there',
  },
  {
    id: 'harlow',
    name: 'Dr. Harlow',
    role: 'Physician',
    personality: 'Nervous, secretive, always glancing around',
    motive: 'Victim found out about his illegal prescription practices',
    avatar: '💊',
    alibi: 'Was in the kitchen trying to calm his nerves with tea',
    alibiHole: false,
    alibiWitness: 'Miss Vance brought him tea',
  },
  {
    id: 'beaumont',
    name: 'Chef Beaumont',
    role: 'Chef',
    personality: 'Hotheaded,resentful of the wealthy',
    motive: 'Victim Fired him that afternoon over a minor mistake',
    avatar: '🍳',
    alibi: 'Was in the kitchen preparing hors d\'oeuvres',
    alibiHole: false,
    alibiWitness: 'Helena Cross saw him cooking',
  },
  {
    id: 'vance',
    name: 'Miss Vance',
    role: 'Secretary',
    personality: 'Calculating, observant, never misses a detail',
    motive: 'Victim refused to give her a raise she needed for her sick mother',
    avatar: '📝',
    alibi: 'Was in the study organizing the guest list',
    alibiHole: false,
    alibiWitness: 'Colonel Finch saw her at the study door',
  },
  {
    id: 'graves',
    name: 'Butler Graves',
    role: 'Butler',
    personality: 'Stoic, observant, has seen everything',
    motive: 'Victim threatened to fire him after 20 years of service',
    avatar: '🎩',
    alibi: 'Was in the dining room arranging silverware',
    alibiHole: false,
    alibiWitness: 'Lady Miriam saw him there',
  },
  {
    id: 'finch',
    name: 'Colonel Finch',
    role: 'Military Guest',
    personality: 'Brash, vindictive, holds grudges',
    motive: 'Victim insulted his military service in front of everyone',
    avatar: '⚔️',
    alibi: 'Was in the garden terrace smoking a cigar',
    alibiHole: false,
    alibiWitness: 'Lord Ashford saw him outside',
  },
  {
    id: 'cross',
    name: 'Helena Cross',
    role: 'Niece / Heir',
    personality: 'Anxious, suspicious, always watching',
    motive: 'Victim planned to change the will and leave her with nothing',
    avatar: '🎨',
    alibi: 'Was in the library reading a book',
    alibiHole: false,
    alibiWitness: 'Dr. Harlow saw her there',
  },
];

// 8 Rooms
export const rooms: Room[] = [
  {
    id: 'study',
    name: 'The Study',
    description: 'A dark wood-paneled room with a massive mahogany desk',
    atmosphere: 'Heavy silence and the smell of old leather',
    icon: '📖',
  },
  {
    id: 'library',
    name: 'The Library',
    description: 'Floor-to-ceiling bookshelves filled with leather-bound volumes',
    atmosphere: 'Dust motes floating in moonlight, centuries of secrets',
    icon: '📚',
  },
  {
    id: 'ballroom',
    name: 'The Ballroom',
    description: 'Grand space with a mirrored wall and polished oak floor',
    atmosphere: 'Echoing footsteps, faded elegance',
    icon: '💃',
  },
  {
    id: 'kitchen',
    name: 'The Kitchen',
    description: 'Sleek stainless steel appliances and stone countertops',
    atmosphere: 'Sizzling pans and the scent of exotic spices',
    icon: '🍳',
  },
  {
    id: 'cellar',
    name: 'The Wine Cellar',
    description: 'Cool stone walls lined with centuries of fine wines',
    atmosphere: 'Damp earth, aged oak, and intoxicating aromas',
    icon: '🍷',
  },
  {
    id: 'terrace',
    name: 'Garden Terrace',
    description: 'Open-air balcony overlooking manicured gardens',
    atmosphere: 'Night air, distant city lights, cigar smoke',
    icon: '🌿',
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    description: 'Opulent four-poster bed and a vanity with gold mirrors',
    atmosphere: 'Perfume lingering, expensive linens',
    icon: '🛏️',
  },
  {
    id: 'drawing',
    name: 'The Drawing Room',
    description: 'Elegant sitting area with velvet chaise lounges',
    atmosphere: 'Soft light, hushed conversations, hidden tensions',
    icon: '🎭',
  },
];

// 6 Weapons
export const weapons: Weapon[] = [
  {
    id: 'candlestick',
    name: 'Crystal Candlestick',
    description: 'Heavy crystal base with a silver Holder',
  },
  {
    id: 'poison',
    name: 'Poison Vial',
    description: 'Glass vial with a stopper, labeled "Laetrile"',
  },
  {
    id: 'opener',
    name: 'Letter Opener',
    description: 'Silver dagger-like letter opener',
  },
  {
    id: 'rope',
    name: 'Silk Rope',
    description: 'Fine braided rope from the ballroom curtain',
  },
  {
    id: 'decanter',
    name: 'Crystal Decanter',
    description: 'Heavy crystal container with spilled wine',
  },
  {
    id: 'poker',
    name: 'Fireplace Poker',
    description: 'Iron poker with a dragon handle',
  },
];

// Dialogue templates for each suspect
export const suspectDialogues: Record<string, SuspectDialogue> = {
  ashford: {
    question1: 'I was in the library checking my investments. The telephone rang several times—I had urgent business to attend to. Why do you ask?',
    question2: 'My dear[Repairing]-a rather irritating fellow. Always poking his nose where it doesn\'t belong. I told him he\'d regret it.',
    question3: 'Nothing unusual. Well, except that Dr. Harlow looked particularly nervous this evening. Keptdrinking his tea.',
  },
  miriam: {
    question1: 'I was upstairs in the master bedroom.准备 dinner. The butler can vouch for me. Some of us have standards to maintain.',
    question2: 'He was quiteルuding 讲. I\'m surprised he didn\'t cause more of a scene. He had a way of making enemies wherever he went.',
    question3: 'I saw Helena nervous as a cat in the library. She kept glancing toward the study. Something troubles her, I\'m sure of it.',
  },
  harlow: {
    question1: 'K-keep down my nerves. I\'ve been having such trouble with my nerves lately. The tea helped. Miss Vance brought it to me.',
    question2: 'Oh, he was a difficult patient. Demanding, always asking questions he shouldn\'t. I did what I had to do for my practice.',
    question3: 'I saw Colonel Finch outside, smoking. He looked rather... agitated. And Lady Miriam was hurry down the hall. Very hasty.',
  },
  beaumont: {
    question1: 'I was in the kitchen, preparing the hors d\'oeuvres. This is when I work. TheXi is not for me.',
    question2: 'He was bad-tempered, as usual. But I kept my head down. My food is my masterpiece; I don\'t get involved in guest dramas.',
    question3: 'I saw Helena sipping wine by herself. She looked like she was preparing for a speech. Or an escape.',
  },
  vance: {
    question1: 'I was in the study, updating the guest list. It kept me busy while the party guests mingled. Colonel Finch passed by the door.',
    question2: 'A tiresome man who couldn\'t appreciate proper hospitality. I expected trouble. I just didn\'t think it would be... this.',
    question3: 'Dr. Harlow looked pale when I brought him tea. He kept muttering about "the consequences." I knew something was wrong.',
  },
  graves: {
    question1: 'I was arranging the silver in the dining room, as is my routine. I never leave my duties unattended.',
    question2: 'A difficult employer often makes for an early grave, if you\'ll pardon the expression. He had a new request for me that I couldn\'t fulfill.',
    question3: 'Lord Ashford was very agitated. He kept looking at the study door. I thought he was waiting for a confrontation.',
  },
  finch: {
    question1: 'Outdoors. I need my air. That terrace is the only place with any peace in this... place. The cigar helped clear my thoughts.',
    question2: 'He was a fool. Applied for a commission I deserved. I told him so. But I didn\'t kill him for that—too easy, too obvious.',
    question3: 'I saw Lady Miriam slip upstairs. She looked... secretive. And Dr. Harlow was in the kitchen, sweating like a horse.',
  },
  cross: {
    question1: 'I was reading in the library. Trying to forget the rules of this house. The silence helped until... until it didn\'t.',
    question2: 'He was cruel. Threatened to cut me off entirely if I didn\'t leave the will alone. I just wanted my inheritance.',
    question3: 'I saw Colonel Finch outside when I went for air. He was waving his arms. And Dr. Harlow was muttering to himself in the kitchen.',
  },
};
