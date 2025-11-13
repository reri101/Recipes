import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import "./User.scss"
import * as actions from "./UserActions"
import { useNavigate, useParams } from "react-router-dom"
import Modal from "../modal/Modal"
import { showModal } from "../../modalSlice"
import { useDispatch } from "react-redux"
import Dropzone from "../dropzone/Dropzone"
import { ReactComponent as UserIcon } from "../../assets/icons/user.svg"
import BreadcrumbSection from "../breadcrumbSection/BreadcrumbSection"
import Input from "../input/Input"
import Select from "../select/Select"
import Checkbox from "../checkbox/Checkbox"
import FieldWrapper from "../fieldWrapper/FieldWrapper"

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  role: Yup.string().required("Role is required"),
})

function User() {
  const { userId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [changePasswordCheck, setChangePasswordCheck] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (userId) {
      actions.getUserById(userId, (data) => {
        formik.setValues({ ...data })
      })
    }
  }, [userId])

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      role: "user",
      photo: null,
    },
    validationSchema,
    onSubmit: (values) => {
      setIsSubmitting(true)

      if (values.photo && !values.photo.id) {
        actions
          .uploadPhoto(values.photo)
          .then((uploadedPhotoId) => {
            actions.createUser(
              {
                ...values,
                photo_id: uploadedPhotoId,
              },
              () => {
                formik.resetForm()
              }
            )
          })
          .then(() => {
            setIsSubmitting(false)
            navigate("/users")
          })
      } else {
        actions
          .createUser(
            {
              ...values,
              photo_id: values.photo ? values.photo.id : null,
            },
            () => {
              formik.resetForm()
            }
          )
          .then(() => {
            setIsSubmitting(false)
            navigate("/users")
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

  const handleChangePasswordCheck = () => {
    setChangePasswordCheck(!changePasswordCheck)
    if (!changePasswordCheck) {
      formik.setFieldValue("password", "")
      formik.setFieldValue("passwordConfirmation", "")
    }
  }

  return (
    <div className="user">
      <BreadcrumbSection
        icon={UserIcon}
        pathLinks={{ path: "/users", label: "Users" }}
        newLabel="New"
        actionButton={{
          label: "Save",
          onClick: formik.handleSubmit,
        }}
        isSubmitting={isSubmitting}
      />
      <div className="user-form">
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
          <FieldWrapper label="Surname" name="surname">
            <Input
              id="surname"
              type="text"
              {...formik.getFieldProps("surname")}
              error={formik.errors.name}
              touched={formik.touched.name}
            />
          </FieldWrapper>
          <FieldWrapper label="Email" name="email" isRequired>
            <Input
              id="email"
              type="text"
              {...formik.getFieldProps("email")}
              error={formik.errors.email}
              touched={formik.touched.email}
            />
          </FieldWrapper>
          {!userId && (
            <>
              <FieldWrapper label="Password" name="password" isRequired>
                <Input
                  id="password"
                  type="password"
                  {...formik.getFieldProps("password")}
                  error={formik.errors.password}
                  touched={formik.touched.password}
                />
              </FieldWrapper>
              <FieldWrapper
                label="Confirm Password"
                name="passwordConfirmation"
                isRequired
              >
                <Input
                  id="passwordConfirmation"
                  type="password"
                  {...formik.getFieldProps("passwordConfirmation")}
                  error={formik.errors.passwordConfirmation}
                  touched={formik.touched.passwordConfirmation}
                />
              </FieldWrapper>
            </>
          )}

          <FieldWrapper label="Role" name="role" isRequired>
            <Select
              isRequired
              options={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
              ]}
              value={
                formik.values.role
                  ? { value: formik.values.role, label: formik.values.role }
                  : null
              }
              onChange={(selectedOption) =>
                formik.setFieldValue("role", selectedOption?.value)
              }
              error={formik.errors.role}
              touched={formik.touched.role}
            />
          </FieldWrapper>
          <FieldWrapper label="Photo">
            <Dropzone
              onFileUpload={handleImageUpload}
              currentPhoto={formik.values.photo}
              handleDelete={() => handleDelete(formik.values.photo.name)}
            />
          </FieldWrapper>
          {userId && (
            <FieldWrapper label="Change Password">
              <Checkbox
                handleCheckboxChecked={changePasswordCheck}
                handleCheckboxChange={handleChangePasswordCheck}
              />
            </FieldWrapper>
          )}

          {changePasswordCheck && (
            <>
              <FieldWrapper label="Password" name="password" isRequired>
                <Input
                  id="password"
                  type="password"
                  {...formik.getFieldProps("password")}
                  error={formik.errors.password}
                  touched={formik.touched.password}
                />
              </FieldWrapper>
              <FieldWrapper
                label="Confirm Password"
                name="passwordConfirmation"
                isRequired
              >
                <Input
                  id="passwordConfirmation"
                  type="password"
                  {...formik.getFieldProps("passwordConfirmation")}
                  error={formik.errors.passwordConfirmation}
                  touched={formik.touched.passwordConfirmation}
                />
              </FieldWrapper>
            </>
          )}
        </form>
      </div>
      <Modal
        onDelete={() => formik.setFieldValue("photo", null)}
        itemName="photo"
      />
    </div>
  )
}

export default User
