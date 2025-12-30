import { createBrowserRouter } from "react-router";
// import Home from "./pages/Home";
import App from "./App";
// import SignIn from "./pages/SignIn";
// import Signup from "./pages/Signup";
// import About from "./pages/About";
import React from "react";

const Home = React.lazy(() => import('./pages/Home'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const About = React.lazy(() => import('./pages/About'));

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
           {
             index: true,
             Component: Home
           },
           {
             path: 'signin',
             Component: SignIn
           },
           {
             path: 'signup',
             Component: SignUp
           },
           {
             path: 'about',
             Component: About
           }
        ]
    }
])