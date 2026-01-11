import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router"
import userReducer from "../redux/user/userSlice"
import { render } from "@testing-library/react"

// Utility function for render with Provider and router
export const renderWithProvider = (ui: React.ReactElement,initialState = {},initialRoute = ["/"]) => {

    // Configure store according to parameters
    const store = configureStore({
        reducer: { user: userReducer},
        preloadedState: { user: { errorMsg: "",loading: false,currentUser: null,accessToken: "",...initialState }}
    })

    return render(
        <Provider store={store}>
           <MemoryRouter initialEntries={initialRoute}>
              {ui}
           </MemoryRouter>
        </Provider>
    )
}
