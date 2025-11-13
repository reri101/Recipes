import React from "react"
import "./Label.scss"

const Label = ({ htmlFor, children, isRequired = false }) => (
  <label htmlFor={htmlFor} className="custom-label">
    {isRequired && <span className="star">*</span>}
    {children}
  </label>
)

export default Label
