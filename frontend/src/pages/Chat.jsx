import { useState } from "react";

export default function Chat({ onClose }) {
  const [messages, setMessages] = useState([
    { text: "👋 Hola, bienvenido a Círculo Literario", sender: "bot" }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = { text: input, sender: "user" };

    setMessages([...messages, newMsg]);
    setInput("");

    // respuesta automática simple
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { text: "📚 Gracias por tu mensaje", sender: "bot" }
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden">

      {/* HEADER */}
      <div className="bg-amber-700 text-white p-3 flex justify-between items-center">
        <span className="font-bold">Chat Literario</span>
        <button onClick={onClose}>✖</button>
      </div>

      {/* MENSAJES */}
      <div className="h-64 overflow-y-auto p-3 space-y-2 bg-[#FEF2E1]">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "ml-auto bg-amber-700 text-white"
                : "bg-white"
            }`}
          >
            {msg.text}
          </div>
        ))}

      </div>

      {/* INPUT */}
      <div className="flex p-2 border-t">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe..."
          className="flex-1 p-2 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-amber-700 text-white px-3 rounded-lg"
        >
          ➤
        </button>

      </div>

    </div>
  );
}