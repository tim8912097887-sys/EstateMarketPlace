import userEvent from "@testing-library/user-event";
import * as api from "../api/user"
import { renderWithProvider } from "../utilities/unitTestHelper";
import Header from "../components/Header";
import { Route, Routes } from "react-router";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { screen, waitFor } from "@testing-library/react";

describe("Sign Up Page Integration",() => {

    it('should successfully Sign up and redirect to Login page', async() => {
        const user = userEvent.setup();
        // Mock the api call
        const signUpSpy = vi.spyOn(api,"signupUser").mockResolvedValue({
            user: {
                username: "Test Username",
                avatar: "User avatar"
            }
        })

        renderWithProvider(
            <>
               <Header/>
                <Routes>
                    <Route path="/signin" element={<SignIn/>} />
                    <Route path="/signup" element={<SignUp/>} />
                </Routes>
            </>
        )

        const mockUserInfo = { username: "testUsername",email: "test@email.com",password: "testPassword" }
        // Navigate to signin page first
        const signInLink = screen.getByRole("link",{ name: /sign in/i});
        await user.click(signInLink);
        // Navigate to signup page
        const signUpLink = screen.getByRole("link",{ name: /sign up/i});
        await user.click(signUpLink);
        // Select Input Field
        const usernameInput = screen.getByPlaceholderText(/username/i);
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const signUpBtn = screen.getByRole("button",{ name: /signup/i });
        // Fill out input
        await user.type(usernameInput,mockUserInfo.username);
        await user.type(emailInput,mockUserInfo.email);
        await user.type(passwordInput,mockUserInfo.password);
        // Submit the form
        await user.click(signUpBtn);
        // Verify the api call
        expect(signUpSpy).toHaveBeenCalledWith(mockUserInfo);
        // Verify redirect to the home page
        await waitFor(() => {
            screen.queryByPlaceholderText(/username/i);
        })
    })

    it('should show error message with API failure', async() => {
        const user = userEvent.setup();
        // Mock the api call
        const signUpSpy = vi.spyOn(api,"signupUser").mockResolvedValue("User already exist");

        renderWithProvider(
            <>
               <Header/>
                <Routes>
                    <Route path="/signin" element={<SignIn/>} />
                    <Route path="/signup" element={<SignUp/>} />
                </Routes>
            </>
        )

        const mockUserInfo = { username: "DuplicateUsername",email: "test@email.com",password: "testPassword" }
        // Navigate to signin page first
        const signInLink = screen.getByRole("link",{ name: /sign in/i});
        await user.click(signInLink);
        // Navigate to signup page
        const signUpLink = screen.getByRole("link",{ name: /sign up/i});
        await user.click(signUpLink);
        // Select Input Field
        const usernameInput = screen.getByPlaceholderText(/username/i);
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const signUpBtn = screen.getByRole("button",{ name: /signup/i });
        // Fill out input
        await user.type(usernameInput,mockUserInfo.username);
        await user.type(emailInput,mockUserInfo.email);
        await user.type(passwordInput,mockUserInfo.password);
        // Submit the form
        await user.click(signUpBtn);
        // Verify the api call
        expect(signUpSpy).toHaveBeenCalledWith(mockUserInfo);
        // Verify redirect to the home page
        const errorMsg = await screen.findByText(/user already exist/i);
        expect(errorMsg).toBeInTheDocument();
    })
})