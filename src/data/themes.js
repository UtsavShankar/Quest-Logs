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
        }
    },
    {
        id: "mission",
        name: "Mission",
        logTitle: "Missions",
        taskName: "mission",
        assets: {
            backgroundVideo: null,
        }
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
        }
    }
]

export default themes;