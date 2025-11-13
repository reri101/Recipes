import React from "react"
import classNames from "classnames"
import Select from "react-select"
import "./Select.scss"

const CustomSelect = ({
  isRequired = false,
  isMulti = false,
  error,
  touched,
  className,
  ...props
}) => {
  const isInvalid = isRequired && error && touched

  return (
    <div className="custom-select">
      <Select
        {...props}
        isMulti={isMulti}
        className={classNames("react-select-container", {
          "is-invalid": isInvalid,
        })}
        classNamePrefix="react-select"
      />
    </div>
  )
}

export default CustomSelect
