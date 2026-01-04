import userEvent from "@testing-library/user-event"
import * as api from "../api/user"
import { Route, Routes } from "react-router";
import Home from "./Home";
import SignIn from "./SignIn";
import { renderWithProvider } from "../utilities/unitTestHelper";
import { screen } from "@testing-library/react";
import Header from "../components/Header";
import GuestOnly from "../components/GuestOnly";


describe("Sign In Page Integration",() => {

    it('should successfully login and handle redirect login', async() => {

        const user = userEvent.setup();
        // Mock the api call
        const loginSpy = vi.spyOn(api,"loginUser").mockResolvedValue({
            user: {
                username: "Test Username",
                avatar: "User avatar"
            },
            accessToken: "Test AccessToken"
        })

        renderWithProvider(
            <>
               <Header/>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route element={<GuestOnly/>}>
                        <Route path="/signin" element={<SignIn/>} />
                    </Route>
                </Routes>
            </>
        )

        const mockUserInfo = { email: "test@email.com",password: "testPassword" }
        // Navigate to signin page first
        const signInLink = screen.getByRole("link",{ name: /sign in/i});
        await user.click(signInLink);
        // Select Input Field
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const loginBtn = screen.getByRole("button",{ name: /login/i });
        // Fill out input
        await user.type(emailInput,mockUserInfo.email);
        await user.type(passwordInput,mockUserInfo.password);
        // Submit the form
        await user.click(loginBtn);
        // Verify the api call
        expect(loginSpy).toHaveBeenCalledWith(mockUserInfo);
        // Verify redirect to the home page
        const heading = await screen.findByRole("heading",{ name: /home/i });
        expect(heading).toBeInTheDocument();
    })

    it('should show error message on API failure', async() => {
        const user = userEvent.setup();
        // Track and mock login function
        const loginSpy = vi.spyOn(api,"loginUser").mockResolvedValue("Invalid Email or Password");

        renderWithProvider(
            <>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/signin" element={<SignIn/>} />
                </Routes>
            </>
        )
        const mockUserInfo = { email: "wrong@email.com",password: "testPassword" };
        // Navigate to signin page
        const signInLink = screen.getByRole("link",{ name: /sign in/i });
        await user.click(signInLink);
        // Select Input Field
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const loginBtn = screen.getByRole("button",{ name: /login/i });
        // Fill out input
        await user.type(emailInput,mockUserInfo.email);
        await user.type(passwordInput,mockUserInfo.password);
        // Submit the form
        await user.click(loginBtn);
        // Verify the api call
        expect(loginSpy).toHaveBeenCalledWith(mockUserInfo);
        // Verify the error message appear
        const errorMsg = await screen.findByText(/Invalid Email or Password/i);
        expect(errorMsg).toBeInTheDocument();
    })
})