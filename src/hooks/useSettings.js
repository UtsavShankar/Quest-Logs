import { useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const defaultSettings = {
  dynamicBG: true,
  ambienceVolume: 50,
  fireCrackling: true,
  wind: true,
  theme: "quest"
}
const loginFormSettings = JSON.parse(localStorage.getItem("settings")) || defaultSettings;

export function useSettings(user, setUser) {
    const [settings, setSettings] = useState(defaultSettings);

    // Register a listener for Firebase authentication
    useEffect(() => {
        return onAuthStateChanged(auth, (u) => setUser(u));
    }, [setUser]);

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

        // Save settings to local storage
        localStorage.setItem("settings", JSON.stringify(settings));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    return { settings, setSettings, loginFormSettings };
}