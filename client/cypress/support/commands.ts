/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string,password: string): Chainable<void>
            signUp(username: string,email: string,password: string): Chainable<void>
        }
    }
}
// Reusable Login Command
Cypress.Commands.add("login",(email,password) => {
      cy.visit("/signin");
      cy.get("[data-testid='email-input']").type(email);
      cy.get("[data-testid='password-input']").type(password);
      cy.get("[type='submit']").click();
})
// Reusable SignUp Command
Cypress.Commands.add("signUp",(username,email,password) => {
      cy.visit("/signup");
      cy.get("[data-testid='username-input']").type(username);
      cy.get("[data-testid='email-input']").type(email);
      cy.get("[data-testid='password-input']").type(password);
      cy.get("[type='submit']").click();
})
export {}