import http from "http"
import supertest from "supertest"
import {Express} from "express"
import {setup, teardown} from "./setupTests"

describe('CONVERSATIONS', () => {
    let app: Express, server: http.Server
    let userToken: string
    let conversationId: string

    beforeAll(async () => {
        let res = await setup()
        app = res.app
        server = res.server

        const loginResponse = await supertest(app)
            .post("/users/login")
            .send({username: "user1", password: "user1pwd"});

        userToken = loginResponse.body.token
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
            })

        console.log(createConversationResponse.body)

        expect(createConversationResponse.status).toBe(200)
        expect(createConversationResponse.body.conversation).toBeDefined()
        expect(createConversationResponse.body.conversation._id).toBeDefined()
    });

    test("CREATE Conversation success", async () => {
        const createConversationResponse = await supertest(app)
            .post("/conversations")
            .set('Authorization', `${userToken}`)
            .send({
                concernedUsersIds: ["656df725d2092d396fa78ed6", "656df725d2092d396fa78ed9"],
            })

        expect(createConversationResponse.status).toBe(200)
        expect(createConversationResponse.body.conversation).toBeDefined()

        conversationId = createConversationResponse.body.conversation._id
    })

    test("GET All conversation success", async () => {
        const getAllConversationsResponse = await supertest(app)
            .get("/conversations")
            .set('Authorization', `${userToken}`)

        expect(getAllConversationsResponse.status).toBe(200);
        expect(getAllConversationsResponse.body.conversations).toBeDefined()
    })

    test("DELETE Conversation", async () => {
        console.log(conversationId)

        const deleteConversationResponse = await supertest(app)
            .delete(`/conversations/${conversationId}`)
            .set('Authorization', `${userToken}`)

        expect(deleteConversationResponse.status).toBe(200);
        expect(deleteConversationResponse.body.conversation).toBeDefined()
    })
})
