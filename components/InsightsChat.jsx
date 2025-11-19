import { useState } from "react";
import "./InsightsChat.css";

export default function InsightsChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:1501/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await response.json();
      const aiMsg = { role: "assistant", content: data.reply };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>{m.content}</div>
        ))}
        {loading && <div className="msg assistant">Typing...</div>}
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          placeholder="Ask for diet, recipes, meal and etc. "
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}
