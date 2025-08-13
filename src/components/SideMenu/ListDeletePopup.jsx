export default function ListDeletePopup({ tabName, onCancel, onDelete }) {
    return (
        <div>
            <div className="confirmation-popup">
                <span><b>Delete list "{tabName}"?</b></span>
                <span>All quests in this list will also be deleted.</span>
                <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                    <button onClick={onDelete} className="popup-button delete">Delete</button>
                    <button onClick={onCancel} className="popup-button">Cancel</button>
                </div>
            </div>
            <div className="dark-overlay" style={{ zIndex: "6" }}/>
        </div>
    )
}