import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeContext.js";

export default function useAudio(settings) {
    const { theme } = useTheme();

    const audioRefs = useRef(new Map());
    const [hasInteracted, setHasInteracted] = useState(false);

    // Initialise audio
    useEffect(() => {
        const refs = audioRefs.current;

        theme.audio.forEach(audio => {
            const audioRef = new Audio(audio.path);
            audioRef.loop = true;
            audioRef.volume = audio.volumeMultiplier;
            refs.set(audio.id, audioRef);
        })

        return () => {
            theme.audio.forEach(audio => {
                const ref = refs.get(audio.id);
                if (ref) {
                    ref.pause();
                }
            })
            refs.clear();
        };
    }, [theme]);

    // Set has interacted when user clicks on the app
    useEffect(() => {
        const onFirstClick = () => setHasInteracted(true);
        window.addEventListener('click', onFirstClick, { once: true });

        return () => window.removeEventListener('click', onFirstClick);
    }, []);

    // Play/pause individual audio
    useEffect(() => {
        if (!hasInteracted) return;
        if (!audioRefs.current) return;

        theme.audio.forEach(audio => {
            const ref = audioRefs.current.get(audio.id);
            if (settings.dynamicBG && settings[audio.id]) {
                ref.play();
            } else {
                ref.pause();
            }
        })
    }, [hasInteracted, settings, theme.audio]);

    // Update volume
    useEffect(() => {
        if (!audioRefs.current) return;

        theme.audio.forEach(audio => {
            const ref = audioRefs.current.get(audio.id);
            ref.volume = audio.volumeMultiplier * settings.ambienceVolume / 100;
        })
    }, [settings.ambienceVolume, settings.dynamicBG, theme.audio])

    useEffect(() => {
        if (!audioRefs.current) return;

        window.electronAPI.onWindowHidden(() => {
            console.log("window hidden");
            theme.audio.forEach(audio => {
                audioRefs.current.get(audio.id).pause();
            })
        });

        window.electronAPI.onWindowActivated(() => {
            console.log("window activated");
            if (!settings.dynamicBG) return;

            theme.audio.forEach(audio => {
                if (settings[audio.id]) {
                    audioRefs.current.get(audio.id).play();
                }
            })
        })
    }, [settings, theme.audio]);
}