import { useEffect, useState, useCallback } from "react";
import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";
import TagItem from "./TagItem";

export default function TagPicker({ todo, onUpdate, endEdit }) {
    const [userTags, setUserTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(userTags);
    const [editTag, setEditTag] = useState(todo.tags ? todo.tags[0] : null);

    const loadUserTags = useCallback(async () => {
        const q = query(
            collection(db, "tags"), 
            where("userId", "==", todo.userId)
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ 
            id: doc.id, ...doc.data() 
        }));
        setUserTags(items);
    }, [todo.userId, setUserTags]);

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
            where("userId", "==", todo.userId), 
            where("name", "==", tagName));
        const snapshot = await getDocs(q);

        const newTag = {
                id: userTags.length,
                name: tagName,
                userId: todo.userId
            }
        
        if (snapshot.empty) {
            await addDoc(collection(db, "tags"), newTag);
        }
        changeTag(newTag);
        endEdit();
        loadUserTags();
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const changeTag = newTag => {
        setEditTag(newTag);
        onUpdate(newTag);
        endEdit();
    }

    return (
        <span>
            <div className="tag-picker">
                <div className="tag-search-bar">
                    {(todo.tags && todo.tags[0]) ? <span className="tag">{editTag.name}</span> : <></>}
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