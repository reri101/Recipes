import axios from "axios"

export const getCategories = (callback) => {
  axios.get("/categories").then((response) => callback(response.data))
}

export const deleteCategory = (categoryId, callback, errorCallback) => {
  axios
    .delete(`/categories/${categoryId}`)
    .then((response) => callback(response.data))
    .catch((error) => {
      if (error.response && error.response.status === 500) {
        errorCallback(
          "You cannot delete a category that is already used in recipes."
        )
      } else {
        errorCallback("An unexpected error occurred. Please try again.")
      }
    })
}
