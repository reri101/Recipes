import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import "./Tag.scss"
import * as actions from "./TagActions"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ReactComponent as TagsIcon } from "../../assets/icons/tags-svg.svg"
import Label from "../Label/Label"
import BreadcrumbSection from "../breadcrumbSection/BreadcrumbSection"
import Input from "../input/Input"
import FieldWrapper from "../fieldWrapper/FieldWrapper"

function Tag() {
  const { tagId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (tagId) {
      actions.getTagById(tagId, (data) => {
        formik.setValues({ ...data })
      })
    }
  }, [tagId])

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true)

      actions
        .createTag(
          {
            ...values,
          },
          () => {
            formik.resetForm()
            navigate("/tags")
          }
        )
        .then(() => {
          setIsSubmitting(false)
        })
    },
  })

  return (
    <div className="tag">
      <BreadcrumbSection
        icon={TagsIcon}
        pathLinks={{ path: "/tags", label: "Tags" }}
        newLabel="New"
        actionButton={{
          label: "Save",
          onClick: formik.handleSubmit,
        }}
        isSubmitting={isSubmitting}
      />
      <div className="tag-form">
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
        </form>
      </div>
    </div>
  )
}

export default Tag
