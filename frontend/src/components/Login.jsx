import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const createUser = async (userName) => {
    console.log("Sending login request with userName:", userName);
    try {
      console.log("Try frontend");
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          password: "yourPassword",
          token: "yourToken",
        }),
      });

      if (!response.ok) {
        throw new Error("It's not possible to create");
      }

      // const data = await response.json();

      // if (data.success) {
      //   // onLogin(userName);
      //   // navigate("/chats");
      // } else {
      //   console.log("Login failed");
      // }
    } catch (error) {
      console.error("Error sending login request:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userName.trim() !== "") {
      await createUser(userName);
      onLogin(userName);
      navigate("/chats");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;