import axios from "axios"

export const createUser = async (user, callback) => {
  const config = {
    url: user.id ? `/users/${user.id}` : "/users",
    method: user.id ? "PUT" : "POST",
    data: {
      user: { ...user },
    },
  }
  axios.request(config).then((response) => callback(response.data))
}

export const uploadPhoto = async (file) => {
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

export const getUserById = async (userId, callback) => {
  axios.get(`/users/${userId}`).then((response) => callback(response.data))
}
