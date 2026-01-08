import { createSlice } from "@reduxjs/toolkit";

type IintialState = {
    currentUser: null | { username: string,email: string,avatar: string }
    errorMsg: string
    accessToken: string
    loading: boolean
}

// Initialize the state
const initialState: IintialState = {
    currentUser: null,
    errorMsg: "",
    accessToken: "",
    loading: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInSuccess: (state,action) => {
            state.currentUser = action.payload.user;
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
            state.currentUser = null;
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
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.accessToken = "";
            state.loading = false;
            state.errorMsg = "";
        },
        deleteUserFail: (state,action) => {
            state.loading = false;
            state.errorMsg = action.payload;
        }
    }
})
// For dispatch the task
export const { 
    signInStart
    ,signInFail
    ,signInSuccess
    ,signOutFail
    ,signOutStart
    ,signOutSuccess
    ,signUpFail
    ,signUpStart
    ,signUpSuccess
    ,deleteUserFail
    ,deleteUserStart
    ,deleteUserSuccess } = userSlice.actions;
// Use in store
export default userSlice.reducer;