import React from "react"
import "./AppTemplate.scss"

function AppTemplate({ children }) {
  return (
    <div className="app-template">
      <main className="children">{children}</main>
    </div>
  )
}

export default AppTemplate
