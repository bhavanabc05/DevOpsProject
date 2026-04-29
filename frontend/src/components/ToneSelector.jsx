const TONES = [
  { id: "formal", label: "Formal", emoji: "🎩" },
  { id: "casual", label: "Casual", emoji: "😎" },
  { id: "friendly", label: "Friendly", emoji: "😊" },
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "empathetic", label: "Empathetic", emoji: "🤝" },
  { id: "assertive", label: "Assertive", emoji: "💪" },
  { id: "persuasive", label: "Persuasive", emoji: "🎯" },
  { id: "diplomatic", label: "Diplomatic", emoji: "🕊️" },
  { id: "enthusiastic", label: "Enthusiastic", emoji: "🔥" },
  { id: "concise", label: "Concise", emoji: "✂️" },
];

export default function ToneSelector({ selected, onChange }) {
  return (
    <div className="px-3 py-2 bg-white border-t border-gray-100">
      <p className="text-xs text-gray-400 mb-1.5 font-medium">SELECT TONE</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onChange(tone.id)}
            className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all
              ${
                selected === tone.id
                  ? "bg-[#075E54] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <span>{tone.emoji}</span>
            <span>{tone.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
