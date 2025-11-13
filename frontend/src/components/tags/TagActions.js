import axios from "axios"

export const createTag = (tag, callback) => {
  const config = {
    url: tag.id ? `/tags/${tag.id}` : "/tags",
    method: tag.id ? "PUT" : "POST",
    data: {
      tag,
    },
  }
  axios.request(config).then((response) => {
    callback(response.data)
  })
}

export const getTagById = (tagId, callback) => {
  axios.get(`/tags/${tagId}`).then((response) => {
    callback(response.data)
  })
}
