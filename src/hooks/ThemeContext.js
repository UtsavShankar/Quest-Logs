import { createContext, useState, useContext, useEffect } from "react";
import themes from "../data/themes";

const ThemeContext = createContext();

export const ThemeProvider = ({ initialTheme, children }) => {
  const [theme, setThemeObject] = useState(getThemeObject(initialTheme));

  function setTheme(themeId) {
    setThemeObject(getThemeObject(themeId));
  }

  function getThemeObject(themeId) {
    return themes.find(t => t.id === themeId);
  }
  
  useEffect(() => {
    const root = document.documentElement;
    root.className = "";
    root.classList.add("theme-" + theme.id);
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);