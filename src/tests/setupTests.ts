import http from 'http';
import supertest from 'supertest'
import {Express} from "express";
import mongoose from "mongoose";
import Database from "../database";
import {makeApp} from "../app";

interface SetupResult {
    server: http.Server;
    app: Express;
}

async function setup(): Promise<SetupResult> {
    let database = new Database(true);

    try {
        await new Promise<void>((resolve, reject) => {
            database.connect()

            const connection = mongoose.connection

            connection.on('error', (error) => {
                console.error('MongoDB connection error:', error)
                reject(error)
            });

            connection.on('open', () => {
                console.log('DB Connected !')
                resolve()
            });
        });

        const collections = await mongoose.connection.db.collections()

        for (const collection of collections) {
            await collection.deleteMany({})
        }

        const user1 = await supertest((await makeApp(database)).app)
            .post("/users/login")
            .send({username: "user1", password: "user1pwd"})

        const user2 = await supertest((await makeApp(database)).app)
            .post("/users/login")
            .send({username: "user2", password: "user2pwd"})

        let {app, server} = await makeApp(database)

        return {
            app, server,
        }
    } catch (error) {
        console.error('Error setting up test:', error)
        throw error
    }
}


async function teardown() {
    await mongoose.disconnect();
}

export {setup, teardown};
