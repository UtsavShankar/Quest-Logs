import React, { useState, useEffect } from 'react';
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
    <div style={{ padding: '20px' }}>
      {!user ? (
        <AuthForm />
      ) : (
        <TodoList user={user} />
      )}
    </div>
  );
}

export default App;