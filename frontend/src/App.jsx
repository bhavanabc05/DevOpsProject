import { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import ToneSelector from "./components/ToneSelector";
import {
  correctMessage,
  saveMessage,
  loadMessages,
} from "./services/correctionService";

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
  const [tone, setTone] = useState("formal");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages()
      .then((history) => {
        if (history.length > 0) {
          const formatted = history.map((m) => ({
            id: m._id,
            type: "sent",
            text: m.text,
            corrected: m.wasCorrected,
            tone: m.tone,
            time: new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setMessages([...INITIAL_MESSAGES, ...formatted]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async (text) => {
    setRawText(text);
    setPending("thinking");

    try {
      const result = await correctMessage(text, tone);
      setPending({
        type: "correction",
        original: text,
        improved: result.improved,
        changes: result.changes || [],
        tone: result.tone || tone,
      });
    } catch (err) {
      await addMessage(text, text, false, tone);
      setPending(null);
    }
  };

  const addMessage = async (text, originalText, wasCorrected, selectedTone) => {
    await saveMessage(text, originalText, wasCorrected, selectedTone);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "sent",
        text,
        corrected: wasCorrected,
        tone: selectedTone,
        time: getTime(),
      },
    ]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="flex flex-col w-96 h-[680px] rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-green-400 flex items-center justify-center text-white font-semibold text-sm">
            AK
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Arjun Kumar</p>
            <p className="text-green-200 text-xs">
              {loading ? "loading history..." : "online"}
            </p>
          </div>
          <span className="text-green-200 text-xs">AI: on</span>
        </div>

        <ChatWindow
          messages={messages}
          pending={pending}
          onAccept={async () => {
            await addMessage(
              pending.improved,
              pending.original,
              true,
              pending.tone,
            );
            setPending(null);
          }}
          onReject={async () => {
            await addMessage(rawText, rawText, false, tone);
            setPending(null);
          }}
        />

        {/* Tone selector sits above input bar */}
        <ToneSelector selected={tone} onChange={setTone} />
        <InputBar onSend={handleSend} disabled={!!pending} />
      </div>
    </div>
  );
}
