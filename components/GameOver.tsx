'use client';

interface GameOverProps {
  result: 'win' | 'lose';
  mystery: {
    victim: { name: string };
    killer: { name: string; avatar: string };
    weapon: { name: string };
    murderRoom: { name: string; icon: string };
  };
  accusation: { suspect: string; weapon: string; room: string } | null;
  onNewGame: () => void;
}

export default function GameOver({ result, mystery, accusation, onNewGame }: GameOverProps) {
  const isWin = result === 'win';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      {isWin ? (
        <>
          <div className="text-8xl mb-4">🏆</div>
          <h2 className="text-4xl font-bold text-emerald-500">Case Solved! ✓</h2>
          <div className="bg-emerald-900/20 border border-emerald-800 rounded-xl p-6 max-w-xl">
            <h3 className="text-xl font-semibold text-emerald-400 mb-4">The Truth Revealed</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong className="text-emerald-400">The Killer:</strong> {mystery.killer.avatar}{' '}
                {mystery.killer.name}
              </p>
              <p>
                <strong className="text-emerald-400">The Weapon:</strong> {mystery.weapon.name}
              </p>
              <p>
                <strong className="text-emerald-400">The Scene:</strong> {mystery.murderRoom.icon}{' '}
                {mystery.murderRoom.name}
              </p>
            </div>
          </div>
          <p className="text-xl text-gray-300 max-w-lg">
            Excellent work! You uncovered the truth and brought the killer to justice.
          </p>
        </>
      ) : (
        <>
          <div className="text-8xl mb-4">💀</div>
          <h2 className="text-4xl font-bold text-red-500">Wrong Accusation</h2>
          
          {accusation && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 max-w-xl">
              <h3 className="text-xl font-semibold text-red-400 mb-4">Your Accusation</h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <strong className="text-red-400">You accused:</strong> {accusation.suspect}
                </p>
                <p>
                  <strong className="text-red-400">You thought the weapon was:</strong>{' '}
                  {accusation.weapon}
                </p>
                <p>
                  <strong className="text-red-400">You believed it happened in:</strong>{' '}
                  {accusation.room}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">The Solution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
          <div className="text-center p-4 bg-gray-950 rounded-lg">
            <div className="text-3xl mb-2">{mystery.killer.avatar}</div>
            <div className="font-semibold">{mystery.killer.name}</div>
            <div className="text-sm text-gray-500">Killer</div>
          </div>
          <div className="text-center p-4 bg-gray-950 rounded-lg">
            <div className="text-lg">{mystery.weapon.name}</div>
            <div className="text-sm text-gray-500 mt-1">Weapon</div>
          </div>
          <div className="text-center p-4 bg-gray-950 rounded-lg">
            <div className="text-3xl mb-2">{mystery.murderRoom.icon}</div>
            <div className="font-semibold">{mystery.murderRoom.name}</div>
            <div className="text-sm text-gray-500 mt-1">Location</div>
          </div>
        </div>
      </div>

      <button
        onClick={onNewGame}
        className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-amber-900/50"
      >
        New Case →
      </button>
    </div>
  );
}
