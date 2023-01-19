let SERVER_IP = "localhost:8080"
import express from 'express';
import { Client } from 'pg';
import UserService from '../services/UserService';
import UserController from '../controllers/UserController';
import { Server as SocketIO } from 'socket.io'
import Knex from 'knex';
import { isLoggedIn } from '../token/guards';
const knexConfigs = require("../knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);

export const userRoutes = express.Router();


export function initialize() {
    const userService = new UserService(knex);
    const userController = new UserController(userService);
    userRoutes.post('/comment', userController.commentSend)
    userRoutes.post('/cooksnap/send', userController.cooksnapSend)
    userRoutes.post('/register', userController.register)
    userRoutes.post('/profile/edit/string', userController.editString)
    userRoutes.post('/profile/edit/object', userController.editObject)
    userRoutes.post('/login', userController.login)
    userRoutes.post('/getme', userController.getme)
    userRoutes.get('/logout', userController.logout)
    userRoutes.get('/me', userController.me)
    userRoutes.post("/user/getSavedPosts", userController.getSavedPosts)
}

// app.post("/user/getSavedPosts", async function (req: Request, res: Response) {
// 	// Call DB
// 	const { userId } = req.body

// 	let dataFromDB = await knex.select("*")
// 		.from("saved_recipes")
// 		.where("user_id", userId)

// 	res.json(dataFromDB);
// });
