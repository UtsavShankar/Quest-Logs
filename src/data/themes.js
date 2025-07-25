const themes = [
    {
        id: "quest",
        name: "Quest",
        logTitle: "Quest Log",
        taskName: "quest",
        assets: {
            backgroundVideo: `${process.env.PUBLIC_URL}/campfire_ambience.mp4`,
            fancyButton: `${process.env.PUBLIC_URL}/button-1.png`,
            fancyButtonBg: `${process.env.PUBLIC_URL}/button-1-bg.png`,
            settingsButton: `${process.env.PUBLIC_URL}/settings-button.png`,
            settingsButtonHover: `${process.env.PUBLIC_URL}/settings-button-shiny.png`,
        },
        audio: [
            {
                id: "fireCrackling",
                label: "Fire Crackling",
                path: `${process.env.PUBLIC_URL}/fire_crackling.mp3`,
                volumeMultiplier: 1,
            },
            {
                id: "wind",
                label: "Wind",
                path: `${process.env.PUBLIC_URL}/wind.mp3`,
                volumeMultiplier: 0.3,
            }
        ]
    },
    {
        id: "mission",
        name: "Mission",
        logTitle: "Missions",
        taskName: "mission",
        assets: {
            backgroundVideo: null,
            settingsButton: `${process.env.PUBLIC_URL}/settings-button-silver.png`,
            settingsButtonHover: `${process.env.PUBLIC_URL}/settings-button-silver-shiny.png`,
        },
        audio: [],
    },
    {
        id: "enchantment",
        name: "Enchantment",
        logTitle: "Quest Log",
        taskName: "quest",
        assets: {
            backgroundVideo: `${process.env.PUBLIC_URL}/castle.mp4`,
            fancyButton: `${process.env.PUBLIC_URL}/button-2.png`,
            fancyButtonBg: `${process.env.PUBLIC_URL}/button-2-bg.png`,
            settingsButton: `${process.env.PUBLIC_URL}/settings-button.png`,
            settingsButtonHover: `${process.env.PUBLIC_URL}/settings-button-shiny.png`,
        },
        audio: [
            {
                id: "birdsong",
                label: "Birdsong",
                path: `${process.env.PUBLIC_URL}/birdsong-5-min.mp3`,
                volumeMultiplier: 1,
            },
        ],
    }
]

export default themes;