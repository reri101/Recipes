import axios from "axios"

export const getTags = (callback) => {
  axios.get("/tags").then((response) => {
    callback(response.data)
  })
}

export const deleteTag = (tagId, callback) => {
  axios.delete(`/tags/${tagId}`).then((response) => {
    callback(response.data)
  })
}
