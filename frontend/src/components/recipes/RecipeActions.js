import axios from "axios"
import { omit } from "lodash"

export const getCategories = () => {
  return axios.get("/categories").then((response) => response.data)
}

export const getTags = () => {
  return axios.get("/tags").then((response) => response.data)
}

export const getIngredients = () => {
  return axios.get("/ingredients").then((response) => response.data)
}

export const getRecipeById = (recipeId, callback) => {

  axios.get(`/recipes/${recipeId}`).then((response) => {
    callback(response.data)
  })
}

export const createRecipe = (recipe, callback) => {

  const config = {
    url: recipe.id ? `/recipes/${recipe.id}` : "/recipes",
    method: recipe.id ? "PUT" : "POST",
    data: { recipe: { ...omit(recipe, ["id"]) } },
  }

  axios.request(config).then((response) => {
    callback(response.data)
  })
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

export const getAllData = () => {
  return axios.all([getCategories(), getTags(), getIngredients()]).then(
    axios.spread((categoriesData, tagsData, ingredientsData) => ({
      categories: categoriesData,
      tags: tagsData,
      ingredients: ingredientsData,
    }))
  )
}

