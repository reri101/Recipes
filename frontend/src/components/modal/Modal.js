import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { hideModal } from "../../modalSlice"
import "./Modal.scss"
import Button from "../button/Button"

const Modal = ({ onDelete, itemName, message }) => {
  const dispatch = useDispatch()
  const { isVisible, item } = useSelector((state) => state.modal)

  if (!isVisible || !item) return null

  const handleDelete = () => {
    onDelete(item.id, item.name)
    dispatch(hideModal())
  }

  return (
    <div className="modal">
      <div className="content">
        <h3 className="header">
          Delete > <span className="bold">{item.name}</span>
        </h3>
        <div className="confirmation-text">
          {!message ? (
            <p>
              Are you sure that you want to delete {itemName}:{" "}
              <span className="bold">{item.name}</span>?
            </p>
          ) : (
            <p>{message}</p>
          )}
        </div>
        <div className="actions">
          {!message ? (
            <>
              <Button onClick={() => dispatch(hideModal())} variant="cancel">
                Cancel
              </Button>

              <Button onClick={handleDelete} variant="confirm">
                Delete
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                onDelete && onDelete({ categoryName: item.name })
                dispatch(hideModal())
              }}
              variant="cancel"
            >
              I understand
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal
