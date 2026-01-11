import { Route, Routes } from "react-router"
import { renderWithProvider } from "../utilities/unitTestHelper"
import Profile from "./Profile"
import { screen } from "@testing-library/react"
import AuthUser from "../components/AuthUser"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import GuestOnly from "../components/GuestOnly"
import userEvent from "@testing-library/user-event"
import * as api from "../api/user"

// Mock the api call module
vi.mock("../api/user");

describe("Profile Page",() => {

    const mockAuthUser = {
        accessToken: "valid-token",
        currentUser: {
           email: "test@email.com",
           username: "testUser",
           avatar: "test.jpg"
        }
    }
    let user: ReturnType<typeof userEvent.setup>;
    // Set new user event object before each test prevent interference between test
    beforeEach(() => {
       user = userEvent.setup();
    })
    it('should show the login email and username in the profile field', () => {
        renderWithProvider(
            (<Routes>
                <Route path="/profile" element={<Profile/>} />
            </Routes>),
            mockAuthUser,
            ["/profile"]
        )
        expect(screen.getByPlaceholderText(/username/i)).toHaveValue(mockAuthUser.currentUser.username);
        expect(screen.getByPlaceholderText(/email/i)).toHaveValue(mockAuthUser.currentUser.email);
    })

    it('should Successfully Signout and redirect to Signin page', async() => {
        // Mock success state
        vi.mocked(api.logoutUser).mockResolvedValue("Success Logout");
        renderWithProvider(
                <Routes>
                    <Route element={<AuthUser/>}>
                    <Route path="/profile" element={<Profile/>}/>
                    </Route>
                    <Route element={<GuestOnly/>}>
                    <Route path="/signin" element={<SignIn/>} />
                    <Route path="/signup" element={<SignUp/>} />
                    </Route>
                </Routes>,
            mockAuthUser,
            ["/profile"]
        )

        const signoutBtn = screen.getByRole("button",{ name: /sign out/i });
        // Click Signout button
        await user.click(signoutBtn);
        // Login button should appear
        expect(screen.getByRole("button",{ name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole("button",{ name: /login/i })).toBeVisible();
    })

    it('should Signout fail and display Error message', async() => {
        // Mock success state
        vi.mocked(api.logoutUser).mockResolvedValue("Server Error");
        renderWithProvider(
                <Routes>
                    <Route element={<AuthUser/>}>
                    <Route path="/profile" element={<Profile/>}/>
                    </Route>
                    <Route element={<GuestOnly/>}>
                    <Route path="/signin" element={<SignIn/>} />
                    <Route path="/signup" element={<SignUp/>} />
                    </Route>
                </Routes>,
            mockAuthUser,
            ["/profile"]
        )

        const signoutBtn = screen.getByRole("button",{ name: /sign out/i });
        // Click Signout button
        await user.click(signoutBtn);
        // Update button should maintain on the screen
        expect(screen.getByRole("button",{ name: /update/i })).toBeInTheDocument();
        expect(screen.getByRole("button",{ name: /update/i })).toBeVisible();
        // Error message should show up
        expect(screen.getByText(/signout fail/i)).toBeInTheDocument();
        expect(screen.getByText(/signout fail/i)).toBeVisible();
    })

    it('should Successfully Update and show the Updated Info', async() => {
        const updatedEmail = "test123@email.com";
        // Mock success state
        vi.mocked(api.updateUser).mockResolvedValue({ user: {
                    email: updatedEmail,
                    username: mockAuthUser.currentUser.username,
                    avatar: mockAuthUser.currentUser.avatar
                }});
        renderWithProvider(
                <Routes>
                    <Route element={<AuthUser/>}>
                    <Route path="/profile" element={<Profile/>}/>
                    </Route>
                    <Route element={<GuestOnly/>}>
                    <Route path="/signin" element={<SignIn/>} />
                    <Route path="/signup" element={<SignUp/>} />
                    </Route>
                </Routes>,
            mockAuthUser,
            ["/profile"]
        )

        const emailInput = screen.getByPlaceholderText(/email/i);
        // Clear the existing value
        await user.clear(emailInput);
        // Enter updated value
        await user.type(emailInput,updatedEmail);
        const updateBtn = screen.getByRole("button",{ name: /update/i });
        // Click Update button
        await user.click(updateBtn);
        // Show the updated value and success message
        expect(emailInput).toHaveValue(updatedEmail);
        expect(screen.getByPlaceholderText(/password/i)).toHaveValue("");
        expect(screen.getByText(/update success/i)).toBeInTheDocument();
        expect(screen.getByText(/update success/i)).toBeVisible();
    })

    it('should Update fail and show the Error message', async() => {
        const duplicateUser = "duplicateUsername";
        // Mock success state
        vi.mocked(api.updateUser).mockResolvedValue("Username already exist");
        renderWithProvider(
                <Routes>
                    <Route element={<AuthUser/>}>
                    <Route path="/profile" element={<Profile/>}/>
                    </Route>
                    <Route element={<GuestOnly/>}>
                    <Route path="/signin" element={<SignIn/>} />
                    <Route path="/signup" element={<SignUp/>} />
                    </Route>
                </Routes>,
            mockAuthUser,
            ["/profile"]
        )

        const usernameInput = screen.getByPlaceholderText(/username/i);
        // Clear the existing value
        await user.clear(usernameInput);
        // Enter updated value
        await user.type(usernameInput,duplicateUser);
        const updateBtn = screen.getByRole("button",{ name: /update/i });
        // Click Update button
        await user.click(updateBtn);
        // Show the updated value and error message
        expect(usernameInput).toHaveValue(duplicateUser);
        expect(screen.getByText(/username already exist/i)).toBeInTheDocument();
        expect(screen.getByText(/username already exist/i)).toBeVisible();
    })

    it('should Successfully Delete account and redirect to Signin page', async() => {
        // Mock success state
        vi.mocked(api.deleteUser).mockResolvedValue("Successfully Delete");
        renderWithProvider(
                <Routes>
                    <Route element={<AuthUser/>}>
                    <Route path="/profile" element={<Profile/>}/>
                    </Route>
                    <Route element={<GuestOnly/>}>
                    <Route path="/signin" element={<SignIn/>} />
                    <Route path="/signup" element={<SignUp/>} />
                    </Route>
                </Routes>,
            mockAuthUser,
            ["/profile"]
        )

        const deleteBtn = screen.getByRole("button",{ name: /delete/i });
        // Start delete process
        await user.click(deleteBtn);
        // Signup button should show up
        expect(screen.getByRole("button",{ name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole("button",{ name: /login/i })).toBeVisible();
    })

    it('should Delete fail and show the Error message', async() => {
        // Mock success state
        vi.mocked(api.deleteUser).mockResolvedValue("Fail to Delete");
        renderWithProvider(
                <Routes>
                    <Route element={<AuthUser/>}>
                    <Route path="/profile" element={<Profile/>}/>
                    </Route>
                    <Route element={<GuestOnly/>}>
                    <Route path="/signin" element={<SignIn/>} />
                    <Route path="/signup" element={<SignUp/>} />
                    </Route>
                </Routes>,
            mockAuthUser,
            ["/profile"]
        )

        const deleteBtn = screen.getByRole("button",{ name: /delete/i });
        // Start delete process
        await user.click(deleteBtn);
        // Stay in the same page and show the Error message
        expect(screen.getByRole("button",{ name: /update/i })).toBeInTheDocument();
        expect(screen.getByRole("button",{ name: /update/i })).toBeVisible();
        expect(screen.getByText(/fail to delete/i)).toBeVisible();
        expect(screen.getByText(/fail to delete/i)).toBeInTheDocument();
    })
})