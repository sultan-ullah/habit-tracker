import * as React from "react";
import LoginDialog from './components/LoginDialog';

const BASE_URL = 'http://localhost:5001/'

export default function LoginPage() {
  const [done, setDone] = React.useState(false);
  const [result, setResult] = React.useState(undefined);



  const authenticateUser = async (username, password) => {
    const url = `${BASE_URL}${username}/habits`;
    const authHeader = `Basic` + btoa(`${username}:${password}`);
    const result = await fetch(url, {
      headers: { 'Authorization': authHeader },
      method: 'GET',
      mode: 'cors'
    });

    setResult(result);
    setDone(true);
  };





  const submitHandler = async (values) => {
    console.log("Received values of form: ", values);
    await authenticateUser(values.username, values.password);
    console.log(result);
  };

  if (done) {
    <h1>{ result }</h1>
  }

  return <LoginDialog submitHandler={ submitHandler } />;
}
