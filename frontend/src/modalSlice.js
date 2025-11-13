import { createSlice } from "@reduxjs/toolkit"

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isVisible: false,
    item: null,
  },
  reducers: {
    showModal: (state, action) => {
      state.isVisible = true
      state.item = action.payload
    },
    hideModal: (state) => {
      state.isVisible = false
      state.item = null
    },
  },
})

export const { showModal, hideModal } = modalSlice.actions

export const selectModal = (state) => state.modal
export default modalSlice.reducer
