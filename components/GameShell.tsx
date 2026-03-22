'use client';

import { useReducer, useEffect } from 'react';
import { generateMystery } from '@/lib/game/engine';
import { GameState, GameAction, Clue } from '@/lib/game/types';
import MansionMap from './MansionMap';
import RoomView from './RoomView';
import InterviewView from './InterviewView';
import EvidenceBoard from './EvidenceBoard';
import AccusationModal from './AccusationModal';
import GameOver from './GameOver';

// Initial state
const initialState: GameState = {
  phase: 'intro',
  mystery: null,
  currentRoom: null,
  currentSuspect: null,
  discoveredClues: [],
  interviewedSuspects: [],
  visitedRooms: [],
  accusation: null,
  gameResult: null,
};

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      return {
        ...state,
        mystery: action.mystery,
        phase: 'intro',
      };
    }
    case 'BEGIN_INVESTIGATION': {
      return {
        ...state,
        phase: 'explore',
      };
    }
    case 'ENTER_ROOM': {
      const room = state.mystery?.allRooms.find((r) => r.id === action.roomId);
      if (!room) return state;
      
      const visitedRooms = state.visitedRooms.includes(action.roomId)
        ? state.visitedRooms
        : [...state.visitedRooms, action.roomId];
      
      return {
        ...state,
        currentRoom: action.roomId,
        visitedRooms,
        phase: 'room',
      };
    }
    case 'DISCOVER_CLUES': {
      const newClueIds = action.clues
        .filter((c) => !state.discoveredClues.includes(c.id))
        .map((c) => c.id);
      
      return {
        ...state,
        discoveredClues: [...state.discoveredClues, ...newClueIds],
      };
    }
    case 'START_INTERVIEW': {
      return {
        ...state,
        currentSuspect: action.suspectId,
        interviewedSuspects: state.interviewedSuspects.includes(action.suspectId)
          ? state.interviewedSuspects
          : [...state.interviewedSuspects, action.suspectId],
        phase: 'interview',
      };
    }
    case 'RETURN_TO_ROOM': {
      return {
        ...state,
        phase: 'room',
      };
    }
    case 'RETURN_TO_MAP': {
      return {
        ...state,
        currentRoom: null,
        currentSuspect: null,
        phase: 'explore',
      };
    }
    case 'OPEN_ACCUSATION': {
      return {
        ...state,
        phase: 'accusation',
      };
    }
    case 'CLOSE_ACCUSATION': {
      return {
        ...state,
        phase: 'explore',
      };
    }
    case 'MAKE_ACCUSATION': {
      if (!state.mystery) return state;
      
      const isCorrect =
        action.suspect === state.mystery.killer.id &&
        action.weapon === state.mystery.weapon.id &&
        action.room === state.mystery.murderRoom.id;
      
      return {
        ...state,
        accusation: {
          suspect: action.suspect,
          weapon: action.weapon,
          room: action.room,
        },
        gameResult: isCorrect ? 'win' : 'lose',
        phase: 'gameover',
      };
    }
    case 'NEW_GAME': {
      const mystery = generateMystery();
      return {
        ...initialState,
        phase: 'intro',
        mystery,
      };
    }
    default:
      return state;
  }
}

