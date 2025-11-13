import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import axios from "axios"
import { Provider } from "react-redux"
import store from "./store"
import "./index.scss"

import appConfig from "./config/applicationConfiguration"

axios.defaults.baseURL = appConfig.apiUrl
axios.defaults.headers["Accept"] = "application/json"
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    config.headers["Authorization"] = `${token}`
  }
  return config
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
