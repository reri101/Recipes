import React from "react"
import fallbackImage from "../../assets/images/no_img.jpg"
import "./PhotoFormatter.scss"

const PhotoFormatter = ({ photoUrl, altText, name }) => {
  const imageSrc = photoUrl || fallbackImage

  return (
    <div className="info">
      <div className="photo">
        <img
          src={imageSrc}
          alt={photoUrl ? `${name} image` : altText}
          className="image"
        />
      </div>
      {name && <div className="name">{name}</div>}
    </div>
  )
}

export default PhotoFormatter
