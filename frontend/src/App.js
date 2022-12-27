import React, { useState, useEffect } from "react";
import prettyMilliseconds from "pretty-ms";
import { Buffer } from "buffer";
import bcrypt from 'bcryptjs';

function App() {
  const oldTime = new Date("2022-12-20");

  const [time, setTime] = useState(prettyMilliseconds(new Date() - oldTime));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prettyMilliseconds(new Date() - oldTime));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (event) => {
    console.log(username);
    console.log(password);

    let url = `http://localhost:5001`;
    let authString = `${username}:${password}`;
    let headers = new Headers();
    headers.set("Authorization", "Basic " + btoa(authString));

    fetch(url, {
      method: "GET", headers: headers }).then(function (response) {
      console.log(response);
    });
    event.preventDefault();
  };


  const handleSignup = async (event) => {
    console.log(username);
    console.log(password);

    let url = `http://localhost:5001/signup`;

    const encryptedPass = await bcrypt.hashSync(password);
    fetch(url, {
      method: "POST", headers: {"Content-Type": "application/json"},body: JSON.stringify({ username, pass: encryptedPass }) }).then(function (response) {
      console.log(response);
    });
    event.preventDefault();
  };

  return (
    <div>
      <label>
        username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        password:
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button title="LOGIN" onClick={handleSubmit} />
      <button title="SIGNUP" onClick={handleSignup} />

      <p>The current time is: {time.toString()}</p>
    </div>
  );
}

export default App;
