

describe("Profile Change",() => {
        // User data
        const signUpUsername = `curry${Math.random().toFixed(5)}`;
        const signUpEmail = `${signUpUsername}@email.com`;
        const signUpPassword = "Qwe1267?";

        beforeEach(() => {
            // Create user through API speed up the process
            cy.request({
               url: "/api/users/signup",
               method: "POST",
               body: { username: signUpUsername,email: signUpEmail,password: signUpPassword },
               // Ignore duplicate Error
               failOnStatusCode: false
            }) 
            // Intercept the login API call and give it a alias
            cy.intercept("POST","/api/users/signin").as("loginRequest");
            // Login user
            cy.login(signUpEmail,signUpPassword);
            cy.wait("@loginRequest").then((interception) => {
                 expect(interception.response.statusCode).to.eq(200);
                 expect(interception.response.body.success).to.be.true;
            })
            // Navigate to Profile page
            cy.get("[data-testid='profile-link']").click();    
        })
    describe("Delete Account",() => {
    
        it('should Successfully delete an account and Redirect to SignIn page', () => {

            cy.intercept("DELETE","/api/users/me").as("deleteAccount");
            cy.get("[data-testid='delete-account']").click();
            // Confirm the loading state
            cy.get("[data-testid='delete-account']").should("be.disabled");
            // Wait for delete complete
            cy.wait("@deleteAccount").then((interception) => {
                 expect(interception.response.statusCode).to.eq(200);
                 expect(interception.response.body.success).to.be.true;
            })
            // Verify redirect to SignIn page
            cy.url().should("contain","signin");
            cy.get("[data-testid='profile-link']").should("not.exist");
            cy.get("a[href='/signin']").should("exist").and("be.visible");
        })

        it('should Fail to delete an account and Show the Error message', () => {
            // Stub the Error response 
            cy.intercept("DELETE","/api/users/me",{
               statusCode: 500,
               body: {
                  success: false,
                  message: "Server Error"
               }
            }).as("deleteAccount");
            cy.get("[data-testid='delete-account']").click();
            // Wait for delete complete
            cy.wait("@deleteAccount").then((interception) => {
                 expect(interception.response.statusCode).to.eq(500);
                 expect(interception.response.body.success).to.be.false;
            })
            // Verify stay at the same page and show up Error message
            cy.url().should("contain","profile");
            cy.get("[data-testid='delete-account']").should("exist").and("be.visible");
            cy.get("[data-testid='profile-error']").should("exist").and("be.visible").contains(/server error/i);
        })
    })

    describe("Signout Account",() => {

    
        it('should Successfully Signout an account and Redirect to SignIn page', () => {

            cy.intercept("DELETE","/api/users/logout").as("signoutAccount");
          
            cy.get("[data-testid='logout-account']").click();
            // Confirm the disappear after rerender
            cy.get("[data-testid='logout-account']").should("not.exist");
            // Wait for Signout complete
            cy.wait("@signoutAccount").then((interception) => {
                 expect(interception.response.statusCode).to.eq(200);
                 expect(interception.response.body.success).to.be.true;
            })
            // Verify redirect to SignIn page
            cy.url().should("contain","signin");
            cy.get("[data-testid='profile-link']").should("not.exist");
            cy.get("a[href='/signin']").should("exist").and("be.visible");
        })

        it('should Fail to Signout an account and display the Error message', () => {
            // Stub the Error response  
            cy.intercept("DELETE","/api/users/logout",{
                statusCode: 500,
                body: {
                    success: false,
                    message: "Server Error"
                }
            }).as("signoutAccount");
          
            cy.get("[data-testid='logout-account']").click();
            // Wait for Signout complete
            cy.wait("@signoutAccount").then((interception) => {
                 expect(interception.response.statusCode).to.eq(500);
                 expect(interception.response.body.success).to.be.false;
            })
            // Verify stay at the same page and Error message show up
            cy.url().should("contain","profile");
            cy.get("[data-testid='profile-link']").should("exist").and("be.visible");
            cy.get("[data-testid='profile-error']").should("exist").and("be.visible").contains(/signout fail/i);
      })
   })
    
   describe("Update Account",() => {

     it('should Successfully update account and the field display with updated value', () => {
          const updatedUsername = `ad${Math.random().toFixed(5)}`;
          const updatedEmail = `${updatedUsername}@gmail.com`;
          // Type in updated value
          cy.get("[data-testid='username-input']").clear().type(updatedUsername);
          cy.get("[data-testid='email-input']").clear().type(updatedEmail);
          // Intercept the API call
          cy.intercept("PUT","/api/users/me").as("updateRequest");
          cy.get("[data-testid='update-account']").click();

          cy.wait("@updateRequest").then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
                expect(interception.response.body.success).to.be.true;
          })
          // Verify the updated value and success message display
          cy.get("[data-testid='username-input']").should("contain.value",updatedUsername);
          cy.get("[data-testid='email-input']").should("contain.value",updatedEmail);
          cy.get("[data-testid='update-success']").should("exist").and("be.visible").contains(/success/i);

     })

     it('should Fail to update account and display Error message', () => {
          const updatedUsername = `ad${Math.random().toFixed(5)}`;
          const updatedEmail = `${updatedUsername}@gmail.com`;
          // Type in updated value
          cy.get("[data-testid='username-input']").clear().type(updatedUsername);
          cy.get("[data-testid='email-input']").clear().type(updatedEmail);
          // Intercept the API call
          cy.intercept("PUT","/api/users/me",{
               statusCode: 409,
               body: {
                    success: false,
                    message: "User already exist"
               }
          }).as("updateRequest");
          cy.get("[data-testid='update-account']").click();

          cy.wait("@updateRequest").then((interception) => {
                expect(interception.response.statusCode).to.eq(409);
                expect(interception.response.body.success).to.be.false;
          })
          // Verify the updated value and Error message display
          cy.get("[data-testid='username-input']").should("contain.value",updatedUsername);
          cy.get("[data-testid='email-input']").should("contain.value",updatedEmail);
          cy.get("[data-testid='profile-error']").should("exist").and("be.visible").contains(/user already exist/i);

     })
   })
})