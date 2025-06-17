import { useEffect, useState, useCallback, useRef } from "react";
import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";
import TagItem from "./TagItem";

export default function TagPicker({ userId, editTag, onUpdate, endEdit }) {
    const [userTags, setUserTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(userTags);

    const pickerRef = useRef();

    const loadUserTags = useCallback(async () => {
        const q = query(
            collection(db, "tags"), 
            where("userId", "==", userId)
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ 
            id: doc.id, ...doc.data() 
        }));
        setUserTags(items);
    }, [userId, setUserTags]);

    useEffect(() => {
        loadUserTags();
    }, [loadUserTags]);

    const onSearchChange = useCallback((search) => {
        const results = userTags.filter((tag) =>
          tag.name.toLowerCase().includes(search.toLowerCase()),
        )
        setSearchResults(results);
    }, [userTags]);

    useEffect(() => {
        onSearchChange(searchTerm);
    }, [searchTerm, onSearchChange]);

    const addTag = async (tagName) => {
        const q = query(
            collection(db, "tags"), 
            where("userId", "==", userId), 
            where("name", "==", tagName));
        const snapshot = await getDocs(q);

        const newTag = {
                id: userTags.length,
                name: tagName,
                userId: userId
            }
        
        if (snapshot.empty) {
            await addDoc(collection(db, "tags"), newTag);
        }
        changeTag(newTag);
        loadUserTags();
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const changeTag = newTag => {
        onUpdate(newTag);
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