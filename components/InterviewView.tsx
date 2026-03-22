'use client';

import { useState } from 'react';

interface InterviewViewProps {
  suspect: {
    id: string;
    name: string;
    role: string;
    personality: string;
    avatar: string;
    alibi: string;
    alibiHole: boolean;
    alibiWitness?: string;
  };
  victim: { name: string };
  onBack: () => void;
  onQuestionAsked?: (questionIndex: number, answer: string) => void;
}

export default function InterviewView({
  suspect,
  victim,
  onBack,
  onQuestionAsked,
}: InterviewViewProps) {
  const [askedQuestions, setAskedQuestions] = useState<Set<number>>(new Set());
  const questions = [
    'Where were you at the time of the murder?',
    `What can you tell me about ${victim.name}?`,
    'Did you notice anything unusual?',
  ];

  const dialogue: Record<string, string[]> = {
    ashford: [
      'I was in the library checking my investments. The telephone rang several times—I had urgent business to attend to.',
      'A rather irritating fellow. Always poking his nose where it doesn\'t belong.',
      'Nothing unusual. Well, except that Dr. Harlow looked particularly nervous.',
    ],
    miriam: [
      'I was upstairs in the master bedroom preparing for dinner.',
      'He was quite rud- excuse me. He had a way of making enemies.',
      'I saw Helena nervous in the library. She kept glancing toward the study.',
    ],
    harlow: [
      'I was in the kitchen trying to calm my nerves with tea.',
      'He was a difficult patient. Demanding, always asking questions he shouldn\'t.',
      'I saw Colonel Finch outside. He looked rather agitated.',
    ],
    beaumont: [
      'I was in the kitchen preparing the hors d\'oeuvres.',
      'He was bad-tempered, as usual. But I kept my head down.',
      'I saw Helena sipping wine by herself. She looked ready to run.',
    ],
    vance: [
      'I was in the study organizing the guest list.',
      'A tiresome man who couldn\'t appreciate proper hospitality.',
      'Dr. Harlow looked pale when I brought him tea.',
    ],
    graves: [
      'I was arranging the silver in the dining room, as is my routine.',
      'A difficult employer often makes for an early grave.',
      'Lord Ashford was very agitated. He kept looking at the study door.',
    ],
    finch: [
      'Outdoors. I need my air. That terrace is the only place with any peace.',
      'He was a fool. Applied for a commission I deserved.',
      'I saw Lady Miriam slip upstairs. She looked secretive.',
    ],
    cross: [
      'I was reading in the library. Trying to forget the rules of this house.',
      'He was cruel. Threatened to cut me off entirely.',
      'I saw Colonel Finch outside when I went for air.',
    ],
  };

  const answers = dialogue[suspect.id] || [
    'I was elsewhere at the time.',
    'The victim was a difficult man.',
    'I didn\'t notice anything unusual.',
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-amber-500 transition-colors"
      >
        ← Back to Room
      </button>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
        <div className="text-6xl mb-4 inline-block">{suspect.avatar}</div>
        <h2 className="text-3xl font-bold text-amber-500 mb-2">{suspect.name}</h2>
        <span className="inline-block px-3 py-1 bg-amber-900/30 text-amber-400 rounded-full text-sm mb-4">
          {suspect.role}
        </span>
        
        <div className="text-gray-300 mb-4">
          <strong className="text-gray-200">Personality:</strong> {suspect.personality}
        </div>

        <div className="text-left bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-gray-400 italic">&ldquo;{suspect.alibi}&rdquo;</p>
          {suspect.alibiWitness && (
            <p className="text-sm text-amber-500 mt-2">Witness: {suspect.alibiWitness}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => {
          const isAnswered = askedQuestions.has(index);
          const handleQuestionClick = () => {
            if (!isAnswered && onQuestionAsked) {
              setAskedQuestions(prev => new Set(prev).add(index));
              onQuestionAsked(index, answers[index]);
            }
          };
          return (
            <div
              key={index}
              onClick={handleQuestionClick}
              className={`p-4 rounded-lg transition-colors ${
                isAnswered ? 'bg-gray-800 opacity-60 cursor-default' : 'bg-gray-900 hover:bg-gray-800 cursor-pointer'
              }`}
            >
              <h4 className="font-semibold text-gray-200 mb-2">{question}</h4>
              <p className="text-gray-400">{answers[index]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
