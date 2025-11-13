import React from "react"
import "./Checkbox.scss"

const Checkbox = ({ handleCheckboxChecked, handleCheckboxChange }) => {
  return (
    <div className="checkbox">
      <input
        className="input"
        type="checkbox"
        checked={handleCheckboxChecked}
        onChange={handleCheckboxChange}
      />
    </div>
  )
}

export default Checkbox
