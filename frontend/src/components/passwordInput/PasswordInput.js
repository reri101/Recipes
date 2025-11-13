import React, { useState } from "react"
import classNames from "classnames"
import "./PasswordInput.scss"
import { ReactComponent as EyeIcon } from "../../assets/icons/eye.svg"
import { ReactComponent as EyeClosedIcon } from "../../assets/icons/eye-closed.svg"
import Icon from "../Icon/Icon"
import Button from "../button/Button"

const PasswordInput = ({ error, touched, className, ...props }) => {
  const [type, setType] = useState("password")
  const [icon, setIcon] = useState(EyeClosedIcon)

  const handleToggle = (event) => {
    event.preventDefault()

    if (type === "password") {
      setType("text")
      setIcon(EyeIcon)
    } else {
      setType("password")
      setIcon(EyeClosedIcon)
    }
  }

  return (
    <div className="password-input">
      <input
        {...props}
        type={type}
        className={classNames("input-control", className, {
          "is-invalid": touched && error,
        })}
        placeholder={touched && error ? error : ""}
      />
      <Button type="button" onClick={handleToggle} variant="toggle">
        <Icon icon={icon} className="toggle-password-icon" type="password" />
      </Button>
    </div>
  )
}

export default PasswordInput
