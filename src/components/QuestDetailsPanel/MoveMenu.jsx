import {ReactComponent as MoveIcon} from '../../assets/icon-folder.svg';

export default function MoveMenu({ ref, lists, moveToList }) {
    return (
        <div ref={ref} className="quest-options-menu">
            <MoveIcon className="icon" style={{ margin: "0.3rem 0.5rem 0" }}/>
            <div className="tag-options">
                <button key="all" onClick={() => moveToList(null)}>All</button>
                {
                    lists.map(l => 
                        <button key={l.id} onClick={() => moveToList(l.id)}>{l.name}</button>
                    )
                }
            </div>
        </div>
    )
}