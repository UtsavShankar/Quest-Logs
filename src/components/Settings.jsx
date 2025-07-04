import { useState, useEffect } from "react";

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
    }

    function Slider({ label, min, max, value, onChange }) {
        return <label style={{display: "flex", alignItems: "center"}}>
            <span className="option-label"> {label} </span>
            <input style={{width: "130px"}} type="range" value={value} min={min} max={max} 
                onChange={(e) => onChange(Number(e.target.value))}/>
            <span style={{marginLeft: "10px"}}>{settings.ambienceVolume}</span>
        </label>
    }

    function Switch({label, value, onChange}) {
        return <label style={{display: "flex", alignItems: "center"}}>
            <span className="option-label">{label}</span>
            <input type="checkbox" checked={value} 
                onChange={(e) => onChange(e.target.checked)}/>
        </label>
    }

    useEffect(() => {
        const sliders = document.querySelectorAll('.settings input[type="range"]');

        sliders.forEach(slider => {
            const updateSliderFill = () => {
                const value = slider.value;
                const percent = (value - slider.min) / (slider.max - slider.min) * 100;
                slider.style.background = `linear-gradient(to right, #7C643C ${percent}%, #333 ${percent}%)`;
            };

            slider.addEventListener("input", updateSliderFill);
            updateSliderFill();

            return () => {
            slider.removeEventListener("input", updateSliderFill);
            };
        });
    }, [settings]);

    return (
        <div className="settings-wrapper">
            <div className="settings-menu">
                <img className="settings-frame-bg" src={`${process.env.PUBLIC_URL}/frame1bg.png`} alt=""/>
                <img className="settings-frame" src={`${process.env.PUBLIC_URL}/frame1.png`} alt=""></img>
                <div className="settings">
                    <div className="settings-close-button">
                        <button className="circle" onClick={closeMenu}/>
                        <img style={{height: "40px"}} src={`${process.env.PUBLIC_URL}/close-button-1.png`} alt="close button"/>
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
                    <div style={{position: "absolute", top: "8%", left: "37%"}}>
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