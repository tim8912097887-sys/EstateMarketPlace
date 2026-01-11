import { Route, Routes } from "react-router";
import * as api from "../api/user"
import { renderWithProvider } from "../utilities/unitTestHelper";
import GuestOnly from "./GuestOnly";
import SignIn from "../pages/SignIn";
import { screen, waitFor } from "@testing-library/react";
import PersistLogin from "./PersistLogin";
import Profile from "../pages/Profile";
import AuthUser from "./AuthUser";

// Mock API call module
vi.mock("../api/user");

describe("PersistLogin Component",() => {

    it('should enter profile page when silent login success', async() => {
        // Mock Refresh API call resolve value
        vi.mocked(api.refreshUser).mockResolvedValue({
            success: true,
           data: {
            accessToken: "valid-token",
            user: {
                email: "test@email.com",
                username: "testUser",
                avatar: "test.jpg"
            }
        }})
        renderWithProvider(
            <>
                <Routes>
                  <Route element={<PersistLogin/>}>
                    <Route element={<GuestOnly/>}>
                      <Route path="/signin" element={<SignIn/>} />
                    </Route>
                    <Route element={<AuthUser/>}>
                       <Route path="/profile" element={<Profile/>} />
                    </Route>
                  </Route>
                </Routes>
            </>,
            {},
            ["/profile"]
        )
        // Loading state
        await waitFor(() => {
            expect(screen.queryByTestId("fullscreen-spinner")).not.toBeInTheDocument();
        })
        // Verify Enter Profile page
        expect(screen.getByPlaceholderText(/email/i)).toHaveValue("test@email.com");
        expect(screen.getByRole("button",{ name: /update/i })).toBeInTheDocument();
        expect(screen.getByRole("button",{ name: /update/i })).toBeVisible();

    })

    it('should enter login page when silent login fail', async() => {
        // Mock Refresh API call resolve value
        vi.mocked(api.refreshUser).mockResolvedValue({
            success: false,
            message: "Unauthenticated"   
        })
        renderWithProvider(
            <>
                <Routes>
                  <Route element={<PersistLogin/>}>
                    <Route element={<GuestOnly/>}>
                      <Route path="/signin" element={<SignIn/>} />
                    </Route>
                    <Route element={<AuthUser/>}>
                       <Route path="/profile" element={<Profile/>} />
                    </Route>
                  </Route>
                </Routes>
            </>,
            {},
            ["/profile"]
        )
        // Loading state
        await waitFor(() => {
            expect(screen.queryByTestId("fullscreen-spinner")).not.toBeInTheDocument();
        })
        // Verify redirect to signin page by AuthUser component
        expect(await screen.findByRole("button",{ name: /login/i })).toBeInTheDocument();
        expect(await screen.findByRole("button",{ name: /login/i })).toBeVisible();

    })
})