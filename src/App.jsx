import { useState, useEffect } from 'react';
import { auth } from './firebase'; // adjust path as needed
import {
  onAuthStateChanged
} from 'firebase/auth';
import AuthForm from "./components/AuthForm";
import TodoList from "./components/TodoList";
import ReactPlayer from 'react-player/vimeo'

function App() {
  const [user, setUser] = useState(null);

  // Register a listener for Firebase authentication
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <ReactPlayer
          url="https://vimeo.com/1092394026/d857de1950?share=copy"
          playing
          loop
          muted
          width="100%"
          height="100%"
          className="background-video"
        />
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