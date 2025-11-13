import axios from "axios"

export const createIngredient = (ingredient, callback) => {
  const config = {
    url: ingredient.id ? `/ingredients/${ingredient.id}` : "/ingredients",
    method: ingredient.id ? "PUT" : "POST",
    data: {
      ingredient,
    },
  }
  axios.request(config).then((response) => callback(response.data))
}

export const uploadPhoto = (file) => {
  const formData = new FormData()
  formData.append("photo[file_data]", file)

  return axios
    .post("/photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      return response.data.id
    })
}

export const getIngredientById = (ingredientId, callback) => {
  axios
    .get(`/ingredients/${ingredientId}`)
    .then((response) => callback(response.data))
}
