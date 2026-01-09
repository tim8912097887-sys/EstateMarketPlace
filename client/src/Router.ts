import { createBrowserRouter } from "react-router";
// import Home from "./pages/Home";
import App from "./App";
// import SignIn from "./pages/SignIn";
// import Signup from "./pages/Signup";
// import About from "./pages/About";
import React from "react";
import AuthUser from "./components/AuthUser";
import Profile from "./pages/Profile";
import PersistLogin from "./components/PersistLogin";
// import GuestOnly from "./components/GuestOnly";

const Home = React.lazy(() => import('./pages/Home'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const About = React.lazy(() => import('./pages/About'));
const GuestOnly = React.lazy(() => import('./components/GuestOnly'));

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
          {
            // Gatekeeper for login state
            Component: PersistLogin,
            children: [
           {
             index: true,
             Component: Home
           },
           {
            // Only unAuth user can enter
            Component: GuestOnly,
            children: [
              {
                path: 'signin',
                Component: SignIn
              },
              {
                path: 'signup',
                Component: SignUp
              }
            ]
           },
           {
             path: 'about',
             Component: About
           },
           {
            Component: AuthUser,
            children: [
               {
                // Only auth user can enter profile
                 path: "profile",
                 Component: Profile
               }
            ]
           }
        ]
          }
        ]
    }
])