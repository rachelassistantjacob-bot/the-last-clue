'use client';

import { Room } from '@/lib/game/types';

interface MansionMapProps {
  rooms: Room[];
  visitedRooms?: string[];
  onEnterRoom: (roomId: string) => void;
}

export default function MansionMap({ rooms, visitedRooms = [], onEnterRoom }: MansionMapProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {rooms.map((room) => {
        const isVisited = visitedRooms.includes(room.id);
        return (
          <div
            key={room.id}
            onClick={() => onEnterRoom(room.id)}
            className={`${
              isVisited 
                ? 'bg-gray-800 border-green-700 opacity-80' 
                : 'bg-gray-900 hover:bg-gray-800 border-gray-800'
            } border rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 hover:border-amber-700 group`}
          >
            <div className="flex items-center justify-between">
              <div className="text-4xl mb-3">{room.icon}</div>
              {isVisited && (
                <span className="text-xs text-green-500 font-bold">✓</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-1">{room.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{room.description}</p>
          </div>
        );
      })}
    </div>
  );
}
