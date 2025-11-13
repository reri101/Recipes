import axios from "axios/index"

export const login = async (login, password, navigate) => {
  const config = {
    url: "/users/sign_in",
    method: "POST",
    data: { user: { email: login, password } },
    headers: { authorization: "" },
  }

  return axios
    .request(config)
    .then((response) => {
      const token = response.headers.authorization
      if (token) {
        localStorage.setItem("authToken", token)
        localStorage.setItem("userName", response.data.name)
        localStorage.setItem("userRole", response.data.role)

        if (response.data.role === "admin") {
          navigate("/users")
        } else if (response.data.role === "user") {
          navigate("/recipes")
        } else {
          navigate("/")
        }
      }
    })
    .catch((error) => {
      return Promise.reject(error.response?.data?.error || "Login failed")
    })
}
