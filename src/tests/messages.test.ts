import http from "http"
import supertest from "supertest"
import {Express} from "express"
import {setup, teardown} from "./setupTests"

describe('MESSAGES', () => {
    let app: Express, server: http.Server
    let userToken: string
    let conversationId: string
    let messageId: string

    const messageService = require('../modules/messages/messageService')

    beforeAll(async () => {
        let res = await setup()
        app = res.app
        server = res.server

        const loginResponse = await supertest(app)
            .post("/users/login")
            .send({username: "user1", password: "user1pwd"})

        userToken = loginResponse.body.token

        const createConversationResponse = await supertest(app)
            .post("/conversations")
            .set('Authorization', `${userToken}`)
            .send({
                concernedUsersIds: ["656e3fd27c4f01ef4fbbd18c", "656e3fd27c4f01ef4fbbd18f"],
            })

        conversationId = createConversationResponse.body.conversation._id

        const createdMessage = await messageService.createMessage(conversationId, "Hello, this is a test message", "656e3fd27c4f01ef4fbbd18c", null)

        messageId = createdMessage._id

        const addMessageResponse = await supertest(app)
            .post(`/conversations/${conversationId}`)
            .set('Authorization', `${userToken}`)
            .send({
                content: "Reply to the test message", messageReplyId: messageId,
            })

        expect(addMessageResponse.status).toBe(200)
        expect(addMessageResponse.body.conversation).toBeDefined()
    })


    afterAll(async () => {
        await teardown();
    });

    test("EDIT Message success", async () => {
        const newMessageContent = "Updated test message content";

        const editMessageResponse = await supertest(app)
            .put(`/messages/${messageId}`)
            .set('Authorization', `${userToken}`)
            .send({
                newMessageContent,
            })

        expect(editMessageResponse.status).toBe(200)
        expect(editMessageResponse.body.message).toBeDefined()
        expect(editMessageResponse.body.message.content).toBe(newMessageContent)

        const updatedMessage = await messageService.getMessageById(messageId)
        expect(updatedMessage.content).toBe(newMessageContent)
    })

    test("DELETE Message success", async () => {
        const deleteMessageResponse = await supertest(app)
            .delete(`/messages/${messageId}`)
            .set('Authorization', `${userToken}`)

        expect(deleteMessageResponse.status).toBe(200)
        expect(deleteMessageResponse.body.message).toBeDefined()
    })
})