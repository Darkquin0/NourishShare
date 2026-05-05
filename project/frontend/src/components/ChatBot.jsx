import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sessionId = "user123";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! I’m NourishBot. How can I help you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dotCount, setDotCount] = useState(1);
  const typingInterval = useRef(null);

  const startTypingAnimation = () => {
    setDotCount(1);
    typingInterval.current = setInterval(() => {
      setDotCount((prev) => (prev < 3 ? prev + 1 : 1));
    }, 500);
  };

  const stopTypingAnimation = () => {
    clearInterval(typingInterval.current);
    typingInterval.current = null;
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: userInput }]);
    const currentInput = userInput;
    setUserInput("");
    setLoading(true);

    // Add bot typing message
    setMessages((prev) => [...prev, { role: "bot", text: "🤖 ." }]);
    startTypingAnimation();

    try {
      // comment API call for now
      // const res = await axios.post(...)
      const reply = "🤖 Chat feature coming soon!";
      //const reply = res.data.reply;

      stopTypingAnimation();

      setMessages((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { role: "bot", text: reply };
        return newHistory;
      });
    } catch (err) {
      stopTypingAnimation();
      setMessages((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          role: "bot",
          text: "⚠️ Offline bot is not responding. Make sure backend is running!",
        };
        return newHistory;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) return;
    setMessages((prev) => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1] = { role: "bot", text: "🤖 " + ".".repeat(dotCount) };
      return newHistory;
    });
  }, [dotCount]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg font-semibold z-50"
      >
        {open ? "Close Chat 🤖" : "AI Powered Food Distribution 🤖"}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-lg rounded-2xl border flex flex-col z-50">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-3 font-bold rounded-t-2xl">
            NourishBot 🤖
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${msg.role === "user"
                    ? "bg-emerald-100 text-black ml-auto"
                    : "bg-gray-200 text-black mr-auto"
                  }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex p-2 gap-2 border-t">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 text-black placeholder-gray-500"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              onClick={sendMessage}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? "..." : "Send"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;