import { useState, useEffect, useRef } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthForm from "./components/AuthForm";
import QuestLog from "./components/QuestLog.jsx";
import BackgroundVideo from './components/Background';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; // adjust path as needed
import { ThemeProvider } from './ThemeContext.js';

const defaultSettings = {
  dynamicBG: true,
  ambienceVolume: 50,
  fireCrackling: true,
  wind: true,
  theme: "quest"
}
const loginFormSettings = JSON.parse(localStorage.getItem("settings")) || defaultSettings;

function App() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);
  const fireCracklingRef = useRef(null);
  const windRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Register a listener for Firebase authentication
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  //loads user settings from Firestore
  useEffect(() => {
    //if logged in, fetch user settings
    if (user) {
      const fetchSettings = async () => {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
         //if user settings exist, set them, else set default settings
        if (userDoc.exists()) {
          setSettings(userDoc.data().setting || defaultSettings);
        } else {
          setSettings(defaultSettings);
        }
      };
      fetchSettings();
    }
  }, [user]);

  //update database if settings change
  useEffect(() => {
    // Only update if user is logged in (and settings is not null/undefined)
    if (user) {
      const updateSettings = async () => {
        const userRef = doc(db, "users", user.uid);
        try {
          await updateDoc(userRef, { setting: settings });
          console.log("Settings updated successfully", settings);
        } catch (e) {
          // Optionally handle errors (e.g., permissions)
          console.error("Failed to update settings:", e);
        }
      };
      updateSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

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


  useEffect(() => {
    window.electronAPI.onWindowHidden(() => {
      if (windRef.current) windRef.current.pause();
      if (fireCracklingRef.current) fireCracklingRef.current.pause();
    });

    window.electronAPI.onWindowActivated(() => {
      settings.fireCrackling && settings.dynamicBG && fireCracklingRef.current.play();
      settings.wind && settings.dynamicBG && windRef.current.play();
    })
  }, [settings.dynamicBG, settings.fireCrackling, settings.wind]);

  return (
    <ThemeProvider initialTheme={loginFormSettings.theme}>
      <div>
        {settings.dynamicBG && <BackgroundVideo />}
        {!user ? (
          <AuthForm />
        ) : (
          <QuestLog user={user} settings={settings} setSettings={setSettings} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;