import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { deleteUser, logoutUser } from "../api/user";
import { deleteUserFail, deleteUserStart, deleteUserSuccess, signOutFail, signOutStart, signOutSuccess } from "../redux/user/userSlice";

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

const Profile = () => {
  const { currentUser,loading,errorMsg,accessToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [state,dispatcher] = useReducer(reducer,{ username: "",email: "",password: "" });
  const [file,setFile] = useState<File | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);
  const handleChange = (type: InputType,value: string) => {
        dispatcher({ type,payload: value });
  }
  // Handle user info update
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
  }

  const deleteAccount = async() => {
        // Guard Clause: protect delete account in unauth state(like user double click)
    //   if(!accessToken) return navigation("/signin");
      dispatch(deleteUserStart());
      const result = await deleteUser(accessToken);
      if(result.includes("Successfully")) {
         dispatch(deleteUserSuccess());
         // Navigate to signup page when success
         navigation("/signup");
      } else {
         dispatch(deleteUserFail(result));
      }
  }
  const signout = async() => {
      // Guard Clause: protect signout in unauth state(like user double click)
      if(!currentUser) return navigation("/signin");
      dispatch(signOutStart());
      const resultString = await logoutUser();
      if(resultString.includes("Success")) {
        return dispatch(signOutSuccess());
      } else {
        return dispatch(signOutFail(resultString));
      }
  }
  return (
    <div className="mx-auto max-w-lg p-3">
       <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
       <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <input 
                type="file"
                name="file"
                id="file"
                accept="image/*"
                ref={fileRef}
                onChange={(e) => setFile(e.target.files?.[0])}
                hidden
            />
            <img 
             src={currentUser?.avatar} 
             className="w-24 h-24 rounded-full object-cover self-center mt-2 cursor-pointer" 
             alt="profile" 
             onClick={() => fileRef.current?.click()}
            />
            <input 
                data-testid="username-input"
                placeholder='username'
                className="p-3 rounded-lg border"
                defaultValue={currentUser?.username}
                type="text" 
                id="username"
                name="username"
                onChange={(e) => handleChange(e.target.name as InputType,e.target.value)}
            />
            <input 
                data-testid="email-input"
                placeholder='email'
                className="p-3 rounded-lg border"
                type="email" 
                id="email"
                name="email"
                defaultValue={currentUser?.email}
                onChange={(e) => handleChange(e.target.name as InputType,e.target.value)}
            />
            <input 
                data-testid="password-input"
                placeholder='password'
                className="p-3 rounded-lg border"
                type="password" 
                id="password"
                name="password"
                onChange={(e) => handleChange(e.target.name as InputType,e.target.value)}
            />
            <button type="submit" disabled={loading} className="bg-slate-700 text-white cursor-pointer hover:opacity-95 uppercase rounded-lg p-3 disabled:opacity-80">{loading?"Loading...":"Update"}</button>
       </form>
       <div className="flex justify-between items-center mt-5">
         <button disabled={loading} onClick={deleteAccount} type="button" className="text-red-700 cursor-pointer hover:text-red-500 disabled:text-red-500" >Delete Account</button>
         <button disabled={loading} onClick={signout} type="button" className="text-red-700 cursor-pointer hover:text-red-500 disabled:text-red-500" >Sign out</button>
       </div>
       {errorMsg && <p className="text-red-700 text-2xl">{errorMsg}</p>}
    </div>
  )
}

export default Profile