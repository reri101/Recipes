import React, { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import "./Login.scss"
import Label from "../Label/Label"
import Input from "../input/Input"
import loginImage from "../../assets/images/login_photo.jpg"
import Icon from "../Icon/Icon"
import { ReactComponent as BellIcon } from "../../assets/icons/bell.svg"
import PasswordInput from "../passwordInput/PasswordInput"
import * as actions from "./LoginAction"
import { useNavigate } from "react-router-dom"
import Button from "../button/Button"

const validationSchema = Yup.object({
  login: Yup.string()
    .email("Invalid email format")
    .required("Login is required"),
  password: Yup.string().required("Password is required"),
})

function Login() {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setError(false)
      setIsLoading(true)
      actions
        .login(values.login, values.password, navigate)
        .catch(() => {
          setError(true)
          setIsLoading(false)
        })
        .then(() => {
          setIsLoading(false)
        })
    },
    validateOnChange: () => {
      setError(false)
    },
  })

  return (
    <div className="login">
      <div className="image">
        <img src={loginImage} alt="Login" />
      </div>
      <div className="form">
        <h1 className="welcome-text">NICE TO SEE YOU!</h1>
        {error && (
          <div className="error-box">
            <Icon icon={BellIcon} type="error" />
            The email or password are incorrect. Please try again.
          </div>
        )}
        <form onSubmit={formik.handleSubmit}>
          <div className="form-field">
            <Label htmlFor="login">Login</Label>
            <Input
              id="login"
              type="email"
              {...formik.getFieldProps("login")}
              error={formik.errors.login}
              touched={formik.touched.login}
            />
          </div>

          <div className="form-field">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
              error={formik.errors.password}
              touched={formik.touched.password}
            />
          </div>

          <Button
            type="submit"
            onClick={formik.handleSubmit}
            disabled={isLoading}
            variant="confirm"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
