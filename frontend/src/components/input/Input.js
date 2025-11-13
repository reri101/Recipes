import React from "react"
import classNames from "classnames"
import "./Input.scss"

const Input = ({ error, touched, className, ...props }) => (
  <div className="input-with-error">
    <input
      {...props}
      className={classNames("input-control", className, {
        "is-invalid": touched && error,
      })}
      placeholder={touched && error}
    />
  </div>
)

export default Input
