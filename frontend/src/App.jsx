import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import { correctMessage } from "./services/correctionService";

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: "recv",
    text: "Hey! Did you finish the assignment?",
    time: "10:21 AM",
  },
];

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [pending, setPending] = useState(null);
  const [rawText, setRawText] = useState("");

  const handleSend = async (text) => {
    setRawText(text);
    setPending("thinking");

    try {
      const result = await correctMessage(text);

      if (!result.needs_correction) {
        addMessage(text, false);
        setPending(null);
      } else {
        setPending({
          type: "correction",
          original: text,
          corrected: result.corrected,
          changes: result.changes || [],
        });
      }
    } catch (err) {
      addMessage(text, false);
      setPending(null);
    }
  };

  const addMessage = (text, corrected) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "sent",
        text,
        corrected,
        time: getTime(),
      },
    ]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="flex flex-col w-96 h-[600px] rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-green-400 flex items-center justify-center text-white font-semibold text-sm">
            AK
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Arjun Kumar</p>
            <p className="text-green-200 text-xs">online</p>
          </div>
          <span className="text-green-200 text-xs">AI: on</span>
        </div>

        <ChatWindow
          messages={messages}
          pending={pending}
          onAccept={() => {
            addMessage(pending.corrected, true);
            setPending(null);
          }}
          onReject={() => {
            addMessage(rawText, false);
            setPending(null);
          }}
        />

        <InputBar onSend={handleSend} disabled={!!pending} />
      </div>
    </div>
  );
}
