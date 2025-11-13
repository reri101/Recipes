import React from "react"
import Table from "../table/Table"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg"
import { ReactComponent as DeleteIcon } from "../../assets/icons/trash.svg"
import "./IngredientsTable.scss"

const IngredientsTable = ({
  handleEditIngredientRow,
  handleRemoveIngredientRow,
  handleAddIngredient,
  data,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Photo",
        accessor: "photo",
        style: { width: "40px" },
        Cell: ({ row }) => {
          const photoUrl = row.original.photo?.url
            ? `${row.original.photo.url}`
            : null
          const imageSrc = photoUrl || "/images/no_img.jpg"

          return (
            <div className="info">
              <div className="photo">
                <img src={imageSrc} alt={row.original.name} className="image" />
              </div>
            </div>
          )
        },
      },
      {
        Header: "Ingredient",
        accessor: "name",
        style: { width: "80px" },
      },
      {
        Header: "Amount",
        accessor: "amount",
        style: { width: "50px" },
      },
      {
        Header: "Unit",
        accessor: "unit",
        style: { width: "100px" },
      },
      {
        Header: "Options",
        accessor: "ingredient_id",
        style: { width: "50px" },
        Cell: ({ row }) => (
          <div className="options">
            <Icon
              icon={EditIcon}
              onClick={() => handleEditIngredientRow(row.index)}
            />
            <Icon
              icon={DeleteIcon}
              onClick={() => handleRemoveIngredientRow(row.index)}
            />
          </div>
        ),
      },
    ],
    [data]
  )

  return (
    <div className="ingredients-table">
      <Table
        columns={columns}
        data={data.filter((ingredient) => !ingredient._destroy)}
      />
      <button
        type="button"
        className="add-new-button"
        onClick={handleAddIngredient}
      >
        + Add New
      </button>
    </div>
  )
}

export default IngredientsTable
