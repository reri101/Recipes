import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as actions from "./IngredientsActions"
import Modal from "../modal/Modal"
import { showModal } from "../../modalSlice"
import { useDispatch } from "react-redux"
import Table from "../table/Table"
import Icon from "../Icon/Icon"
import { ReactComponent as IngredientIcon } from "../../assets/icons/ingredients.svg"
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg"
import { ReactComponent as DeleteIcon } from "../../assets/icons/trash.svg"
import BreadcrumbSection from "../breadcrumbSection/BreadcrumbSection"
import PhotoFormatter from "../photoFormatter/PhotoFormatter"

function Ingredients() {
  const [ingredients, setIngredients] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    actions.getIngredients((data) => setIngredients(data))
  }, [])

  const handleEdit = (ingredientId) => {
    navigate(`/ingredient/${ingredientId}`)
  }

  const handleDeleteIngredient = (ingredientId) => {
    actions.deleteIngredient(ingredientId, () => {
      setIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
      )
    })
  }

  const handleDelete = (ingredientId, ingredientName) => {
    dispatch(showModal({ id: ingredientId, name: ingredientName }))
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Ingredient",
        accessor: "name",
        className: "align-left",
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
        Header: "Unit",
        accessor: "unit",
        className: "align-right",
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
    <div className="ingredients">
      <BreadcrumbSection
        icon={IngredientIcon}
        pathLinks={{ path: "/ingredients", label: "Ingredients" }}
        actionButton={{
          label: "+ Add new",
          onClick: () => navigate("/ingredient"),
        }}
      />

      <Table columns={columns} data={ingredients} classN="tr-ingredients" />
      <Modal onDelete={handleDeleteIngredient} itemName="ingredient" />
    </div>
  )
}

export default Ingredients
