import React, { useState } from "react";
import { IoChatbubbleEllipsesOutline, IoCloseOutline, IoSend } from "react-icons/io5";

const FAQBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey! How can I help you with Kulture Vintage today?" }
  ]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate backend/AI response
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 600);
  };

  // Simple rule-based logic (Replace with your backend fetch API)
  const getBotResponse = (text) => {
    const query = text.toLowerCase();
    if (query.includes("track") || query.includes("order")) {
      return "You can track your order live under Account Menu -> Track Order!";
    } else if (query.includes("return") || query.includes("refund")) {
      return "We offer 7-day hassle-free returns on all unworn items.";
    } else if (query.includes("shipping") || query.includes("delivery")) {
      return "Standard shipping takes 3-5 business days across India.";
    }
    return "Thanks for asking! For specific queries, email us at support@kulturevintage.com.";
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition transform hover:scale-105 flex items-center justify-center cursor-pointer"
        >
          <IoChatbubbleEllipsesOutline className="text-2xl" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="bg-[#111111] border border-neutral-800 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs">
          {/* Header */}
          <div className="bg-[#181818] p-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-white tracking-wider uppercase">Kulture Support Bot</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
              <IoCloseOutline className="text-xl" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="p-4 h-64 overflow-y-auto space-y-3 bg-[#0d0d0d]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-[#181818] border border-neutral-800 text-neutral-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-[#181818] border-t border-neutral-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#111111] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl transition cursor-pointer"
            >
              <IoSend className="text-sm" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FAQBot;