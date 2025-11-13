import axios from "axios"

export const getIngredients = (callback) => {
  axios.get("/ingredients").then((response) => callback(response.data))
}

export const deleteIngredient = (ingredientId, callback) => {
  axios
    .delete(`/ingredients/${ingredientId}`)
    .then((response) => callback(response.data))
}
