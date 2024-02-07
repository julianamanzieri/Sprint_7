import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatList from "./components/ChatList";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";

// Asegúrate de que la URL coincida con el endpoint de tu servidor Socket.IO
const socket = io("http://localhost:3000");

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { userName: string; message: string }[]
  >([]); // Define explícitamente el tipo del array
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rooms, setRooms] = useState<string[]>([]);

  const handleLogin = (userNameFromLogin: string) => {
    setIsLoggedIn(true);
    setUserName(userNameFromLogin); // Asegurarse de actualizar el estado userName con el valor recibido

    // Aquí puedes configurar adicionalmente el nombre de usuario u otros estados necesarios
  };

  //   const joinRoomByName = (roomName: string) => {
  //     setRoom(roomName); // Actualiza el estado de la sala con la sala seleccionada
  //     socket.emit('join_room', roomName); // Unirse a la sala seleccionada
  //   };

  //   // Función para enviar mensajes
  // const sendMessage = () => {
  //   if (message !== "" && userName !== "") {
  //     socket.emit('chat_message', { room, message, userName });
  //     setMessage('');
  //   }
  // };

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chat_message");
    };
  }, []);

  useEffect(() => {
    socket.emit("request_room_list"); // Solicitar la lista de salas al servidor

    const handleRoomList = (roomList: string[]) => {
      setRooms(roomList); // Actualizar el estado con la lista de salas recibida
    };

    socket.on("room_list", handleRoomList);

    // Función de limpieza para evitar múltiples listeners
    return () => {
      socket.off("room_list", handleRoomList);
    };
  }, []);

  const handleCreateRoom = () => {
    const roomName = prompt("Enter room name:"); // Solicitar el nombre de la sala al usuario
    if (roomName) {
      socket.emit("create_room", roomName); // Enviar al servidor la solicitud para crear una nueva sala
    }
  };

  // Asegúrate de tener un input para que el usuario pueda definir su nombre
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/chats" />
            )
          }
        />
        <Route
          path="/chats"
          element={
            <ChatList
              rooms={rooms}
              handleCreateRoom={handleCreateRoom}
              userName={userName}
            />
          }
        />
        <Route
          path="/chats/:id"
          element={
            <ChatRoom
              socket={socket}
              userName={userName} /* Pasa aquí tus props necesarias */
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
