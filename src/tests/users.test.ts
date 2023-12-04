import http from "http";
import { Express } from "express";
import { setup, teardown } from "./setupTests";
import supertest from "supertest";

describe('USERS', () => {
	let app: Express, server: http.Server;

	beforeAll(async () => {
		let res = await setup();
		app = res.app;
		server = res.server;
	});

	afterAll(async () => {
		await teardown();
	});

	test("Login existing user", async () => {
		const loginResponse = await supertest(app)
			.post("/users/login")
			.send({
				username: "validUsername",
				password: "validPassword"
			});

		expect(loginResponse.status).toBe(200);
		expect(loginResponse.body.user).toBeDefined();
		expect(loginResponse.body.token).toBeDefined();
		expect(loginResponse.body.isNewUser).toBeDefined();
	});

	test("Login wrong password", async () => {

		const loginResponse = await supertest(app)
			.post("/users/login")
			.send({
				username: "validUsername",
				password: "wrong"
			});

		// Expecting a 500 status for an invalid password
		expect(loginResponse.status).toBe(500);
		// Add more assertions based on the expected response format or content
	});

	test("GET active users", async () => {
		const authToken = "eyJ1c2VySWQiOiI2NTZkZmQzNTBiZjFlMTcxZDUyYTkyNDIiLCJpYXQiOjE3MDE3MDcwNjEsImV4cCI6MTcwMTc5MzQ2MX0.nuWxVOV0eNlOXHhQLPgys9KIpjh5iY169aau2DvkEcc";

		const getActiveUsersResponse = await supertest(app)
			.get("/users/online")
			.set('Authorization', `${authToken}`);

		// Expecting a 200 status for a valid token
		expect(getActiveUsersResponse.status).toBe(200);
		// Add more assertions based on the expected response format or content
	});

});
