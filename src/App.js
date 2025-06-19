import React, { useState, useEffect, useRef } from "react";
import ".styles.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(
      "https://28cae41f-4425-4315-bf3e-a856b5004670-00-1ssjmiwxd5x5q.pike.replit.dev/"
    );

    ws.current.onmessage = async (event) => {
      const data = event.data;

      if (data instanceof Blob) {
        const text = await data.text(); // Read the Blob as text
        setMessages((prev) => [...prev, { from: "other", text }]);
      } else {
        setMessages((prev) => [...prev, { from: "other", text: data }]);
      }
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;

    // Check if connection is open
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(input);
      setMessages((prev) => [...prev, { from: "me", text: input }]);
      setInput("");
    } else {
      console.log(
        "WebSocket not ready yet. Current state:",
        ws.current?.readyState
      );
    }
  };

  return (
    <div className="chat-container">
      <h2> Real-time Chat </h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.from === "me" ? "my-msg" : "other-msg"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
