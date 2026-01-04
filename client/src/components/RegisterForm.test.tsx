import { screen } from "@testing-library/react"
import RegisterForm from "./RegisterForm"
import userEvent from "@testing-library/user-event"
import { renderWithProvider } from "../utilities/unitTestHelper"

describe("RegisterForm Unit Tests",() => {
  
    describe("Login Mode",() => {
        
        it('should NOT render the username field', () => {
            renderWithProvider(<RegisterForm isLogin={true} />);
            // Querybyrole return null if not found
            expect(screen.queryByRole("textbox",{ name: /username/i })).toBeNull();
        })

        it('should render Login button and sign-up navigation link', () => {
            renderWithProvider(<RegisterForm isLogin={true} />);

            expect(screen.getByRole("button",{ name: /login/i })).toBeInTheDocument();
            expect(screen.getByText(/dont have an account/i)).toBeInTheDocument();
            expect(screen.getByRole("link",{ name: /sign up/i })).toHaveAttribute("href","/signup");
        })
    })

    describe("Signup Mode",() => {

        it('should render the username field', () => {
            renderWithProvider(<RegisterForm isLogin={false} />);

            expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        })

        it('should render Sign Up button and sign-in navigation link', () => {
            renderWithProvider(<RegisterForm isLogin={false} />);

            expect(screen.getByRole("button",{ name: /signup/i })).toBeInTheDocument();
            expect(screen.getByText(/have an account/i)).toBeInTheDocument();
            expect(screen.getByRole("link",{ name: /sign in/i })).toHaveAttribute("href","/signin");
        })
    })

    describe("Common Functionality",() => {

        it('should update values on change', async() => {
            renderWithProvider(<RegisterForm isLogin={true}/>)
            const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
            const user = userEvent.setup();
            const typeValue = "yoyo@";
            await user.type(emailInput,typeValue);
            expect(emailInput.value).toBe(typeValue);
        })

        it('should disable the button when loading is true', () => {
            renderWithProvider(<RegisterForm isLogin={true}/>,{ loading: true });
            const submitButton = screen.getByRole("button",{ name: /loading/i });
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toBeDisabled();
        })

        it('should display error message when error present in store', () => {
            const errorMsg = "Invalid Credentials";
            renderWithProvider(<RegisterForm isLogin={true} />, { errorMsg });
            expect(screen.getByText(errorMsg)).toBeInTheDocument();
        })
    })
})
