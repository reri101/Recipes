import React from "react"
import { useDropzone } from "react-dropzone"
import "./Dropzone.scss"
import Icon from "../Icon/Icon"
import { ReactComponent as UploadIcon } from "../../assets/icons/upload.svg"

const MAX_FILE_SIZE = 30 * 1024 * 1024

const Dropzone = ({ onFileUpload, currentPhoto, handleDelete }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0])
      }
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((file) => {
        if (file.errors[0].code === "file-invalid-type") {
          alert("Invalid file format. Only JPEG and PNG files are allowed.")
        } else if (file.errors[0].code === "file-too-large") {
          alert(
            `File is too large. Maximum file size is ${
              MAX_FILE_SIZE / (1024 * 1024)
            }MB.`
          )
        }
      })
    },
  })

  const renderImagePreview = () => {
    if (currentPhoto && typeof currentPhoto.id === "number") {
      return <img src={`${currentPhoto.url}`} alt="Category" />
    }
    if (currentPhoto instanceof File) {
      return <img src={URL.createObjectURL(currentPhoto)} alt="Preview" />
    }
    return <p>Click to upload or drag and drop</p>
  }

  return (
    <div className="dropzone" {...getRootProps()}>
      {currentPhoto ? (
        <div className="image-preview">
          {renderImagePreview()}
          <div
            className="overlay"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
          >
            <span className="remove-text">Remove</span>
          </div>
        </div>
      ) : (
        <div className="upload-info">
          <div className="icon">
            <Icon icon={UploadIcon} />
          </div>
          <p className="upload-text">
            <span>Click to upload </span>
            or drag and drop
          </p>
          <p className="file-size-info">(Max File size: 30MB)</p>
        </div>
      )}
      <input {...getInputProps()} className="file-input" />
    </div>
  )
}

export default Dropzone
