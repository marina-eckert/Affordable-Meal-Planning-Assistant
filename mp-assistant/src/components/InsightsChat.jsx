import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown"; // <--- Import this!
import "./InsightsChat.css";

export default function InsightsChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your culinary assistant. Ask me about recipes, diets, or meal plans!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      // Use your port 1501
      const response = await fetch("http://localhost:1501/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      const aiMsg = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, aiMsg]);

    } catch (err) {
      console.error(err);
      const errorMsg = { role: "assistant", content: "⚠️ I couldn't reach the server. Please try again." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {/* Render Markdown instead of raw text */}
            <ReactMarkdown>{m.content}</ReactMarkdown>
          </div>
        ))}
        
        {loading && (
          <div className="msg assistant typing-indicator">
            <span>•</span><span>•</span><span>•</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          disabled={loading}
          placeholder={loading ? "Gemini is thinking..." : "Ask for diet, recipes, meal plans..."}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}