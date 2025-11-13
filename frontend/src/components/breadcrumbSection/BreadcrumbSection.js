import React from "react"
import { Link } from "react-router-dom"
import Icon from "../Icon/Icon"
import "./BreadcrumbSection.scss"
import Button from "../button/Button"

function BreadcrumbSection({
  icon,
  pathLinks,
  newLabel,
  actionButton,
  isSubmitting,
}) {
  return (
    <div className="breadcrumb-section">
      <div className="path">
        <Icon icon={icon} type="header" />
        {!newLabel ? (
          <span className="bold"> {pathLinks.label}</span>
        ) : (
          <span>
            <Link to={pathLinks?.path} className="link">
              {pathLinks?.label}
            </Link>{" "}
            &gt; <span className="bold"> New</span>
          </span>
        )}
      </div>
      {actionButton && (
        <Button
          onClick={actionButton.onClick}
          variant="confirm"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : actionButton.label}
        </Button>
      )}
    </div>
  )
}

export default BreadcrumbSection
