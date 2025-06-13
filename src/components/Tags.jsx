import TagItem from "./TagItem";

export default function TagPicker({ userTags, todo }) {
    const tags = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
        <span>
            <div className="tag-picker">
                <input className="tag-search-bar" value={todo.tags ? todo.tags[0] : ""} placeholder="Search..." autoFocus="autofocus"/>
                <div className="tag-list">
                    {tags.map(tag => (
                        <TagItem key={tag}>{`Tag ${tag}`}</TagItem>
                    ))}</div>
            </div>
        </span>
    )
}