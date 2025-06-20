export default function BackgroundVideo() {
    return (
        <div>
            <video className="background-video" src="/campfire_ambience.mp4" autoPlay loop muted/>
            <div className="video-overlay"></div>
        </div>
    )
}