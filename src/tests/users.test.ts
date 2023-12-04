import http from "http";
import {Express} from "express";
import {setup, teardown} from "./setupTests";
import supertest from "supertest";

describe('USERS', () => {
    let app: Express, server: http.Server;
    let userToken: string;

    beforeAll(async () => {
        let res = await setup();
        app = res.app;
        server = res.server;

        const loginResponse = await supertest(app)
            .post("/users/login")
            .send({username: "user1", password: "user1pwd"});

        userToken = loginResponse.body.token;
    });

    afterAll(async () => {
        await teardown();
    });

    test("Login existing user", async () => {
        const loginResponse = await supertest(app)
            .post("/users/login")
            .send({
                username: "user1",
                password: "user1pwd"
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.user).toBeDefined();
        expect(loginResponse.body.token).toBeDefined();
        expect(loginResponse.body.isNewUser).toBeDefined();
        expect(loginResponse.body.user._id).toBeDefined();
        expect(loginResponse.body.user.name).toBeDefined();
    });

    test("Login wrong password", async () => {

        const loginResponse = await supertest(app)
            .post("/users/login")
            .send({
                username: "user1",
                password: "user2pwd"
            });

        expect(loginResponse.status).toBe(500);
        expect(loginResponse.body['Internal Server Error']).toBeDefined();
    });

    test("GET active users", async () => {

        const getActiveUsersResponse = await supertest(app)
            .get("/users/online")
            .set('Authorization', `${userToken}`);

        expect(getActiveUsersResponse.status).toBe(200);
        expect(getActiveUsersResponse.body).toBeDefined();
    });
});
