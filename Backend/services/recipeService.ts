import { hashPassword } from '../hash';
//import User from '../models/UserModel'
//import Knex from 'knex';

// import UserSController from "../controllers/UserController";


export default class RecipeService {
    constructor(private knex: any) { }
    async getDataList(limit: string, page: string) {
        let result = await this.knex.raw(`WITH middle_table as (
            SELECT recipe_id, COUNT(recipe_id) as count
            FROM liked_recipes lr 
            GROUP BY recipe_id 
        )
        SELECT recipes.id, recipes.name, recipes.cover_image, users.username, users.user_icon, middle_table.count, recipes.user_id 
                FROM recipes
                join users 
                on users.id = recipes.user_id 
                full outer join middle_table
                on middle_table.recipe_id = recipes.id 
                WHERE recipes.status = 'published'
                group by users.id, recipes.id, recipes.name, recipes.cover_image, users.username, users.user_icon, recipes.user_id, recipes.status, middle_table.recipe_id, middle_table.count
                ORDER BY id desc LIMIT ${limit} OFFSET ${parseInt(page) * 10};`)

        return result;
    }

    async getComment(recipeId: number) {
        let result = await this.knex.raw(
            `SELECT
		user_feedbacks.content, users.username ,users.user_icon ,users.id, user_feedbacks.content_type, user_feedbacks.image_name
		 FROM
		 user_feedbacks JOIN users
		 on users.id = user_feedbacks.user_id
		 where user_feedbacks.recipe_id = ${recipeId}
		 ORDER by user_feedbacks.id desc;`
        )

        return result;
    }

    async likeRecipe(userId: number, recipeId: number) {
        const ids = await this.knex.insert({ user_id: userId, recipe_id: recipeId }).into("liked_recipes")
    }

    async checklikeRecipe(userId: number, recipeId: number) {
        let result = await this.knex.select("user_id", "recipe_id").from("liked_recipes")
            .where("user_id", userId)
            .andWhere("recipe_id", recipeId)
        return result
    }

    async unlikeRecipe(userId: number, recipeId: number) {
        let result = await this.knex("liked_recipes").where("recipe_id", recipeId).andWhere("user_id", userId).del();
    }

    async saveRecipe(userId: number, recipeId: number) {
        const ids = await this.knex.insert({ user_id: userId, recipe_id: recipeId }).into("saved_recipes")
    }

    async checksaveRecipe(userId: number, recipeId: number) {
        let result = await this.knex.select("user_id", "recipe_id").from("saved_recipes")
            .where("user_id", userId)
            .andWhere("recipe_id", recipeId)
        return result
    }

    async unsaveRecipe(userId: number, recipeId: number) {
        await this.knex("saved_recipes").where("recipe_id", recipeId).andWhere("user_id", userId).del();
    }

    async recipeResult(id: number) {
        const result = await this.knex.select("descriptions", "user_id", "cuisine_type_id", "serving_size", "duration_min", "isVegan", "steps", "name").from("recipes")
            .where("id", id)
        return result
    }
    async ingredientResult(id: number) {
        const resultIn = await this.knex.select("ingredient_name", "quantity").from("ingredients")
            .where("recipe_id", id)
        return resultIn
    }

    async cookingMethodsResult(id: number) {
        const resultMe = await this.knex.select("style_name").from("cooking_methods")
            .where("recipe_id", id)
        return resultMe
    }

    async typeResult(id: number) {
        const resultType = await this.knex.select("name").from("cuisine_types")
            .where("id", id)
        return resultType
    }

    async imageResult(id: number) {
        const resultImg = await this.knex.select("image_name").from("recipe_images")
            .where("recipe_id", id)
        return resultImg
    }

    async userResult(id: number) {
        const resultUser = await this.knex.select("username", "introduction", "user_icon").from("users")
            .where("id", id)
        return resultUser
    }

    async likeResult(id: string) {
        const numOfLike = await this.knex.raw(`SELECT recipe_id, COUNT(recipe_id)
        FROM liked_recipes
        where recipe_id = ${id}
        GROUP BY recipe_id`)
        return numOfLike
    }

    async middleSearch(recipeKeyword: string, ingredients: string) {
        let middleResults = await this.knex.raw(`
	    SELECT 
	    distinct ingredients.recipe_id
	    FROM
        ingredients INNER JOIN recipes
	    ON
  	    ingredients.recipe_id = recipes.id
	    where recipes.name like '%${recipeKeyword}%'
	    and ingredients.ingredient_name like '%${ingredients}%'
	    and recipes.status = 'published'
	    GROUP BY recipes.name, recipes.id ,ingredients.recipe_id, ingredients.ingredient_name 
	    ORDER BY ingredients.recipe_id desc;`)
        return middleResults
    }

