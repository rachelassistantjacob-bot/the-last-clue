'use client';

import { Room, Clue } from '@/lib/game/types';

interface RoomViewProps {
  room: Room;
  suspects: { id: string; name: string; role: string; avatar: string }[];
  onSearch: (clues: Clue[]) => void;
  onInterview: (suspectId: string) => void;
  onBack: () => void;
  clues: { id: string; text: string; revealed: boolean }[];
  isNewRoom: boolean;
}

export default function RoomView({
  room,
  suspects,
  onSearch,
  onInterview,
  onBack,
  clues,
  isNewRoom,
}: RoomViewProps) {
  const handleSearch = () => {
    onSearch(
      clues.map((c) => ({
        id: c.id,
        text: c.text,
        roomId: room.id,
        roomName: room.name,
        type: 'direct' as const,
        revealed: true,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-amber-500 transition-colors"
      >
        ← Back to Map
      </button>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">{room.icon}</div>
          <div>
            <h2 className="text-2xl font-bold text-amber-500">{room.name}</h2>
            <p className="text-gray-400 text-sm">{room.atmosphere}</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-6">{room.description}</p>
        
        {isNewRoom && (
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Search for Clues
          </button>
        )}
      </div>

      {suspects.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">People in this room:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suspects.map((suspect) => (
              <button
                key={suspect.id}
                onClick={() => onInterview(suspect.id)}
                className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="text-3xl">{suspect.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-100">{suspect.name}</div>
                  <div className="text-sm text-gray-400">{suspect.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
