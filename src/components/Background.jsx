export default function BackgroundVideo() {
    return (
        <div>
            <video className="background-video" src={`${process.env.PUBLIC_URL}/campfire_ambience.mp4`} autoPlay loop muted preload="auto"/>
        </div>
    )
}