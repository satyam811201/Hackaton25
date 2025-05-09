"use client";

import { useState } from "react";
import Image from 'next/image'; // Import the Next.js Image component
import { XMarkIcon, MinusIcon } from '@heroicons/react/24/outline'; // Import standard icons

const initialMessage = "I'm your Math Assistant! How can I help you further?";
const initialMessageOpen="Woooo Welcome!!"
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: initialMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/askAssistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Failed to fetch from API");

      const data = await res.json();
      const reply = data?.reply || "Hmm... I don't have an answer right now.";

      

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Failed to get response from AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-black">
      {!isOpen && (
        <button
          className={`bg-blue-600 text-white p-3 rounded-full shadow-lg animate-bounce flex items-center gap-2`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0m4.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0m4.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0M2.25 12c0-5.107 3.728-9.512 8.625-10.875a18.635 18.635 0 017.5 0C21.75 6.488 25.5 10.893 25.5 16.001c0 5.108-3.728 9.513-8.625 10.875a18.635 18.635 0 01-7.5 0C2.25 17.513-1.5 13.108-1.5 7.999c0-1.018.112-2.017.321-2.98L9 10.216M3.75 12c0 5.107 3.729 9.512 8.625 10.875a18.635 18.635 0 017.5 0C21.75 17.513 25.5 13.108 25.5 7.999c0-5.108-3.729-9.513-8.625-10.875a18.635 18.635 0 01-7.5 0C3.75 6.487-.001 10.892-.001 16.001m13.5-3.75a.375.375 0 11-.75 0 .375.375 0 01.75 0m-4.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0m-4.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0" />
          </svg>
          <span className="hidden sm:inline">{initialMessage}</span>
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl p-4 w-96 h-[500px] flex flex-col mt-2 border border-gray-200">
          {/* Header with Minimize and Close Buttons */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 relative">
                <Image
                  src="/mascot.png"
                  alt="Mascot"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>
              <h5 className="text-lg font-semibold">{initialMessageOpen}!</h5>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <MinusIcon className="w-5 h-5" />
                <span className="sr-only">Minimize</span>
              </button>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </div>
          {/* Messages display */}
          <div className="overflow-y-auto flex-1 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-6 h-6 mr-2 relative">
                    <Image
                      src="/mascot.png"
                      alt="Mascot"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-full"
                    />
                  </div>
                )}
                <div className={`text-sm p-2 rounded ${msg.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          {/* Input area */}
          <div className="flex mt-2 gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 p-2 border rounded text-sm"
              placeholder="Ask a math question..."
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}