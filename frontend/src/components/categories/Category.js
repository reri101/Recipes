import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import "./Category.scss"
import * as actions from "./CategoryActions"
import { Link, useNavigate, useParams } from "react-router-dom"
import Modal from "../modal/Modal"
import { showModal } from "../../modalSlice"
import { useDispatch } from "react-redux"
import Dropzone from "../dropzone/Dropzone"
import { ReactComponent as CategoryIcon } from "../../assets/icons/categories.svg"
import Label from "../Label/Label"
import BreadcrumbSection from "../breadcrumbSection/BreadcrumbSection"
import Input from "../input/Input"
import FieldWrapper from "../fieldWrapper/FieldWrapper"

function Category() {
  const { categoryId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (categoryId) {
      actions.getCategoryById(categoryId, (data) => {
        formik.setValues({ ...data })
      })
    }
  }, [categoryId])

  const formik = useFormik({
    initialValues: {
      name: "",
      photo: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true)

      let photoId = null

      if (values.photo && values.photo.id === undefined) {
        actions
          .uploadPhoto(values.photo)
          .then((uploadedPhotoId) => {
            photoId = uploadedPhotoId

            actions.createCategory(
              {
                ...values,
                photo_id: photoId,
              },
              () => {
                formik.resetForm()
                navigate("/categories")
              }
            )
          })
          .then(() => {
            setIsSubmitting(false)
          })
      } else {
        if (values.photo && values.photo.id) photoId = values.photo.id

        actions
          .createCategory(
            {
              ...values,
              photo_id: photoId,
            },
            () => {
              formik.resetForm()
              navigate("/categories")
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
    <div className="category">
      <BreadcrumbSection
        icon={CategoryIcon}
        pathLinks={{ path: "/categories", label: "Categories" }}
        newLabel="New"
        actionButton={{
          label: "Save",
          onClick: formik.handleSubmit,
        }}
        isSubmitting={isSubmitting}
      />
      <div className="category-form">
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

export default Category
