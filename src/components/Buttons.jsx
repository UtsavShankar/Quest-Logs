import { useState } from "react";

export function FancyButton({ onClick, children }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div className="button-wrapper fancy">
            <img src={`${process.env.PUBLIC_URL}/button-1-bg.png`} alt="" className={`fancy-button-bg ${hovered && "hover"}`} />
            <img src={`${process.env.PUBLIC_URL}/button-1.png`} alt="" className="fancy-button-bg" />
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
            <img src={hovered ? `${process.env.PUBLIC_URL}/settings-button-shiny.png` : `${process.env.PUBLIC_URL}/settings-button.png`} 
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