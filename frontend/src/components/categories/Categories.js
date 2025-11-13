import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as actions from "./CategoriesActions"
import Modal from "../modal/Modal"
import { showModal } from "../../modalSlice"
import { useDispatch } from "react-redux"
import Table from "../table/Table"
import Icon from "../Icon/Icon"
import { ReactComponent as CategoryIcon } from "../../assets/icons/categories.svg"
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg"
import { ReactComponent as DeleteIcon } from "../../assets/icons/trash.svg"
import BreadcrumbSection from "../breadcrumbSection/BreadcrumbSection"
import PhotoFormatter from "../photoFormatter/PhotoFormatter"

function Categories() {
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    actions.getCategories((data) => setCategories(data))
  }, [])

  const handleEdit = (categoryId) => {
    navigate(`/category/${categoryId}`)
  }

  const handleDeleteCategory = (categoryId, categoryName) => {
    actions.deleteCategory(
      categoryId,
      () => {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        )
      },
      (error) => {
        setErrorMessage(error)
        dispatch(showModal({ id: null, name: categoryName }))
      }
    )
  }

  const handleDelete = (categoryId, categoryName) => {
    dispatch(showModal({ id: categoryId, name: categoryName }))
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Category",
        accessor: "name",
        Cell: ({ row }) => {
          const photoUrl = row.original.photo?.url
            ? `${row.original.photo.url}`
            : null

          return (
            <PhotoFormatter
              photoUrl={photoUrl}
              altText="No image"
              name={row.original.name}
            />
          )
        },
      },
      {
        Header: "Options",
        accessor: "id",
        className: "align-right",
        Cell: ({ value, row }) => (
          <div className="options">
            <Icon
              icon={EditIcon}
              onClick={() => handleEdit(value)}
              type="options"
            />
            <Icon
              icon={DeleteIcon}
              onClick={() => handleDelete(value, row.original.name)}
              type="options"
            />
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="categories">
      <BreadcrumbSection
        icon={CategoryIcon}
        pathLinks={{ path: "/categories", label: "Categories" }}
        actionButton={{
          label: "+ Add new",
          onClick: () => navigate("/category"),
        }}
      />

      <Table columns={columns} data={categories} />
      <Modal
        onDelete={
          !errorMessage ? handleDeleteCategory : () => setErrorMessage(null)
        }
        itemName="category"
        message={errorMessage}
      />
    </div>
  )
}

export default Categories
