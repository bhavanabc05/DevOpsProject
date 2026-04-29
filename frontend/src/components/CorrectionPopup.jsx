const TONE_COLORS = {
  formal: "bg-blue-50 text-blue-700",
  casual: "bg-yellow-50 text-yellow-700",
  friendly: "bg-green-50 text-green-700",
  professional: "bg-purple-50 text-purple-700",
  empathetic: "bg-pink-50 text-pink-700",
  assertive: "bg-red-50 text-red-700",
  persuasive: "bg-orange-50 text-orange-700",
  diplomatic: "bg-teal-50 text-teal-700",
  enthusiastic: "bg-amber-50 text-amber-700",
  concise: "bg-gray-50 text-gray-700",
};

export default function CorrectionPopup({
  original,
  improved,
  changes,
  tone,
  onAccept,
  onReject,
}) {
  const toneColor = TONE_COLORS[tone] || "bg-gray-50 text-gray-700";

  return (
    <div className="self-end bg-white border border-gray-200 rounded-xl p-3 max-w-xs mb-2 shadow-sm">
      {/* Tone badge */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400 font-medium">AI SUGGESTION</p>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${toneColor}`}
        >
          {tone}
        </span>
      </div>

      {/* Original */}
      <div className="mb-2">
        <p className="text-xs text-gray-400 mb-0.5">Original</p>
        <p className="text-sm text-gray-500 line-through">{original}</p>
      </div>

      {/* Improved */}
      <div className="mb-2">
        <p className="text-xs text-gray-400 mb-0.5">Improved</p>
        <p className="text-sm text-green-700 font-medium">{improved}</p>
      </div>

      {/* Changes */}
      <div className="flex flex-wrap gap-1 mb-3">
        {changes?.map((c, i) => (
          <span
            key={i}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
          >
            {c}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="flex-1 bg-[#075E54] text-white text-sm py-1.5 rounded-full hover:bg-[#0a7a6b] font-medium"
        >
          Use improved
        </button>
        <button
          onClick={onReject}
          className="flex-1 border border-gray-300 text-sm py-1.5 rounded-full hover:bg-gray-50 text-gray-600"
        >
          Send original
        </button>
      </div>
    </div>
  );
}
