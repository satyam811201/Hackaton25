"use client";

import { useState } from "react";

import Image from 'next/image'; // Import the Next.js Image component

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about your math topic 😊" },
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
        <div className="flex items-center gap-2">
          <button
            className={`bg-blue-600 text-white p-4 rounded-full shadow-lg animate-bounce`}
            onClick={() => setIsOpen(!isOpen)}
          >
            💬
          </button>
          <p className="text-sm text-gray-700 animate-bounce">Need Math Help?</p>
        </div>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl p-4 w-80 h-[400px] flex flex-col mt-2 border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0 w-8 h-8 mr-2 relative">
              <Image
                src="/mascot.png"
                alt="Mascot"
                layout="fill"
                objectFit="contain"
                className="rounded-full"
              />
            </div>
            <p className="text-sm text-gray-700">Hi, I'm your Math Assistant! How can I help you further?</p>
          </div>
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