    async middleSearch02(middleResults: number[], methods: string[]) {
        middleResults = await this.knex.raw(`
	    WITH middle_table as (
		SELECT recipe_id, style_name
			from cooking_methods
			where style_name = any(array ['`+ methods.map((method: any) => method).join(`','`) + `'])
	    )
	    SELECT recipe_id
	    FROM middle_table
	    GROUP BY recipe_id
	    HAVING COUNT(recipe_id) = ${methods.length}
	    and recipe_id = ${JSON.stringify(middleResults)})
	    `)
        return middleResults
    }

    async middleSearch03(middleResults: number[], style: string) {
        middleResults = await this.knex.raw(`
        SELECT 
        recipes.id
        FROM
        recipes JOIN cuisine_types 
        ON
          recipes.cuisine_type_id  = cuisine_types.id
        where recipes.id = any(array[`+ middleResults.map((middleResults: any) => middleResults).join(',') + `])
        and cuisine_types.name  = '${style}'
        GROUP BY cuisine_types.name, recipes.id ,cuisine_types.id
        ORDER BY recipes.id desc;
        `)
        return middleResults
    }

    async middleSearchDuration(middleResults: number[], minsFrom: number, maxFrom: number) {
        middleResults = await this.knex.raw(`
        SELECT id FROM recipes 
        where id = any(array[`+ middleResults.map((middleResults: any) => middleResults).join(',') + `])
        and between ${minsFrom} and  ${maxFrom}
        ORDER BY id desc;
        `)
        return middleResults
    }

    async middleSearch04under30min(middleResults: number[]) {
        middleResults = await this.knex.raw(`
        SELECT id FROM recipes 
        where id = any(array[`+ middleResults.map((middleResults: any) => middleResults).join(',') + `])
        and duration_min < 30
        ORDER BY id desc;
        `)
        return middleResults
    }

    async middleSearch0430to60min(middleResults: number[]) {
        middleResults = await this.knex.raw(`
        SELECT id FROM recipes 
        where id = any(array[`+ middleResults.map((middleResults: any) => middleResults).join(',') + `])
        and duration_min BETWEEN 30 AND 60
        ORDER BY id desc;
        `)
        return middleResults
    }

    async middleSearch04over60min(middleResults: number[]) {
        middleResults = await this.knex.raw(`
        SELECT id FROM recipes 
        where id = any(array[`+ middleResults.map((middleResults: any) => middleResults).join(',') + `])
        and duration_min > 60
        ORDER BY id desc;
        `)
        return middleResults
    }

    async middleSearch05(middleResults: number[], isVeganState: boolean) {
        middleResults = await this.knex.raw(`
		SELECT id FROM recipes 
		where id = any(array[`+ middleResults.map((middleResults: any) => middleResults).join(',') + `])
		and "isVegan" = ${isVeganState}
		ORDER BY id desc;
		`)
        return middleResults
    }

    async searchResult(middleResults: number[]) {
        const result = await this.knex.raw(`WITH middle_table as (
			SELECT recipe_id, COUNT(recipe_id)
			FROM liked_recipes lr 
			GROUP BY recipe_id 
		)
			SELECT 
			recipes.id
			,recipes.name
			,JSON_AGG(recipe_images.image_name) as images
			,users.username 
			,recipes.duration_min 
			,middle_table.count
			FROM
			recipes INNER JOIN recipe_images
			ON
			  recipe_images.recipe_id = recipes.id
			 INNER JOIN users
			ON
			  users.id = recipes.user_id
			  full outer join middle_table
			 on 
			 middle_table.recipe_id = recipes.id 
			where recipes.id = any(array[`+ middleResults.map((middleResults: any) => middleResults).join(',') + `])
			GROUP BY recipes.name, users.username, recipes.id ,middle_table.recipe_id ,middle_table.count ,recipes.duration_min
			ORDER BY recipes.id desc;`
        )
        return result
    }
    // async editProfile(username: string) => {
    //     return
    // }
    //async editProfile(userId: number, username: string, password: string, email: string) {
    //    // const getAllUsers = await this.knex.select("*").from("users")
    //    let inputData = {
    //        username: username,
    //        password: password,
    //        email: email
    //    }
    //    await this.knex.update(inputData)
    //    .table('users')
    //    .where("id", userId)
    //        // const username= updatedUser.name
    //        // const password = updatedUser.password
    //        // const email = updatedUser.email
    //    // const editedUser = 	await this.knex.update('username', 'password', 'email').table("users").where("id")

    //}


    // await this.knex.select("*").from("users")



}


