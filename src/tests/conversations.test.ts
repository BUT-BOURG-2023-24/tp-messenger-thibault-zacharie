import http from "http";
import supertest from "supertest";
import { Express } from "express";
import { setup, teardown } from "./setupTests";

describe('CONVERSATIONS', () => {
	let app: Express, server: http.Server;
	let userToken: string;
	let conversationId: string;

	beforeAll(async () => {
		let res = await setup();
		app = res.app;
		server = res.server;

		// Login an existing user to get the authentication token
		const loginResponse = await supertest(app)
			.post("/users/login")
			.send({ username: "test", password: "testpwd" });

		userToken = loginResponse.body.token;
	});

	afterAll(async () => {
		await teardown();
	});

	test("CREATE Conversation success", async () => {
		const createConversationResponse = await supertest(app)
			.post("/conversations")
			.set('Authorization', `${userToken}`)
			.send({
				concernedUsersIds: ["656df725d2092d396fa78ed6", "656df725d2092d396fa78ed9"],
			});

		console.log(createConversationResponse.body);

		// Assert the response
		expect(createConversationResponse.status).toBe(200);
		expect(createConversationResponse.body.conversation).toBeDefined();

		// Save the conversation ID for later use in other tests
		conversationId = createConversationResponse.body.conversation._id;
	});

	test("CREATE Conversation wrong users", async () => {
		const createConversationResponse = await supertest(app)
			.post("/conversations")
			.set('Authorization', `${userToken}`)
			.send({
				concernedUsersIds: ["656df225d2092d396fq78ed6", "invalidUser"]
			});

		// Assert the response for invalid users
		expect(createConversationResponse.status).toBe(400);
		// Add more assertions based on the expected response format or content
	});

	test("GET All conversation success", async () => {
		const getAllConversationsResponse = await supertest(app)
			.get("/conversations")
			.set('Authorization', `${userToken}`);

		// Assert the response
		expect(getAllConversationsResponse.status).toBe(200);
		expect(getAllConversationsResponse.body.conversations).toBeDefined();
	});

	// Add tests for other conversation-related endpoints

	test("DELETE Conversation", async () => {
		const deleteConversationResponse = await supertest(app)
			.delete(`/conversations/${conversationId}`)
			.set('Authorization', `${userToken}`);

		// Assert the response
		expect(deleteConversationResponse.status).toBe(200);
		expect(deleteConversationResponse.body.conversation).toBeDefined();
	});
});
