import { Outlet } from "react-router"
import Header from "./components/Header"
import { Provider } from "react-redux"
import { store } from "./redux/store"

function App() {

  return (
    <>
      <Provider store={store}>
        <Header/>
        <Outlet/>   
      </Provider> 
    </>
  )
}

export default App
