export default function MessageBubble({ message }) {
  const isSent = message.type === "sent";
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`max-w-xs px-3 py-2 rounded-lg text-sm
        ${isSent ? "bg-green-100 rounded-tr-none" : "bg-white rounded-tl-none"}`}
      >
        <p>{message.text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          {message.corrected && (
            <span className="text-xs bg-green-200 text-green-800 px-2 rounded-full">
              AI corrected
            </span>
          )}
          <span className="text-xs text-gray-400">{message.time}</span>
        </div>
      </div>
    </div>
  );
}
