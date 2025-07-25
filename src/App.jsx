import { useState } from 'react';
import AuthForm from "./components/AuthForm";
import QuestLog from "./components/QuestLog.jsx";
import BackgroundVideo from './components/Background';
import { ThemeProvider } from './hooks/ThemeContext.js';
import useAudio from './hooks/useAudio.js';
import { useSettings } from './hooks/useSettings.js';
import { AudioContext } from './AudioContext.js';

function AppContent({ user, settings, setSettings, loginFormSettings }) {
  const audio = useAudio(user ? settings : loginFormSettings);

  return (
    <AudioContext.Provider value={audio}>
      {settings.dynamicBG && <BackgroundVideo />}
      {!user ? (
        <AuthForm />
      ) : (
        <QuestLog user={user} settings={settings} setSettings={setSettings} />
      )}
    </AudioContext.Provider>
  )
}

function App() {
  const [user, setUser] = useState(null);
  const { settings, setSettings, loginFormSettings } = useSettings(user, setUser);

  return (
    <ThemeProvider initialTheme={loginFormSettings.theme}>
      <AppContent user={user} settings={settings} setSettings={setSettings} loginFormSettings={loginFormSettings}/>
    </ThemeProvider>
  );
}

export default App;