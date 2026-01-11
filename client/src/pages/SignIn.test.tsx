import userEvent from "@testing-library/user-event"
import * as api from "../api/user"
import { Route, Routes } from "react-router";
import Home from "./Home";
import SignIn from "./SignIn";
import { renderWithProvider } from "../utilities/unitTestHelper";
import { screen } from "@testing-library/react";
import Header from "../components/Header";
import GuestOnly from "../components/GuestOnly";
import { signInWithPopup, type UserCredential } from "firebase/auth";

// Mock API call module and firebase auth module
vi.mock("../api/user");
vi.mock("firebase/auth",() => ({
    GoogleAuthProvider: class {},
    getAuth: vi.fn(),
    signInWithPopup: vi.fn()
}))

describe("Sign In Page Integration",() => {
    let user: ReturnType<typeof userEvent.setup>;
    // Mock data
    const mockGoogleUser = {
        user: {
            email: "test@gmail.com",
            photoURL: "testUrl"
        }
    }
    // Set new user before each test prevent interference between test
    beforeEach(() => {
        user = userEvent.setup();
    })

    it('should successfully login and handle redirect login', async() => {

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

    it('should successfully Login with Google and Redirect to Home Page', async() => {
        // Mock resolve value
        vi.mocked(signInWithPopup).mockResolvedValue(mockGoogleUser as UserCredential);
        vi.mocked(api.googleLogin).mockResolvedValue({
            user: {
               username: "testUsername",
               email: mockGoogleUser.user.email,
               avatar: mockGoogleUser.user.photoURL,
            },
            accessToken: "valid-token"
        });

        renderWithProvider(
            <Routes>
                <Route element={<GuestOnly/>}>
                  <Route path="/signin" element={<SignIn/>} />
                </Route>
                <Route path="/" element={<Home/>} />
            </Routes>,
            {},
            ["/signin"]
        )
        const googleBtn = screen.getByRole("button",{ name: /google/i });

        await user.click(googleBtn);

        // Verify redirect to home page
        expect(screen.getByRole("heading",{ name: /home/i })).toBeInTheDocument();
        expect(screen.getByRole("heading",{ name: /home/i })).toBeVisible();
        expect(screen.queryByRole("button",{ name: /login/i })).not.toBeInTheDocument();
    })

    it('should Fail to Login with Google and show the Error message', async() => {
        const failGoogleUser = {
            user: {
                email: mockGoogleUser.user.email
            }
        }
        // Mock resolve value
        vi.mocked(signInWithPopup).mockResolvedValue(failGoogleUser as UserCredential);


        renderWithProvider(
            <Routes>
                <Route element={<GuestOnly/>}>
                  <Route path="/signin" element={<SignIn/>} />
                </Route>
                <Route path="/" element={<Home/>} />
            </Routes>,
            {},
            ["/signin"]
        )
        const googleBtn = screen.getByRole("button",{ name: /google/i });

        await user.click(googleBtn);

        // Verify stay at SignIn page and display the error message
        expect(screen.getByRole("button",{ name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole("button",{ name: /login/i })).toBeVisible();
        expect(screen.getByText(/fail/i));
    })
})