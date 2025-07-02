import { useEffect, useState, useCallback, useRef } from "react";
import TagItem from "./TagItem";

export default function TagPicker({ userId, editTag, tagProps, onUpdate, endEdit }) {
    const { userTags, addTag, deleteTag, updateTag } = tagProps;
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(userTags);

    const pickerRef = useRef();

    const onSearchChange = useCallback((search) => {
        const results = userTags.filter((tag) =>
          tag.name.toLowerCase().includes(search.toLowerCase()),
        )
        setSearchResults(results);
    }, [userTags]);

    useEffect(() => {
        onSearchChange(searchTerm);
    }, [searchTerm, onSearchChange]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const changeTag = (tagId, tagName) => {
        onUpdate(tagId, tagName);
        endEdit();
    }

    const removeTag = () => {
        onUpdate(null);
    }

    useEffect(() => {
        const handler = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                endEdit();
            }
        }
        
        const timeout = setTimeout(() => {
            document.addEventListener("click", handler);
        }, 0);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener("click", handler);
        }
    }, [endEdit]);

    return (
        <span ref={pickerRef}>
            <div className="tag-picker">
                <div className="tag-search-bar">
                    {editTag && <div className="tag" style={{display: 'flex', paddingRight: 0}}>
                        <span>{editTag.name}</span>
                        <button style={{border: 'none', padding: '0.1rem 0.5rem 0.1rem', fontSize: '1.3rem', background: 'none',
                            lineHeight: 1, display: 'flex', position: 'relative', top: '-1px'}} onClick={removeTag}>&times;</button>
                    </div>}
                    <input className="tag-search-input" value={searchTerm} 
                        placeholder="Search..." autoFocus="autofocus" onChange={handleSearchChange}/>
                </div>
                { searchResults.length === 0 
                    ? <button style={{textAlign: "left"}} onClick={() => addTag(searchTerm)}>Create {searchTerm}</button> 
                    : <></> }
                <div className="tag-list">
                    {searchResults.map(tag => (
                        <TagItem key={tag.id} onClick={() => changeTag(tag)}>{tag.name}</TagItem>
                    ))}
                </div>
            </div>
        </span>
    )
}