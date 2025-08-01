import { createContext, useContext } from "react";

export const AudioContext = createContext();
export const useAudioContext = () => useContext(AudioContext);