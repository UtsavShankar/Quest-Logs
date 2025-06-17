import { useState, useEffect } from 'react';
import { auth } from './firebase'; // adjust path as needed
import {
  onAuthStateChanged
} from 'firebase/auth';
import AuthForm from "./components/AuthForm";
import TodoList from "./components/TodoList";

function App() {
  const [user, setUser] = useState(null);

  // Register a listener for Firebase authentication
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  return (
    <div>
      <video className="background-video" src="/campfire_ambience.mp4" autoPlay loop muted/>
        <div className="video-overlay"></div>
      {!user ? (
        <AuthForm />
      ) : (
        <TodoList user={user} />
      )}
    </div>
  );
}

export default App;