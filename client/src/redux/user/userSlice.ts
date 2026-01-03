import { createSlice } from "@reduxjs/toolkit";

// Initialize the state
const initialState = {
    currentUser: "",
    errorMsg: "",
    accessToken: "",
    loading: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInSuccess: (state,action) => {
            state.currentUser = action.payload.username;
            state.accessToken = action.payload.accessToken;
            state.errorMsg = "";
            state.loading = false;
        },
        signInFail: (state,action) => {
            state.errorMsg = action.payload;
            state.loading = false;
        },
        signInStart: (state) => {
            state.loading = true;
        },
        signUpSuccess: (state) => {
            state.errorMsg = "";
            state.loading = false;
        },
        signUpFail: (state,action) => {
            state.errorMsg = action.payload;
            state.loading = false;
        },
        signUpStart: (state) => {
            state.loading = true;
        },
        signOutSuccess: (state) => {
            state.currentUser = "";
            state.accessToken = "";
            state.errorMsg = "";
            state.loading = false;
        },
        signOutFail: (state,action) => {
            state.errorMsg = action.payload;
            state.loading = false;
        },
        signOutStart: (state) => {
            state.loading = true;
        },
    }
})
// For dispatch the task
export const { signInStart,signInFail,signInSuccess,signOutFail,signOutStart,signOutSuccess,signUpFail,signUpStart,signUpSuccess } = userSlice.actions;
// Use in store
export default userSlice.reducer;