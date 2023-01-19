let SERVER_IP = "localhost:8080"
import express from 'express';
import { Server as SocketIO } from 'socket.io'
import { knex } from "../utils/db"

import PostingService from '../services/PostingService';
import PostingController from '../controllers/PostingController';
import { isLoggedIn } from '../token/guards';

export const postingRoutes = express.Router();
const postingService = new PostingService(knex)
const postingController = new PostingController(postingService)

postingRoutes.use(express.json());

postingRoutes.post("/posting", postingController.posting);

postingRoutes.get("/fetchGetPostedRecipes", isLoggedIn, postingController.fetchGetPostedRecipes)

postingRoutes.post("/fetchPostNewBlankRecipe", isLoggedIn, postingController.fetchPostNewBlankRecipe)

postingRoutes.post("/fetchPublishRecipeForm", isLoggedIn, postingController.fetchPublishRecipeForm)

postingRoutes.post("/fetchGetRecipeFormItems", isLoggedIn, postingController.fetchGetRecipeFormItems)

postingRoutes.post("/updateAllDataExceptIngredientsAndCover", isLoggedIn, postingController.updateAllDataExceptIngredientsAndCover)

postingRoutes.post("/getIngredientsPostItems", postingController.getIngredientsPostItems)

postingRoutes.post("/uploadCoverImage", postingController.uploadCoverImage)

postingRoutes.post("/addBlankIngredientsPostItem", postingController.addBlankIngredientsPostItem)

postingRoutes.put("/putIngredientsPostItems", postingController.putIngredientsPostItems)

postingRoutes.delete("/deleteIngredientsPostItems", postingController.deleteIngredientsPostItems)

