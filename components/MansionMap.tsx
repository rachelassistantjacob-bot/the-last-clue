'use client';

import { Room } from '@/lib/game/types';

interface MansionMapProps {
  rooms: Room[];
  onEnterRoom: (roomId: string) => void;
}

export default function MansionMap({ rooms, onEnterRoom }: MansionMapProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          onClick={() => onEnterRoom(room.id)}
          className="bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 hover:border-amber-700 group"
        >
          <div className="text-4xl mb-3">{room.icon}</div>
          <h3 className="text-lg font-semibold text-gray-100 mb-1">{room.name}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{room.description}</p>
        </div>
      ))}
    </div>
  );
}
