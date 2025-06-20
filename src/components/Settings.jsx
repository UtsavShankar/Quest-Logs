import { useState } from "react";

export default function SettingsMenu({ closeMenu, settings, setSettings }) {
    const [currentSection, setCurrentSection] = useState("preferences");

    const preferencesOptions = [
        {
            key: "dynamicBG",
            label: "Dynamic Background",
            type: "switch"
        }
    ]

    const audioOptions = [
        {
            key: "ambienceVolume",
            label: "Ambience Volume",
            type: "slider",
            min: 0,
            max: 100
        },
        {
            key: "fireCrackling",
            label: "Fire Crackling",
            type: "switch"
        },
        {
            key: "wind",
            label: "Wind",
            type: "switch"
        }
    ]

    const sections = [
        {
            key: "preferences",
            label: "Preferences",
            options: preferencesOptions
        },
        {
            key: "audio",
            label: "Audio",
            options: audioOptions
        }
    ]

    const handleChange = (key, newValue) => {
        setSettings(prev => ({
            ...prev,
            [key]: newValue
        }));
        console.log("Changed ", key, " to ", newValue);
    }

    function Slider({ label, min, max, value, onChange }) {
        return <label style={{display: "flex"}}>
            <span className="option-label"> {label} </span>
            <input type="range" value={value} min={min} max={max} 
                onChange={(e) => onChange(Number(e.target.value))}/>
        </label>
    }

    function Switch({label, value, onChange}) {
        return <label style={{display: "flex"}}>
            <span className="option-label">{label}</span>
            <input type="checkbox" checked={value} 
                onChange={(e) => onChange(e.target.checked)}/>
        </label>
    }

    return (
        <div className="settings-wrapper">
            <div className="settings-menu">
                <img className="settings-frame-bg" src="/frame1bg.png" alt=""/>
                <img className="settings-frame" src="/frame1.png" alt=""></img>
                <div className="settings">
                    <div className="settings-close-button">
                        <button className="circle" onClick={closeMenu}/>
                        <img style={{height: "40px"}} src="/close-button-1.png" alt="close button"/>
                    </div>
                    <div style={{position: "absolute", top: "8%", right: "75%"}}>
                        <div className="side-bar">
                            {
                                sections.map(sect => <button className={`side-button ${currentSection === sect.key && "selected"}`}
                                    onClick={() => setCurrentSection(sect.key)}>
                                    {sect.label}
                                </button>)
                            }
                        </div>
                    </div>
                    <div className="vertical-line" style={{left: "30%"}}/>
                    <div className="vertical-line" style={{left: "31%"}}/>
                    <div style={{position: "absolute", top: "8%", left: "40%"}}>
                        <div className="options">
                            {sections.find(sect => sect.key === currentSection).options.map(opt => {
                                const commonProps = {
                                    label: opt.label,
                                    value: settings[opt.key],
                                    onChange: val => handleChange(opt.key, val)
                                }

                                switch (opt.type) {
                                    case "slider":
                                        return <Slider key={opt.key} {...commonProps} min={opt.min} max={opt.max}/>;
                                    case "switch":
                                        return <Switch key={opt.key} {...commonProps}/>;
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}