import React from "react"
import classNames from "classnames"
import "./Icon.scss"

const Icon = ({ icon: IconComponent, size = 24, type, onClick }) => {
  return (
    <IconComponent
      width={size}
      height={size}
      className={classNames("icon", { [type]: type })}
      onClick={onClick}
    />
  )
}

export default Icon
