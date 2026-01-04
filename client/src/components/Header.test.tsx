import { screen } from "@testing-library/react";
import { renderWithProvider } from "../utilities/unitTestHelper"
import Header from "./Header"



describe("Header Unit Test",() => {

    it('should render sign-in link when user not login', () => {
        renderWithProvider(<Header/>);
        expect(screen.getByRole("link",{ name: /sign in/i})).toBeInTheDocument();
        expect(screen.getByRole("link",{ name: /sign in/i})).toHaveAttribute("href","/signin");
    })

    it('should render profile link with image when user login', () => {
        const mockUser = { avatar: "test-url.jpg",username: "testUser" };
        renderWithProvider(<Header/>,{ currentUser: mockUser });
        const profileLink = screen.getByRole("link",{ name: /profile/i });
        const image = screen.getByAltText(/profile/i);
        expect(profileLink).toBeInTheDocument();
        expect(profileLink).toHaveAttribute("href","/profile");
        expect(image).toHaveAttribute("alt","profile");
    })
})