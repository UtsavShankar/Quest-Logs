import { useEffect, useState, useCallback, useRef } from "react";
import TagItem from "./TagItem.jsx";
import colours from "../../data/tagData.js";;

export default function TagPicker({ editTag, tagProps, onUpdate, endEdit }) {
    const { userTags, addTag, deleteTag, updateTag } = tagProps;
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(userTags);

    const pickerRef = useRef();
    const menuRef = useRef();

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
            const clickedInEditMenu = event.target.closest(".tag-edit-menu");
            const clickedInButton = pickerRef.current?.contains(event.target);

            if (!clickedInEditMenu && !clickedInButton) {
                endEdit();
            }
        };

        const timeout = setTimeout(() => {
            document.addEventListener("click", handler);
        }, 0);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener("click", handler);
        }
    }, [endEdit]);

    function TagSearchBar() {
        return (
            <div className="tag-search-bar">
                {editTag && <div className="tag" 
                    style={{ display: 'flex', paddingRight: 0,
                        background: `${colours.find(c => c.id === editTag?.colour)?.background}`
                    }}>
                    <span>{editTag.name}</span>
                    <button style={{border: 'none', padding: '0.1rem 0.5rem 0.1rem', fontSize: '1.3rem', background: 'none',
                        lineHeight: 1, display: 'flex', position: 'relative', top: '-1px'}} onClick={removeTag}>&times;</button>
                </div>}
                <input className="tag-search-input" value={searchTerm} 
                    placeholder="Search..." autoFocus="autofocus" onChange={handleSearchChange}/>
            </div>
        );
    }

    return (
        <span ref={pickerRef}>
            <div className="tag-picker">
                <TagSearchBar />
                { searchResults.length === 0 
                    ? <button style={{textAlign: "left"}} onClick={() => addTag(searchTerm)}>Create {searchTerm}</button> 
                    : <></> }
                <div className="tag-list">
                    {searchResults.map(tag => (
                        <TagItem 
                            key={tag.id} 
                            onClick={() => changeTag(tag)} tag={tag} 
                            colours={colours} 
                            onUpdate={updateTag}
                            onDelete={deleteTag}
                            menuRef={menuRef}
                        />
                    ))}
                </div>
            </div>
        </span>
    )
}