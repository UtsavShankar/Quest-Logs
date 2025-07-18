import { useEffect } from "react";
import { useTheme } from "../ThemeContext.js";

export default function ThemeSync({ settings }) {
    const { setTheme } = useTheme();

    useEffect(() => {
        if (settings?.theme) {
        setTheme(settings.theme);
        }
    }, [settings.theme, setTheme]);

    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify(settings));
    }, [settings]);

    return null;
}