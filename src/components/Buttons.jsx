import { useState } from "react";
import { useTheme } from "../hooks/ThemeContext";

export function FancyButton({ onClick, children }) {
    const { theme } = useTheme();
    const [hovered, setHovered] = useState(false);
    return (
        <div>
            {theme.assets.fancyButton
            ? <div className="button-wrapper fancy">
                <img src={theme.assets.fancyButtonBg} alt="" className={`fancy-button-bg ${hovered && "hover"}`} />
                <img src={theme.assets.fancyButton} alt="" className="fancy-button-bg" />
                <button className="button-region fancy"
                    onClick={onClick} 
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}>
                    {children}
                </button>
            </div>
            :
            <div>
                <button className="button-region fancy default"
                    onClick={onClick} 
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}>
                    {children}
                </button>
            </div>}
        </div>
    )
}

export function SettingsButton({ onClick }) {
    const { theme } = useTheme();
    const [hovered, setHovered] = useState(false);
    return (
        <div className="button-wrapper settings">
            <div className="settings-button-shadow"/>
            <img src={hovered ? theme.assets.settingsButtonHover : theme.assets.settingsButton} 
                alt="Settings" 
                className={"fancy-button-bg"}
            />
            <button className="button-region settings" 
                onClick={onClick} 
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            />
        </div>
    )
}

export function SimpleButton({ onClick, children, style }) {
    return (
        <button style={style} className="simple-button" onClick={onClick}>{children}</button>
    )
}