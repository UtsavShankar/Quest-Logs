import { useState } from "react";

export function FancyButton({ onClick, children }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div className="button-wrapper fancy">
            <img src="/button-1-bg.png" alt="" className={`fancy-button-bg ${hovered && "hover"}`} />
            <img src="/button-1.png" alt="" className="fancy-button-bg" />
            <button className="button-region fancy"
                onClick={onClick} 
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}>
                {children}
            </button>
        </div>
    )
}

export function SettingsButton({ onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div className="button-wrapper settings">
            <div className="settings-button-shadow"/>
            <img src={hovered ? "/settings-button-shiny.png" : "/settings-button.png"} 
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

export function SimpleButton({ onClick, children}) {
    return (
        <button className="simple-button" onClick={onClick}>{children}</button>
    )
}