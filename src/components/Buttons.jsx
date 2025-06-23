import { useState } from "react";

export function FancyButton({ onClick, label }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div className="button-wrapper fancy">
            <img src="/button-1-bg.png" alt="" className={`fancy-button-bg ${hovered && "hover"}`} />
            <img src="/button-1.png" alt="" className="fancy-button-bg" />
            <button className="button-region fancy"
                onClick={onClick} 
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}>
                {label}
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