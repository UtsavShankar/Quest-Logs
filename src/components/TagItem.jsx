export default function TagItem({ children, onClick }) {
    return (
        <button className="search-result" onClick={onClick}>
            <span className="tag">{children}</span>
        </button>
    )
};