import * as http from "http";
import express from "express";
import { Server } from "socket.io";
import { Database } from "./database/database";
import { SocketController } from "./socket/socketController";

const app = express();

function makeApp(database: Database) 
{
	app.locals.database = database;
	database.connect();

	const server = http.createServer(app);
	app.use(express.json());

	const userRoutes = require('./routes/users')
	app.use('/users', userRoutes);

	const io = new Server(server, { cors: { origin: "*" } });
	let socketController = new SocketController(io, database);

	app.locals.sockerController = socketController;

	return { app, server };
}

export { makeApp };
