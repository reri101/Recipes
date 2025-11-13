import axios from "axios"

export const getUsers = async (callback) => {
  axios.get("/users").then((response) => callback(response.data))
}

export const deleteUser = async (userId, callback) => {
  axios.delete(`/users/${userId}`).then((response) => callback(response.data))
}
