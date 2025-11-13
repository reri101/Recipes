import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import "./Ingredient.scss"
import * as actions from "./IngredientActions"
import { Link, useNavigate, useParams } from "react-router-dom"
import Modal from "../modal/Modal"
import { showModal } from "../../modalSlice"
import { useDispatch } from "react-redux"
import Dropzone from "../dropzone/Dropzone"
import { ReactComponent as IngredientIcon } from "../../assets/icons/ingredients.svg"
import Label from "../Label/Label"
import BreadcrumbSection from "../breadcrumbSection/BreadcrumbSection"
import Input from "../input/Input"
import Select from "../select/Select"
import FieldWrapper from "../fieldWrapper/FieldWrapper"

function Ingredient() {
  const { ingredientId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (ingredientId) {
      actions.getIngredientById(ingredientId, (data) => {
        formik.setValues({ ...data })
      })
    }
  }, [ingredientId])

  const formik = useFormik({
    initialValues: {
      name: "",
      unit: "",
      photo: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      unit: Yup.string().required("Unit is required"),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true)

      let photoId = null

      if (values.photo && values.photo.id === undefined) {
        actions
          .uploadPhoto(values.photo)
          .then((uploadedPhotoId) => {
            photoId = uploadedPhotoId

            actions.createIngredient(
              {
                ...values,
                photo_id: photoId,
              },
              () => {
                formik.resetForm()
                navigate("/ingredients")
              }
            )
          })
          .then(() => {
            setIsSubmitting(false)
          })
      } else {
        if (values.photo && values.photo.id) photoId = values.photo.id

        actions
          .createIngredient(
            {
              ...values,
              photo_id: photoId,
            },
            () => {
              formik.resetForm()
              navigate("/ingredients")
            }
          )
          .then(() => {
            setIsSubmitting(false)
          })
      }
    },
  })

  const handleImageUpload = (file) => {
    formik.setFieldValue("photo", file)
  }

  const handleDelete = (itemName) => {
    dispatch(showModal({ name: itemName }))
  }

  return (
    <div className="ingredient">
      <BreadcrumbSection
        icon={IngredientIcon}
        pathLinks={{ path: "/ingredients", label: "Ingredients" }}
        newLabel="New"
        actionButton={{
          label: "Save",
          onClick: formik.handleSubmit,
        }}
        isSubmitting={isSubmitting}
      />
      <div className="ingredient-form">
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
          <FieldWrapper label="Unit" name="unit" isRequired>
            <Select
              isRequired
              options={[
                { value: "Tablespoons", label: "Tablespoons" },
                { value: "Grams", label: "Grams" },
                { value: "Slices", label: "Slices" },
                { value: "Liters", label: "Liters" },
                { value: "Quantity", label: "Quantity" },
              ]}
              value={
                formik.values.unit
                  ? { value: formik.values.unit, label: formik.values.unit }
                  : null
              }
              onChange={(selectedOption) =>
                formik.setFieldValue("unit", selectedOption?.value)
              }
              error={formik.errors.unit}
              touched={formik.touched.unit}
              placeholder={
                formik.touched.unit && formik.errors.unit
                  ? formik.errors.unit
                  : ""
              }
            />
          </FieldWrapper>
          <FieldWrapper label="Photo">
            <Dropzone
              onFileUpload={handleImageUpload}
              currentPhoto={formik.values.photo}
              handleDelete={() => handleDelete(formik.values.photo.name)}
            />
          </FieldWrapper>
        </form>
      </div>
      <Modal
        onDelete={() => formik.setFieldValue("photo", null)}
        itemName="photo"
      />
    </div>
  )
}

export default Ingredient
