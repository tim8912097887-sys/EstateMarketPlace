
const loginEmail = "lbj@gmail.com";
const password = "Qwe1267?";

describe("Auth Workflow",() => {
    describe("Login Mode",() => {

        beforeEach(() => {
            // Intercept the login API call and give it a alias
            cy.intercept("POST","/api/users/signin").as("loginRequest")
        })

        it('should redirect to home page after successfully Login', () => {
            // Login
            cy.login(loginEmail,password);
            // Wait for API response
            cy.wait("@loginRequest").then((interception) => {
                // Verify successful response
                expect(interception.response.statusCode).to.eq(200);
                expect(interception.response.body.success).to.be.true;
            })
            // Verify redirection 
            cy.url().should("eq",Cypress.config().baseUrl+"/");
            // Check Redux state reflection in Header
            cy.get("img[alt='profile']").should("exist").and("be.visible");
            cy.get("a[href='/signin']").should("not.exist");
        })

        it('should show the error message if error occur', () => {
            
            // Login with incorrect email
            cy.login("wrong@email.com",password);
            // Wait for API response
            cy.wait("@loginRequest").then((interception) => {
                 expect(interception.response.statusCode).to.eq(400);
                 expect(interception.response.body.success).to.be.false;
            })
            // Verify Error display
            cy.url().should("eq",Cypress.config().baseUrl+"/signin");
            cy.get("a[href='/signin']").should("exist").and("be.visible");
            cy.get("[data-testid='form-error']").should("exist").and("be.visible");
        })
    })

    describe("SignUp Mode",() => {

        const signUpUsername = `curry${Math.random().toFixed(5)}`;
        const signUpEmail = `${signUpUsername}@email.com`;
        
        beforeEach(() => {
            // Intercept the Signup API call and give it a alias
            cy.intercept("POST","/api/users/signup").as("signUpRequest");
        })
        
        it('should successfully Sign Up and redirect to Login page', () => {
            // Sign Up
            cy.signUp(signUpUsername,signUpEmail,password);
            // Wait for API response
            cy.wait("@signUpRequest").then((interception) => {
                // Verify successful response
                expect(interception.response.statusCode).to.eq(201);
                expect(interception.response.body.success).to.be.true;
            })
            // Verify redirection by URL and username field
            cy.url().should("include","signin");
            cy.get("[data-testid='username-input']").should("not.exist");
        })
        
        it('should fail with duplicate user or email and display it', () => {
            // Sign Up
            cy.signUp(signUpUsername,loginEmail,password);
            // Wait for API response
            cy.wait("@signUpRequest").then((interception) => {
                // Verify fail response
                expect(interception.response.statusCode).to.eq(409);
                expect(interception.response.body.success).to.be.false;
            })
            // Verify Error Display
            cy.url().should("include","signup");
            cy.get("[data-testid='username-input']").should("exist");
            cy.get("[data-testid='form-error']").should("exist").and("be.visible");

        })
    })
})