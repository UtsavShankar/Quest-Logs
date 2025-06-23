import React, { useState } from "react";
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-auth.js";
import { FancyButton } from "./Buttons";
import "./Buttons.css";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
        console.log("Trying to sign in with", email, password);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ position: 'absolute', height: '100%', width: '100%', display:'flex', 
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
      <h2>Log in</h2>
      <input className="text-input" style={{ width: "200px" }} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="text-input" style={{ width: "200px" }} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {<span style={{ color: "red" }}>{error ? error : "\u00A0"}</span>}
      <div style={{display: 'flex', gap: '10px'}}>
        <FancyButton onClick={handleLogin}>Login</FancyButton>
        <FancyButton onClick={handleRegister}>Register</FancyButton>
      </div>
    </div>
  );
}