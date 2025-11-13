import React from "react"
import { NavLink } from "react-router-dom"
import classNames from "classnames"
import "./NavItem.scss"

function NavItem({ to, icon: IconComponent, label, isActive }) {
  return (
    <div className="navItem">
      <NavLink
        to={to}
        className={classNames("logo-link", { active: isActive })}
      >
        {IconComponent && <IconComponent className="logo-icon" />}
        <span className="logo-text">{label}</span>
      </NavLink>
    </div>
  )
}

export default NavItem
