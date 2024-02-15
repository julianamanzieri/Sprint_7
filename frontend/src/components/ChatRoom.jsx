// ChatRoom.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

function ChatRoom({ socket, userName }) {
  const { id: roomName } = useParams(); // Obtiene el nombre de la sala de la URL
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("join_room", roomName);

    socket.on("chat_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chat_message");
    };
  }, [roomName, socket]);

  const sendMessage = useCallback(() => {
    if (message !== "") {
      socket.emit("chat_message", {
        room: roomName,
        message,
        userName: userName,
      }); // Ajusta según cómo manejes el nombre de usuario
      setMessage("");
    }
  }, [message, roomName, socket, userName]);

  return (
    <div>
      <h2>Room: {roomName}</h2>
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <b>{msg.userName}:</b> {msg.message}
          </p>
        ))}
      </div>
    </div>
  );
}

export default ChatRoom;
