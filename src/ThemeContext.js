import { createContext, useState, useContext } from "react";
import themes from "./data/themes";

const ThemeContext = createContext();

export const ThemeProvider = ({ initialTheme, children }) => {
  const [theme, setThemeObject] = useState(initialTheme);

  function setTheme(themeId) {
    setThemeObject(themes.find(t => t.id === themeId));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);