import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import "./Recipe.scss"
import * as actions from "./RecipeActions"
import { useNavigate, useParams } from "react-router-dom"
import Modal from "../modal/Modal"
import { showModal } from "../../modalSlice"
import { useDispatch } from "react-redux"
import Dropzone from "../dropzone/Dropzone"
import { ReactComponent as RecipeIcon } from "../../assets/icons/recipe.svg"
import classNames from "classnames"
import CustomSelect from "../select/Select"
import Input from "../input/Input"
import IngredientModal from "../ingredientModal/IngredientModal"
import omit from "lodash/omit"
import BreadcrumbSection from "../breadcrumbSection/BreadcrumbSection"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg"
import { ReactComponent as DeleteIcon } from "../../assets/icons/trash.svg"
import PhotoFormatter from "../photoFormatter/PhotoFormatter"
import Table from "../table/Table"
import FieldWrapper from "../fieldWrapper/FieldWrapper"

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  preparation_time: Yup.number()
    .required("Preparation time is required")
    .typeError("Preparation time must be a number"),
  category: Yup.object()
    .shape({
      value: Yup.string().required("Category is required"),
      label: Yup.string().required("Category is required"),
    })
    .nullable()
    .required("Category is required"),
})

function Recipe() {
  const { recipeId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ingredients, setIngredients] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [ingredientModalShowUp, setIngredientModalShowUp] = useState(false)
  const [ingredientToDelete, setIngredientToDelete] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [ingredientToEdit, setIngredientToEdit] = useState(null)
  const [availableIngredients, setAvailableIngredients] = useState([])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    actions.getAllData().then((data) => {
      setCategories(data.categories)
      setTags(data.tags)
      setIngredients(data.ingredients)
    })
    if (recipeId) {
      actions.getRecipeById(recipeId, (data) => {
        formik.setValues({
          ...omit(data, ["category", "tags"]),
          category: { value: data.category.id, label: data.category.name },
          tags: data.tags.map((tag) => ({ value: tag.id, label: tag.name })),
        })
      })
    }
  }, [recipeId])

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      preparation_time: "",
      category: { value: "", label: "" },
      tags: [],
      photo: null,
      ingredients: [],
    },
    validationSchema,
    onSubmit: (values) => {
      setIsSubmitting(true)

      if (values.photo && values.photo.id === undefined) {
        actions
          .uploadPhoto(values.photo)
          .then((uploadedPhotoId) => {
            actions.createRecipe(
              {
                ...omit(values, ["tags", "category", "ingredients", "photo"]),
                photo_id: uploadedPhotoId,
                category_id: values.category.value,
                tag_ids: values.tags.map((tag) => tag.value),
                recipes_ingredients_attributes: values.ingredients.map(
                  (ingredient) => ({
                    ...ingredient,
                    _destroy: ingredient._destroy || false,
                  })
                ),
              },
              () => {
                formik.resetForm()
                navigate("/recipes")
              }
            )
          })
          .finally(() => {
            setIsSubmitting(false)
          })
      } else {
        actions
          .createRecipe(
            {
              ...omit(values, ["tags", "category", "ingredients", "photo"]),
              photo_id: values.photo ? values.photo.id : null,
              category_id: values.category.value,
              tag_ids: values.tags.map((tag) => tag.value),
              recipes_ingredients_attributes: values.ingredients.map(
                (ingredient) => ({
                  ...ingredient,
                  _destroy: ingredient._destroy || false,
                })
              ),
            },
            () => {
              formik.resetForm()
              navigate("/recipes")
            }
          )
          .finally(() => {
            setIsSubmitting(false)
          })
      }
    },
  })

  const handleImageUpload = (file) => {
    formik.setFieldValue("photo", file)
  }

  const handleDeletePhoto = (itemName) => {
    dispatch(showModal({ name: itemName }))
  }

  const handleDeleteIngredient = (ingredient) => {
    setIngredientToDelete(ingredient)
    dispatch(showModal({ ...ingredient }))
  }


  const handleAddIngredient = () => {
    const usedIngredientIds = formik.values.ingredients
      .filter((ingredient) => !ingredient._destroy)
      .map((ingredient) => ingredient.ingredient_id)

    setAvailableIngredients(
      ingredients.filter(
        (ingredient) => !usedIngredientIds.includes(ingredient.id)
      )
    )

    setIngredientModalShowUp(true)
  }

  const handleCloseIngredientModal = () => {
    setIngredientModalShowUp(false)

    setIsEditMode(false)
  }

  const handleSaveIngredient = (ingredient) => {
    const ingredientDetails = ingredients.find(
      (ing) => ing.id === ingredient.ingredient.value
    )

    if (!ingredientDetails) {
      return
    }

    const updatedIngredients = [...formik.values.ingredients]
    const existingIndex = updatedIngredients.findIndex(
      (ing) => ing.ingredient_id === ingredientDetails.id
    )

    if (existingIndex !== -1) {
      updatedIngredients[existingIndex] = {
        ...updatedIngredients[existingIndex],
        ingredient_id: ingredientDetails.id,
        name: ingredientDetails.name,
        photo: ingredientDetails.photo || null,
        unit: ingredientDetails.unit,
        amount: ingredient.amount,
        _destroy: false,
      }
    } else {
      updatedIngredients.push({
        id: null,
        ingredient_id: ingredientDetails.id,
        photo: ingredientDetails.photo || null,
        name: ingredientDetails.name,
        amount: ingredient.amount,
        unit: ingredientDetails.unit,
        _destroy: false,
      })

      if (ingredient.prevIngredient) {
        const prevIngredientIndex = updatedIngredients.findIndex(
          (ing) => ing.ingredient_id === ingredient.prevIngredient.value
        )
        updatedIngredients[prevIngredientIndex] = {
          ...updatedIngredients[prevIngredientIndex],
          _destroy: true,
        }
      }
    }

    formik.setFieldValue("ingredients", updatedIngredients)
    handleCloseIngredientModal()
  }

  const handleEditIngredientRow = (index) => {
    const ingredientToEdit = formik.values.ingredients[index]

    if (!ingredientToEdit) {
      return
    }

    const usedIngredientIds = formik.values.ingredients
      .filter((ingredient, i) => !ingredient._destroy && i !== index)
      .map((ingredient) => ingredient.ingredient_id)

    setAvailableIngredients((prevState) =>
      ingredients.filter(
        (ingredient) =>
          !usedIngredientIds.includes(ingredient.id) || ingredient._destroy
      )

    )

    setIngredientToEdit({
      ingredient: {
        value: ingredientToEdit.ingredient_id,
        label: ingredientToEdit.name,
      },
      amount: ingredientToEdit.amount,
      unit: ingredientToEdit.unit,
    })

    setIsEditMode(true)
    setIngredientModalShowUp(true)

  }

  const handleRemoveIngredientRow = (index) => {
    const ingredient = formik.values.ingredients[index]
    handleDeleteIngredient(ingredient)
  }

  const handleDeleteItem = () => {
    if (ingredientToDelete) {
      const updatedIngredients = [...formik.values.ingredients]
      const ingredientToDeleteIndex = updatedIngredients.findIndex(
        (ing) => ing.ingredient_id === ingredientToDelete.ingredient_id
      )
      updatedIngredients[ingredientToDeleteIndex] = {
        ...updatedIngredients[ingredientToDeleteIndex],
        _destroy: true,
      }

      formik.setFieldValue("ingredients", updatedIngredients)
      setIngredientToDelete(null)
    } else {
      formik.setFieldValue("photo", null)
    }
  }

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

          return <PhotoFormatter photoUrl={photoUrl} altText="No image" />
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
              type="options"
            />
            <Icon
              icon={DeleteIcon}
              onClick={() => handleRemoveIngredientRow(row.index)}
              type="options"
            />
          </div>
        ),
      },
    ],
    [formik.values.ingredients]
  )

  return (
    <div className="recipe-form">
      <BreadcrumbSection
        icon={RecipeIcon}
        pathLinks={{ path: "/recipes", label: "Recipes" }}
        newLabel="New"
        actionButton={{
          label: "Save",
          onClick: formik.handleSubmit,
        }}
        isSubmitting={isSubmitting}
      />

      <div className="form-section">
        <form onSubmit={formik.handleSubmit}>
          <FieldWrapper label="Name" name="recipeName" isRequired>

            <Input
              id="name"
              type="text"
              {...formik.getFieldProps("name")}
              error={formik.errors.name}
              touched={formik.touched.name}
            />
          </FieldWrapper>
          <FieldWrapper label="Description" name="description" isRequired>

            <textarea
              id="description"
              {...formik.getFieldProps("description")}
              className={classNames("input-control", {
                "is-invalid":
                  formik.touched.description && formik.errors.description,
              })}
            />
          </FieldWrapper>
          <FieldWrapper
            label="Preparation time"
            name="preparation_time"
            unit="min"
            isRequired
          >

            <input
              id="preparation_time"
              type="number"
              {...formik.getFieldProps("preparation_time")}
              className={classNames("preparation-input", {
                "is-invalid":
                  formik.touched.preparation_time &&
                  formik.errors.preparation_time,
              })}
            />
          </FieldWrapper>
          <FieldWrapper label="Category" name="category" isRequired>
            <CustomSelect
              options={categories?.map((category) => ({

                value: category.id,
                label: category.name,
              }))}
              value={formik.values.category}
              onChange={(selectedOption) =>
                formik.setFieldValue("category", selectedOption)
              }
              isRequired={true}
              error={formik.errors.category}
              touched={formik.touched.category}
              placeholder={
                formik.touched.category && formik.errors.category
                  ? formik.errors.category
                  : ""
              }
            />
          </FieldWrapper>
          <FieldWrapper label="Tags" name="tags">

            <CustomSelect
              options={tags.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              isMulti
              value={formik.values.tags}
              onChange={(selectedOptions) =>
                formik.setFieldValue("tags", selectedOptions)
              }
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </FieldWrapper>
          <FieldWrapper label="Tags" name="tags">
            <Table
              columns={columns}
              data={formik.values.ingredients.filter(
                (ingredient) => !ingredient._destroy
              )}
              handleAddNew={handleAddIngredient}
              variant="ingredients"
            />
          </FieldWrapper>
          <FieldWrapper label="Photo">
            <Dropzone
              onFileUpload={handleImageUpload}
              currentPhoto={formik.values.photo}
              handleDelete={() => handleDeletePhoto(formik.values.photo.name)}
            />
          </FieldWrapper>

        </form>
      </div>

      <Modal
        onDelete={handleDeleteItem}
        itemName={ingredientToDelete ? "ingredient" : "photo"}
        item={ingredientToDelete || formik.values.photo}
      />
      {ingredientModalShowUp && (
        <IngredientModal
          onClose={handleCloseIngredientModal}
          onConfirm={handleSaveIngredient}
          ingredients={availableIngredients}
          defaultValues={isEditMode ? ingredientToEdit : undefined}
        />
      )}

    </div>
  )
}

export default Recipe
