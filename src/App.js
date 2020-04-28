import React, { Component } from "react";
import socketIOClient from "socket.io-client";
let nsp = "12345";
const endpoint = "http://localhost:9000";
let socket = socketIOClient(`${endpoint}/${nsp}`);
class App extends Component {
  constructor() {
    super();

    this.state = {
      input: "",
      message: [],
      endpoint: "http://localhost:9000", // เชื่อมต่อไปยัง url ของ realtime server
      nsp: nsp,
    };
  }

  componentDidMount = () => {
    this.response();
  };

  // componentDidUpdate = () => {
  //   this.response();
  // };
  // เมื่อมีการส่งข้อมูลไปยัง server
  send = (message) => {
    const { endpoint, input, nsp } = this.state;
    socket.emit("sent-message", input);
    this.setState({ input: "" });
  };

  // รอรับข้อมูลเมื่อ server มีการ update
  response = () => {
    const { endpoint, message, nsp } = this.state;
    const temp = message;
    const socket = socketIOClient(`${endpoint}/${nsp}`);
    socket.on("new-message", (messageNew) => {
      console.log(messageNew);
      temp.push(messageNew);
      this.setState({ message: temp });
    });
  };

  changeInput = (e) => {
    this.setState({ input: e.target.value });
  };

  changeNSP = (e) => {
    this.setState({ nsp: e.target.value });
  };

  useNSP = () => {
    socket.disconnect();
    socket = socketIOClient(`${endpoint}/${nsp}`);
  };

  render() {
    const { input, message, nsp } = this.state;
    return (
      <div>
        <input value={nsp} onChange={this.changeNSP} />
        <button onClick={() => this.useNSP()}>useNSP</button>
        <div style={style}>
          <input value={input} onChange={this.changeInput} />
          <button onClick={() => this.send()}>Send</button>
        </div>
        {message.map((data, i) => (
          <div key={i} style={style}>
            {i + 1} : {data}
          </div>
        ))}
      </div>
    );
  }
}

const style = { marginTop: 20, paddingLeft: 50 };

export default App;
