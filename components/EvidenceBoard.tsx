'use client';

interface Clue {
  id: string;
  text: string;
  roomId: string;
  roomName: string;
  type: 'direct' | 'herring';
  revealed: boolean;
}

interface EvidenceBoardProps {
  clues: Clue[];
}

export default function EvidenceBoard({ clues }: EvidenceBoardProps) {
  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-100">Evidence Board</h3>
          <span className="px-2 py-1 bg-amber-900/30 text-amber-400 rounded text-sm">
            {clues.length} clues
          </span>
        </div>
        
        {clues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>🔍 No clues found yet.</p>
            <p className="text-sm">Explore the mansion to find evidence.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {clues.map((clue) => (
              <div
                key={clue.id}
                className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-3 hover:border-amber-700/50 transition-colors"
              >
                <p className="text-sm italic text-amber-100/90 mb-2">&ldquo;{clue.text}&rdquo;</p>
                <p className="text-xs text-amber-500/70">
                  Found in: {clue.roomName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
