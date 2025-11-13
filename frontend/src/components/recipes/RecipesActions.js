import axios from "axios"

export const getRecipes = (callback) => {
  axios.get("/recipes").then((response) => callback(response.data))
}

export const deleteRecipe = (recipeId, callback) => {

  axios
    .delete(`/recipes/${recipeId}`)
    .then((response) => callback(response.data))
}
