import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import CorrectionPopup from "./CorrectionPopup";

export default function ChatWindow({ messages, pending, onAccept, onReject }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col bg-[#ECE5DD]">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {pending === "thinking" && (
        <div className="self-end flex items-center gap-2 bg-white px-3 py-2 rounded-full text-xs text-gray-500 border">
          <span className="text-blue-600 font-medium">AI checking</span>
          <span className="animate-pulse">●●●</span>
        </div>
      )}

      {pending?.type === "correction" && (
        <CorrectionPopup
          original={pending.original}
          improved={pending.improved}
          changes={pending.changes}
          tone={pending.tone}
          onAccept={onAccept}
          onReject={onReject}
        />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
