'use client';

import { useState } from 'react';

interface AccusationModalProps {
  suspects: { id: string; name: string; avatar: string }[];
  weapons: { id: string; name: string }[];
  rooms: { id: string; name: string; icon: string }[];
  onClose: () => void;
  onSubmit: (suspect: string, weapon: string, room: string) => void;
}

export default function AccusationModal({
  suspects,
  weapons,
  rooms,
  onClose,
  onSubmit,
}: AccusationModalProps) {
  const [selectedSuspect, setSelectedSuspect] = useState<string>('');
  const [selectedWeapon, setSelectedWeapon] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  const handleSubmit = () => {
    if (selectedSuspect && selectedWeapon && selectedRoom) {
      onSubmit(selectedSuspect, selectedWeapon, selectedRoom);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-2xl w-full shadow-2xl shadow-amber-900/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-amber-500 mb-2">Make Your Accusation</h2>
          <p className="text-gray-400">Accuse someone of the murder. Be careful—your evidence will be reviewed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Accuse</label>
            <select
              value={selectedSuspect}
              onChange={(e) => setSelectedSuspect(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-gray-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">Select a suspect</option>
              {suspects.map((suspect) => (
                <option key={suspect.id} value={suspect.id}>
                  {suspect.avatar} {suspect.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Weapon</label>
            <select
              value={selectedWeapon}
              onChange={(e) => setSelectedWeapon(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-gray-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">Select the weapon</option>
              {weapons.map((weapon) => (
                <option key={weapon.id} value={weapon.id}>
                  {weapon.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Location</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-gray-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">Select the room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.icon} {room.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedSuspect || !selectedWeapon || !selectedRoom}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            Submit Accusation
          </button>
        </div>
      </div>
    </div>
  );
}
