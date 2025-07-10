import { useState, useEffect, useRef } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthForm from "./components/AuthForm";
import QuestLog from "./components/QuestLog.jsx";
import BackgroundVideo from './components/Background';

function App() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
        dynamicBG: true,
        ambienceVolume: 50,
        fireCrackling: true,
        wind: true
  })
  const fireCracklingRef = useRef(null);
  const windRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Register a listener for Firebase authentication
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    const onFirstClick = () => setHasInteracted(true);
    window.addEventListener('click', onFirstClick, { once: true });

    return () => window.removeEventListener('click', onFirstClick);
  }, []);

  useEffect(() => {
    fireCracklingRef.current = new Audio(`${process.env.PUBLIC_URL}/fire_crackling.mp3`);
    fireCracklingRef.current.loop = true;

    return () => {
      fireCracklingRef.current.pause();
      fireCracklingRef.current = null;
    };
  }, []);

  useEffect(() => {
    windRef.current = new Audio(`${process.env.PUBLIC_URL}/wind.mp3`);
    windRef.current.loop = true;
    windRef.current.volume = 0.3;

    return () => {
      windRef.current.pause();
      windRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted) return;
    if (!fireCracklingRef.current) return;
    settings.fireCrackling && settings.dynamicBG ? fireCracklingRef.current.play() : fireCracklingRef.current.pause();
  }, [hasInteracted, settings.fireCrackling, settings.dynamicBG]);

  useEffect(() => {
    if (!hasInteracted) return;
    if (!windRef.current) return;
    settings.wind && settings.dynamicBG ? windRef.current.play() : windRef.current.pause();
  }, [hasInteracted, settings.wind, settings.dynamicBG])

  useEffect(() => {
    if (fireCracklingRef.current)
      fireCracklingRef.current.volume = settings.ambienceVolume / 100;
    if (windRef.current)
      windRef.current.volume = 0.3 * settings.ambienceVolume / 100;
  }, [settings.ambienceVolume, settings.dynamicBG])

  return (
    <div>
      {settings.dynamicBG && <BackgroundVideo />}
      {!user ? (
        <AuthForm />
      ) : (
        <QuestLog user={user} settings={settings} setSettings={setSettings} />
      )}
    </div>
  );
}

export default App;