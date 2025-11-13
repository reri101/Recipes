import React, { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import "./Header.scss"
import { ReactComponent as ChevronIcon } from "../../assets/icons/chevron-down.svg"
import { ReactComponent as RecipeIcon } from "../../assets/icons/recipe.svg"
import { ReactComponent as UsersIcon } from "../../assets/icons/users.svg"
import Icon from "../Icon/Icon"
import NavItem from "../navItem/NavItem"
import Button from "../button/Button"
import fallbackImage from "../../assets/images/profile.jpg"

function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [role, setRole] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen)
  }

  const closeToggles = () => {
    setSettingsOpen(false)
    setProfileOpen(false)
  }

  useEffect(() => {
    const name = localStorage.getItem("userName")
    const userRole = localStorage.getItem("userRole")
    if (name) {
      setUserName(name)
      setRole(userRole)
    }
  }, [location.pathname])

  const isRecipeActive =
    location.pathname === "/recipes" || location.pathname === "/recipe"
  const isUsersActive = location.pathname === "/user"

  return (
    <div className="template-header">
      <div className="logo">
        <NavItem
          to={role === "admin" ? "/users" : "/recipes"}
          icon={role === "admin" ? UsersIcon : RecipeIcon}
          label={role === "admin" ? "Users" : "Recipes"}
          isActive={role === "admin" ? isUsersActive : isRecipeActive}
        />
      </div>
      <div className="header-right">
        {role === "user" && (
          <div className="settings">
            <Button variant="settings" onClick={toggleSettings}>
              Settings{" "}
              <span className={`arrow ${settingsOpen ? "open" : ""}`}>
                <Icon icon={ChevronIcon} type="settings" />
              </span>
            </Button>
            {settingsOpen && (
              <div className="dropdown">
                <ul>
                  <li
                    onClick={() => {
                      closeToggles()
                      navigate("/categories")
                    }}
                  >
                    Categories
                  </li>
                </ul>
                <ul>
                  <li
                    onClick={() => {
                      closeToggles()
                      navigate("/tags")
                    }}
                  >
                    Tags
                  </li>
                </ul>
                <ul>
                  <li
                    onClick={() => {
                      closeToggles()
                      navigate("/ingredients")
                    }}
                  >
                    Ingredients
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="user">
          <div
            className="container"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="photo">
              <img src={fallbackImage} alt="User photo" className="image" />
            </div>
            <span className="user-name">{userName}</span>

            <span className={`arrow ${profileOpen ? "open" : ""}`}>
              <Icon icon={ChevronIcon} type="settings" />
            </span>
          </div>
          {profileOpen && (
            <div className="dropdown">
              <ul>
                <li
                  onClick={() => {
                    localStorage.removeItem("authToken")
                    localStorage.removeItem("userName")
                    navigate("/login")
                  }}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
