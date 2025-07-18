import { useEffect } from "react";
import { useTheme } from "../hooks/ThemeContext.js";

export default function ThemeSync({ settings }) {
    const { setTheme } = useTheme();

    // Set theme in ThemeProvier
    useEffect(() => {
        if (settings?.theme) {
            setTheme(settings.theme);
        }
    }, [settings.theme, setTheme]);

    return null;
}