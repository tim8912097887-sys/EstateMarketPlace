import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { Navigate, Outlet } from "react-router";

const GuestOnly = () => {

    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    // Navigate to home page if login
    if(currentUser) return <Navigate to="/" replace />
  return <Outlet/>
}

export default GuestOnly