
import React, { useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import CustomSelect from "../select/Select"
import Input from "../input/Input"
import "./IngredientModal.scss"
import Button from "../button/Button"
import FieldWrapper from "../fieldWrapper/FieldWrapper"

const validationSchema = Yup.object({
  ingredient: Yup.object().required("Ingredient is required"),
  quantity: Yup.string().required("Quantity is required"),
})

const IngredientModal = ({
  ingredients,
  onConfirm,
  onClose,
  defaultValues,
}) => {
  useEffect(() => {
    formik.setValues({
      ingredient: defaultValues?.ingredient || null,
      quantity: defaultValues?.amount || "",
    })
  }, [defaultValues])

  const formik = useFormik({
    initialValues: { ingredient: null, quantity: "" },
    validationSchema,
    onSubmit: (values) => {
      onConfirm({
        ingredient: values.ingredient,
        amount: values.quantity,
        prevIngredient: defaultValues?.ingredient,
      })
      onClose()
    },
  })

  return (
    <div className="modal">
      <div className="content">
        <h3 className="header">
          Ingredient >{" "}
          <span className="bold">{defaultValues ? "Edit" : "New"}</span>
        </h3>

        <form onSubmit={formik.handleSubmit}>
          <div className="confirmation-text">
            <FieldWrapper label="Ingredient" name="ingredientSelect" isRequired>
              <CustomSelect
                id="ingredientSelect"
                options={ingredients.map((ingredient) => ({
                  value: ingredient.id,
                  label: ingredient.name,
                }))}
                value={formik.values.ingredient}
                onChange={(option) =>
                  formik.setFieldValue("ingredient", option)
                }
                placeholder="Select an ingredient"
              />
            </FieldWrapper>
            <FieldWrapper label="Amount" name="quantity" isRequired>
              <Input
                id="quantity"
                type="text"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                placeholder="Enter the quantity"
                name="quantity"
              />
            </FieldWrapper>
          </div>

          <div className="actions">
            <Button onClick={onClose} type="button" variant="cancel">
              Cancel
            </Button>
            <Button type="submit" variant="confirm">
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IngredientModal
