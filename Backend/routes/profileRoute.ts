let SERVER_IP = "localhost:8080"
import express from 'express';
import Knex from 'knex';
import { isLoggedIn } from '../token/guards';
import ProfileController from '../controllers/ProfileController';
import ProfileService from '../services/ProfileService';
const knexConfigs = require("../knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);

export const profileRoutes = express.Router();
const profileService = new ProfileService(knex)
const profileController = new ProfileController(profileService)



profileRoutes.post("/collection/items",profileController.collection)
profileRoutes.post("/my-recipe/items",profileController.myRecipe)





// app.post("/profileRecipe/my-recipe/items", async function (req: Request, res: Response) {
// 	// Call DB
// 	console.log("/my-recipe/items:", req.body)
// 	const dbData = await knex.select("*")
// 		.from("users")
// 		.join("recipes", "recipes.user_id", "=", "users.id")
// 		.where("users.id", req.body.userId)
// 		.where("status", "published")
// 	res.json(dbData);
// });

