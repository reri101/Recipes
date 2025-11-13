import React from "react"
import classNames from "classnames"
import Label from "../Label/Label"
import "./FieldWrapper.scss"

const FieldWrapper = ({ label, name, children, unit, isRequired }) => {
  return (
    <div className={`input-field`}>
      <Label htmlFor={name} isRequired={isRequired}>
        {label}
      </Label>
      <div className="input-wrapper">
        {children}
        {unit && <span className="unit-text">{unit}</span>}
      </div>
    </div>
  )
}

export default FieldWrapper
