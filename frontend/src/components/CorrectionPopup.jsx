export default function CorrectionPopup({
  original,
  corrected,
  changes,
  onAccept,
  onReject,
}) {
  return (
    <div className="self-end bg-white border border-gray-200 rounded-xl p-3 max-w-xs mb-2">
      <p className="text-xs text-gray-400 font-medium mb-2">AI SUGGESTION</p>
      <p className="text-sm line-through text-red-500 mb-1">{original}</p>
      <p className="text-sm text-green-700 font-medium mb-2">{corrected}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {changes.map((c, i) => (
          <span
            key={i}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="bg-green-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-green-600"
        >
          Use corrected
        </button>
        <button
          onClick={onReject}
          className="border border-gray-300 text-sm px-4 py-1.5 rounded-full hover:bg-gray-50"
        >
          Send original
        </button>
      </div>
    </div>
  );
}
