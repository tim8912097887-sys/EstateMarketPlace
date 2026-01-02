import request from "supertest";
import { dbConnection, dbDisconnection } from "../configs/db.js";
import app from "../app.js";
import { UserModel } from "./user.module.js";

describe("User Authentication API",() => {

    const loginRoute = "/users/signin";
    const signupRoute = "/users/signup";
    const refreshRoute = "/users/refresh";
    // Shared test data
    const TEST_LOGIN_USER = {
        email: "pro@example.com",
        password: "Qwe1267?"
    }

    const TEST_SIGNUP_USER = {
        username: "testpro",
        email: "pro@example.com",
        password: "Qwe1267?"
    }
    // Connect and close database before and after all test
    beforeAll(async() => await dbConnection());
    afterAll(async() => await dbDisconnection());

    // Clear testDB before each test ensure clean slate/isolation
    beforeEach(async() => {
        await UserModel.deleteMany({});
    })

    // Signup related test
    describe("POST /users/signup",() => {
       
        it('should create a new user and return 201', async() => {
            const res = await request(app)
            .post(signupRoute)
            .send(TEST_SIGNUP_USER)
            .expect("Content-Type",/json/);

            // Assertion
            expect(res.status).toBe(201);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data.user).toMatchObject({
                username: TEST_SIGNUP_USER.username,
                email: TEST_SIGNUP_USER.email
            })
            // Security check prevent password leak
            expect(res.body.data.user.password).toBeUndefined();
        })

        it('should reject duplicate email registration with 409', async() => {
            // First create a user
            await UserModel.create(TEST_SIGNUP_USER);
            const res = await request(app)
            .post(signupRoute)
            .send(TEST_SIGNUP_USER)

            // Assertion
            expect(res.status).toBe(409);
            expect(res.body.success).toBeFalsy();
            expect(res.body.message).toMatch(/already exist/i);
        })
    })

    describe("POST /users/signin",() => {

        // Create a new user before each test
        beforeEach(async() => await UserModel.create(TEST_SIGNUP_USER));

        it('should login successfully and set a secure refresh cookie', async() => {
            
            const res = await request(app)
            .post(loginRoute)
            .send(TEST_LOGIN_USER)
            .expect("Content-Type",/json/)

            expect(res.status).toBe(200);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data.accessToken).toBeDefined();
            const cookie = res.get("Set-Cookie");
            expect(cookie).toBeDefined();
            expect(cookie?.[0]).toContain("refreshToken");
            // Cookie security check
            expect(cookie?.[0]).toContain("HttpOnly");
        })

        it('should return 400 for invalid credentials', async() => {
            
            const res = await request(app)
            .post(loginRoute)
            .send({ email: "pro@example.com",password: "Qwe1267?sd" })
            
            // Assertion
            expect(res.status).toBe(400);
            expect(res.body.success).toBeFalsy();
            expect(res.body.message).toMatch(/is not correct/i);
        })
    })

    describe("GET /users/refresh",() => {

        // For login
        beforeEach(async() => await UserModel.create(TEST_SIGNUP_USER));
        
        it('should return accessToken and a new rotate refreshToken in cookie', async() => {
             const res = await request(app)
             .post(loginRoute)    
             .send(TEST_LOGIN_USER)
             // Get the cookie for subsequent request
             const cookie = res.get("Set-Cookie") as string[];
             const refreshRes = await request(app)
             .get(refreshRoute)
             .set("Cookie",cookie)
             .expect("Content-Type",/json/);

             // Assertion
             expect(refreshRes.status).toBe(201);
             expect(refreshRes.body.data.accessToken).toBeDefined();
             const newCookie = refreshRes.get("Set-Cookie");
             expect(newCookie).toBeDefined();
             expect(newCookie?.[0]).toContain("refreshToken");
             // Cookie security check
             expect(newCookie?.[0]).toContain("HttpOnly");
        })
    })
})
