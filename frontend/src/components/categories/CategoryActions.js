import axios from "axios"

export const createCategory = (category, callback) => {
  const config = {
    url: category.id ? `/categories/${category.id}` : "/categories",
    method: category.id ? "PUT" : "POST",
    data: {
      category,
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

export const getCategoryById = (categoryId, callback) => {
  axios
    .get(`/categories/${categoryId}`)
    .then((response) => callback(response.data))
}