export default function GameShell() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { phase, mystery, currentRoom, currentSuspect, discoveredClues, visitedRooms } = state;

  // Initialize mystery on mount (client-side only)
  useEffect(() => {
    const mystery = generateMystery();
    dispatch({ type: 'START_GAME', mystery });
  }, []);

  const handleBeginInvestigation = () => {
    dispatch({ type: 'BEGIN_INVESTIGATION' });
  };

  const handleEnterRoom = (roomId: string) => {
    dispatch({ type: 'ENTER_ROOM', roomId });
  };

  const handleDiscoverClues = (clues: Clue[]) => {
    dispatch({ type: 'DISCOVER_CLUES', clues });
  };

  const handleStartInterview = (suspectId: string) => {
    dispatch({ type: 'START_INTERVIEW', suspectId });
  };

  const handleReturnToRoom = () => {
    dispatch({ type: 'RETURN_TO_ROOM' });
  };

  const handleReturnToMap = () => {
    dispatch({ type: 'RETURN_TO_MAP' });
  };

  const handleOpenAccusation = () => {
    dispatch({ type: 'OPEN_ACCUSATION' });
  };

  const handleCloseAccusation = () => {
    dispatch({ type: 'CLOSE_ACCUSATION' });
  };

  const handleMakeAccusation = (suspect: string, weapon: string, room: string) => {
    dispatch({ type: 'MAKE_ACCUSATION', suspect, weapon, room });
  };

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  const handleQuestionAsked = (questionIndex: number, answer: string) => {
    if (!mystery || !currentSuspect || !currentRoom) return;
    const clue: Clue = {
      id: `interview-${currentSuspect}-${questionIndex}`,
      text: answer,
      roomId: currentRoom,
      roomName: mystery.allRooms.find(r => r.id === currentRoom)?.name || 'Interview',
      type: 'direct' as const,
      revealed: true,
    };
    dispatch({ type: 'DISCOVER_CLUES', clues: [clue] });
  };

  // Get current room data
  const currentRoomData = mystery?.allRooms.find((r) => r.id === currentRoom);
  
  // Get suspects in current room
  const suspectsInCurrentRoom = mystery?.allSuspects.filter((s) => {
    if (!currentRoom) return false;
    return mystery.suspectLocation[s.id] === currentRoom;
  });

  // Get clues for current room
  const roomClues = mystery && currentRoom
    ? mystery.clues.filter((c) => c.roomId === currentRoom)
    : [];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-500">The Last Clue</h1>
          {mystery && (
            <button
              onClick={handleOpenAccusation}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Make Accusation
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {phase === 'intro' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <h2 className="text-4xl font-bold text-gray-100">Ashford Manor</h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              The body of Lord Ashford has been discovered in one of the mansions rooms.
              Blood stains the floor and the murder weapon is nowhere to be found.
            </p>
            <p className="text-lg text-gray-300">
              Each of the 8 guests and staff has an alibi—but not all are telling the truth.
              Search the mansion, interview suspects, and collect clues to find the killer.
            </p>
            <button
              onClick={handleBeginInvestigation}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-amber-900/50"
            >
              Begin Investigation
            </button>
          </div>
        )}

        {phase === 'explore' && mystery && (
          <div className="flex gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4 text-amber-500">Explore the Mansion</h2>
              <MansionMap rooms={mystery.allRooms} visitedRooms={visitedRooms} onEnterRoom={handleEnterRoom} />
            </div>
            <EvidenceBoard clues={mystery.clues.filter((c) => discoveredClues.includes(c.id))} />
          </div>
        )}

        {phase === 'room' && mystery && currentRoomData && suspectsInCurrentRoom && (
          <RoomView
            room={currentRoomData}
            suspects={suspectsInCurrentRoom.map(s => ({
              id: s.id,
              name: s.name,
              role: s.role,
              avatar: s.avatar,
            }))}
            onSearch={() => {
              const newClues = roomClues.map(c => ({ ...c, revealed: true }));
              handleDiscoverClues(newClues);
            }}
            onInterview={handleStartInterview}
            onBack={handleReturnToMap}
            clues={roomClues.filter(c => discoveredClues.includes(c.id))}
            isNewRoom={!visitedRooms.includes(currentRoom!)}
          />
        )}

        {phase === 'interview' && mystery && (
          <InterviewView
            suspect={mystery.allSuspects.find((s) => s.id === currentSuspect)!}
            victim={mystery.victim}
            onBack={handleReturnToRoom}
            onQuestionAsked={handleQuestionAsked}
          />
        )}

        {phase === 'accusation' && mystery && (
          <AccusationModal
            suspects={mystery.allSuspects
              .filter(s => s.id !== mystery.victim.id)
              .map(s => ({
                id: s.id,
                name: s.name,
                avatar: s.avatar,
              }))}
            weapons={mystery.allWeapons.map(w => ({
              id: w.id,
              name: w.name,
            }))}
            rooms={mystery.allRooms.map(r => ({
              id: r.id,
              name: r.name,
              icon: r.icon,
            }))}
            onClose={handleCloseAccusation}
            onSubmit={handleMakeAccusation}
          />
        )}

        {phase === 'gameover' && mystery && (
          <GameOver
            result={state.gameResult!}
            mystery={mystery}
            accusation={state.accusation}
            onNewGame={handleNewGame}
          />
        )}
      </main>
    </div>
  );
}
