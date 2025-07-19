import { useTheme } from "../hooks/ThemeContext.js";

export default function BackgroundVideo() {
    const { theme } = useTheme();
    const videoPath = theme.assets.backgroundVideo;

    return (
        <div>
            {videoPath && <video className="background-video" src={videoPath} autoPlay loop muted preload="auto"/>}
        </div>
    )
}