import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { Navigate, Outlet } from "react-router";

const AuthUser = () => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    if(!currentUser) return <Navigate to="/signin" replace />;

  return <Outlet/>;
}

export default AuthUser