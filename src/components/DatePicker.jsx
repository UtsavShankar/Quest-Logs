import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePicker({ value, onChange, onBlur, showRemind = true, remindChecked, onRemindChange }) {

    const handleChange = (date) => {
        if (!date) {
            onChange(null);
            return;
        }
        const yyyyMmDd = date.toISOString().split("T")[0];
        onChange(yyyyMmDd);
    };

    const handleBlur = () => {
        if (!onBlur) return;

        setTimeout(() => {
            if (!document.activeElement.closest(".react-datepicker")) {
                onBlur();
            }
        }, 100);
    }

    return (
        <ReactDatePicker selected={value} style={{all:"unset"}}
            autoFocus={true}
            onChange={handleChange}
            onBlur={handleBlur}
            isClearable
            enableTabLoop={false}
            className="date-input"
            clearButtonClassName="date-clear-button"
        >
            {
                showRemind &&
                <label>
                    <span>Remind</span>
                    <input style={{ margin: "0 0.5rem 0" }} type="checkbox"
                        checked={remindChecked}
                        onChange={onRemindChange} 
                    />
                </label>
            }
        </ReactDatePicker>
    )
}