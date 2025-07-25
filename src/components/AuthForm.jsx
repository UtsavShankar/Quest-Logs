import { useState } from "react";
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { FancyButton, SimpleButton } from "./Buttons";
import "./Buttons.css";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetPass, setResetPass] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const sendReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      console.log("Reset email sent to", email);
    }
    catch (err) {
      setError(err.message);
      console.log(err);
    }
  };


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

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user).then(() => {
      console.log("Verification email sent to", email);
    })
  } catch (err) {
    setError(err.message);
    console.log(err);
  }
};

  return (
    resetPass ? (
      <div style={{ position: 'absolute', height: '100%', width: '100%', display:'flex', 
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',  gap: '10px'}}>
        <h2>Reset Password</h2>   
        <input className="text-input" style={{ width: "200px" }} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {resetEmailSent?<SimpleButton>Email Sent</SimpleButton>:<SimpleButton style={{"font-size":"15px"}} onClick={sendReset}>Send Reset Email</SimpleButton>}
        <SimpleButton style={{"font-size":"15px"}} onClick={() => setResetPass(false)}>Back to Login</SimpleButton>
        </div>)
        :(
  
    <div style={{ position: 'absolute', height: '100%', width: '100%', display:'flex', 
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
      <h2>Login</h2>
      <input className="text-input" style={{ width: "200px" }} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="text-input" style={{ width: "200px" }} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <SimpleButton style={{fontSize:"15px"}} onClick={()=> setResetPass(true)}>Forgot password</SimpleButton>
      {<span style={{ color: "red" }}>{error ? error : "\u00A0"}</span>}
      <div style={{display: 'flex', gap: '10px'}}>
        <FancyButton onClick={handleLogin}>Login</FancyButton>
        <FancyButton onClick={handleRegister}>Register</FancyButton>
      </div>
    </div>)
  );
}