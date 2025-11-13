import React from "react"
import classNames from "classnames"
import "./Button.scss"

const Button = ({ children, onClick, variant = "default", ...props }) => {
  return (
    <button
      className={classNames("button", { [variant]: variant })}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
