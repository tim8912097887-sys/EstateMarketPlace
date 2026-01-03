import { useReducer } from "react"
import { loginUser, signupUser } from "../api/user"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { signInFail, signInStart, signInSuccess, signUpFail, signUpStart, signUpSuccess } from "../redux/user/userSlice"
import { useNavigate } from "react-router"

type Props = {
    isLogin: boolean
}

type State = {
    username: string
    email: string
    password: string
}

type InputType = "username" | "email" | "password";

type Action = {
    type: InputType
    payload: string
}

const reducer = (state: State,action: Action) => {
     
    switch (action.type) {
        case "username":
            return { ...state,username: action.payload };
        case "email":
            return { ...state,email: action.payload };
        case "password":
            return { ...state,password: action.payload };
        // If none of these match,simply return state
        default:
            return state;
    }
    
}

const RegisterForm = ({ isLogin }: Props) => {

    const errorMsg = useSelector((state: RootState) => state.user.errorMsg);
    const loading = useSelector((state: RootState) => state.user.loading);
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [state,dispatcher] = useReducer(reducer,{ username: "",email: "",password: "" });
  
    const handleChange = (type: InputType,value: string) => {
        dispatcher({ type,payload: value });
    }

    const handleLogin = async(e: React.FormEvent<HTMLFormElement>) => {
        // Prevent default browser behavier
        e.preventDefault();
        dispatch(signInStart());
        const result = await loginUser({ email: state.email,password: state.password });
        if(typeof result === "string") {
           dispatch(signInFail(result));
        } else {
           dispatch(signInSuccess({ username: result.user.username,accessToken: result.accessToken }));
           console.log("success");
        }
    }

    const handleSignup = async(e: React.FormEvent<HTMLFormElement>) => {

        // Prevent default browser behavier
        e.preventDefault();
        dispatch(signUpStart());
        const result = await signupUser(state);
        if(typeof result === "string") {
           dispatch(signUpFail(result));
        } else {
           dispatch(signUpSuccess());
           navigation("/signin")
           console.log("success signup");
        }
    }

  return (
    <>
       <form className="flex flex-col gap-4" onSubmit={isLogin?handleLogin:handleSignup}>
            {!isLogin && 
                <input 
                    className="p-3 rounded-lg border"
                    type="username" 
                    id="username"
                    name="username"
                    value={state.username}
                    onChange={(e) => handleChange(e.target.name as InputType,e.target.value)}
                />
            }
            <input 
                className="p-3 rounded-lg border"
                type="email" 
                id="email"
                name="email"
                value={state.email}
                onChange={(e) => handleChange(e.target.name as InputType,e.target.value)}
            />
            <input 
                className="p-3 rounded-lg border"
                type="password" 
                id="password"
                name="password"
                value={state.password}
                onChange={(e) => handleChange(e.target.name as InputType,e.target.value)}
            />
            <button className="rounded-lg text-white bg-slate-700 cursor-pointer p-3 uppercase hover:opacity-95 disabled:opacity-80" disabled={loading} type="submit">{loading?"Loading...":isLogin?"Login":"Signup"}</button>
        </form>
        {errorMsg && <p className="text-red-500 mt-5">{errorMsg}</p>}
    </>
  )
}

export default RegisterForm