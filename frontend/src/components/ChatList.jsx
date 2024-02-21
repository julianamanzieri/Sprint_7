import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChatList({ rooms, handleCreateRoom, userName }) {
  const navigate = useNavigate();

  const onRoomSelect = (roomName) => {
    navigate(`/chats/${roomName}`); // Navega a la sala seleccionada
  };

  return (
    <div>
      <button onClick={handleCreateRoom}>Create Room</button>
      <h2>Available Rooms</h2>
      <ul>
        {rooms.map((roomName, index) => (
          <li key={index} onClick={() => onRoomSelect(roomName)} style={{ cursor: "pointer" }}>
            {roomName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;

