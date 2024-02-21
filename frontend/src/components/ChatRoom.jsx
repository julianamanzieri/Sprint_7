import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ChatRoom({ socket, userName }) {
  const { id: roomName } = useParams(); // Obtiene el nombre de la sala de la URL
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("join_room", roomName);

    socket.on("chat_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(data);
    });

    // Escuchar por los mensajes existentes en la sala al momento de unirse
    socket.on("existing_messages", (existingMessages) => {
      console.log(existingMessages, "chatRoomsocket");
      setMessages(existingMessages); // Establece los mensajes existentes
    });

    return () => {
      socket.off("chat_message");
    };
  }, [roomName, socket]);

  const sendMessage = () => {
    if (!message) {
      socket.emit("chat_message", {
        room: roomName,
        message,
        userName: userName,
      });
      setMessage("");
    }
  };

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
            <b>{msg.userName}:</b> {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default ChatRoom;
