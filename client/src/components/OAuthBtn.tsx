import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app } from "../firebase";
import { googleLogin } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { signInFail, signInStart, signInSuccess } from "../redux/user/userSlice";
import type { RootState } from "../redux/store";

const OAuthBtn = () => {
    const { loading } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const handleOauth = async() => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        dispatch(signInStart());
        const result = await signInWithPopup(auth,provider);
        // If email not found,fail the process
        if(!result.user.email || !result.user.photoURL) {
           dispatch(signInFail("Google auth fail"));
           return;
        }
        
        const username = result.user.email.substring(0,2)+Math.random().toFixed(3);
        const email = result.user.email;
        const res = await googleLogin({ username,email,avatar: result.user.photoURL });
        if(typeof res === "string") {
          dispatch(signInFail(res));
        } else {
          dispatch(signInSuccess(res));
        }
    }
  return (
    <button disabled={loading} onClick={handleOauth} type="button" className="bg-red-700 rounded-lg uppercase text-white p-3 hover:opacity-95 cursor-pointer disabled:opacity-80">{loading?"Loading...":"Continue with Google"}</button>
  )
}

export default OAuthBtn