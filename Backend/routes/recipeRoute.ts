let SERVER_IP = "localhost:8080"
import express from 'express';
import RecipeService from '../services/recipeService';
import RecipeController from '../controllers/recipeController';
import { Server as SocketIO } from 'socket.io'
import Knex from 'knex';
import { isLoggedIn } from '../token/guards';
const knexConfigs = require("../knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);

export const recipeRoutes = express.Router();

export function initialize() {
    const recipeService = new RecipeService(knex);
    const recipeController = new RecipeController(recipeService);
    recipeRoutes.post('/search', recipeController.searchRecipe)
    recipeRoutes.post('/', recipeController.postRecipe)

    recipeRoutes.get('/list/data', recipeController.listData)
    // recipeRoutes.get('/comment/:id', recipeController.postComment)
    recipeRoutes.post('/comment', recipeController.postComment)
    recipeRoutes.post('/like', recipeController.like)
    recipeRoutes.post('/checklike', recipeController.checklike)
    recipeRoutes.delete('/unlike', recipeController.unlike)
    recipeRoutes.post('/save', recipeController.save)
    recipeRoutes.post('/checksave', recipeController.checksave)
    recipeRoutes.delete('/unsave', isLoggedIn, recipeController.unsave)
}
