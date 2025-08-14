import {ReactComponent as DeleteIcon} from '../../assets/icon-delete.svg';

export default function QuestOptions({ ref, onDelete }) {
    return (
        <div ref={ref} className="quest-options-menu">
            <div className="tag-options">
                <button onClick={onDelete} style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.5rem 0.2rem" }}>
                    <DeleteIcon className="icon" style={{ margin: "0 0.3rem 0 0" }}/>
                    Delete 
                </button>
            </div>
        </div>
    )
}