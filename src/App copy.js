import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
let nsp = "my-namespace";
const endpoint = "http://localhost:9000";

const App = () => {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);
  const [namespace, setNamespace] = useState("abcdef");

  const connectSocket = (namespace) => {
    const socket = socketIOClient(`${endpoint}/${namespace}`);
    socket.on("new-message", (messageNew) => {
      console.log(messageNew);
      const temp = message;
      temp.push(messageNew);
      setMessage(temp);
    });
  };

  const changeInput = (e) => {
    setInput(e.target.value);
  };

  const changeNSP = (e) => {
    console.log(e.target.value);
    setNamespace(e.target.value);
  };
  // เมื่อมีการส่งข้อมูลไปยัง server
  const send = (message) => {
    const socket = socketIOClient(`${endpoint}/${namespace}`);
    socket.emit("sent-message", input);
    setInput("");
  };

  useEffect(() => {
    connectSocket(namespace);
  }, [namespace]);

  return (
    <div>
      <input value={nsp} onChange={changeNSP} />
      <button onClick={() => {}}>useNSP</button>
      <div>
        <input value={input} onChange={changeInput} />
        <button onClick={() => send()}>Send</button>
      </div>
      {message.map((data, i) => (
        <div key={i}>
          {i + 1} : {data}
        </div>
      ))}
    </div>
  );
};

export default App;
