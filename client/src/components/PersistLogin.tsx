import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { useEffect, useState } from "react";
import { refreshUser } from "../api/user";
import { signInSuccess } from "../redux/user/userSlice";
import { Outlet } from "react-router";
import ScreenSpinner from "./Spinner";

const PersistLogin = () => {

    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const dispatch = useDispatch();
    // Local state
    const [loading,setLoading] = useState(true);
    // Execute only on page reload and first landing
    useEffect(() => {
        const verifyRefreshToken = async() => {

          const result = await refreshUser();
          if(result.success) {
             // Set the data from refresh user
             dispatch(signInSuccess(result.data));
          } else {
             console.error(`Refresh Error: ${result.message}`);
          }
          setLoading(false);
        }
        // Only refresh token if it's unauthenticated
        accessToken?setLoading(false):verifyRefreshToken();
    },[])


  return (
    <>
      {loading?
        <ScreenSpinner/>
        :
        <Outlet/>
      }
    </>
  )
}

export default PersistLogin