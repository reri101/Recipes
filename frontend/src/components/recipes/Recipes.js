import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as actions from "./RecipesActions"
import Modal from "../modal/Modal"
import { showModal } from "../../modalSlice"
import { useDispatch } from "react-redux"
import Table from "../table/Table"
import Icon from "../Icon/Icon"
import { ReactComponent as RecipeIcon } from "../../assets/icons/recipe.svg"
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg"
import { ReactComponent as DeleteIcon } from "../../assets/icons/trash.svg"
import BreadcrumbSection from "../breadcrumbSection/BreadcrumbSection"
import PhotoFormatter from "../photoFormatter/PhotoFormatter"


function Recipes() {
  const [recipes, setRecipes] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    actions.getRecipes((data) => setRecipes(data))
  }, [])

  const handleEdit = (recipeId) => {
    navigate(`/recipe/${recipeId}`)
  }

  const handleDeleteRecipe = (recipeId) => {
    actions.deleteRecipe(recipeId, () => {
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      )
    })
  }

  const handleDelete = (recipeId, recipeName) => {
    dispatch(showModal({ id: recipeId, name: recipeName }))
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Recipe",
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
        Header: "Published",
        accessor: "published_at",
        className: "align-right",
        Cell: ({ value }) => {
          if (value) {
            const date = new Date(value)
            return date
              .toLocaleDateString("pl-PL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\./g, "/")
          }
          return "N/A"
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
    <div className="recipes">
      <BreadcrumbSection
        icon={RecipeIcon}
        pathLinks={{ path: "/recipes", label: "Recipes" }}
        actionButton={{
          label: "+ Add new",
          onClick: () => navigate("/recipe"),
        }}
      />

      <Table columns={columns} data={recipes} />
      <Modal onDelete={handleDeleteRecipe} itemName="recipe" />
    </div>
  )
}

export default Recipes
