import * as React from "react";
import AuthDialog from "./AuthDialog";
import LoginPage from "./LoginPage"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={LoginPage()}></Route>
        <Route path="/habits" element={ <h1>Hello World!</h1>}></Route>
      </Route>
    </Routes>
  );
}
