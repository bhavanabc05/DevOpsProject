import { useState } from "react";

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-t">
      <input
        className="flex-1 rounded-full px-4 py-2 text-sm outline-none bg-white"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-800"
      >
        <span className="text-white text-lg">➤</span>
      </button>
    </div>
  );
}
