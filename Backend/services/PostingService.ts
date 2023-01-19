import { Knex } from 'knex';
// import 

export default class postingService {
    constructor(private knex: Knex) { }


    async InsertPostingData(hardcodeData): Promise<any> {
        await this.knex.insert(hardcodeData)
            .into("recipes")
    }

    async getRecipesByUserId(userId: number): Promise<any> {
        let recipeGot = await this.knex.select("*")
            .from("recipes")
            .where("user_id", userId)
            .orderBy(
                "updated_at",
                "desc"
            )

        return recipeGot;
    }

    async addNewBlankPost(userId: number): Promise<any> {
        let newPostId = await this.knex("recipes")
            .insert({ "user_id": userId })
            .returning("id")

        return newPostId
    }

    async getRecipeFormItems(recipeId: number): Promise<any> {
        let recipeFormItems = await this.knex.select("*").from("recipes").where("id", recipeId)

        return recipeFormItems
    }

    async getRecipeIngredients(recipeId: number): Promise<any> {
        let recipeIngredients = await this.knex.select("ingredient_name", "quantity").from("ingredients").where("recipe_id", recipeId)

        return recipeIngredients
    }

    async publishRecipe(recipeId: number): Promise<any> {
        await this.knex("recipes")
            .where({ id: recipeId })
            .update({
                status: "published"
            })
    }

    async getRecipeFormItemsByTheRecipeId(theRecipeId: number): Promise<any> {
        let recipeFormItems = await this.knex.select("*").from("recipes").where("id", theRecipeId)
        return recipeFormItems
    }

    async backupRecipeData(bodyData: any): Promise<any> {
        const { recipeId, recipeName, recipeFormDescriptions, recipeFormCuisineType, recipeFormIsVegan, recipeFormServingSize, recipeFormDurationMin, recipeSteps } = bodyData

        await this.knex("recipes")
            .where({ id: recipeId })
            .update({
                name: recipeName,
                descriptions: recipeFormDescriptions,
                cuisine_type_id: recipeFormCuisineType,
                isVegan: recipeFormIsVegan,
                serving_size: recipeFormServingSize,
                duration_min: recipeFormDurationMin,
                steps: JSON.stringify(recipeSteps)
            })
    }

    async getRecipeFormItemsAfterUpdate(recipeId: number): Promise<any> {
        let recipeFormItems = await this.knex.select("*")
            .from("recipes")
            .where("id", recipeId)

        return recipeFormItems
    }

    async getRelativeData(recipeId: number): Promise<any> {
        let relativeData = await this.knex.select("recipe_id", "id", "ingredient_name", "quantity")
            .from("ingredients")
            .where("recipe_id", recipeId)
            .orderBy(
                "updated_at",
            )

        return relativeData
    }

    async updateRecipeImage(recipeId: any, imagePath: string): Promise<any> {
        await this.knex("recipes")
            .where({ id: recipeId })
            .update({
                cover_image: imagePath
            })

    }

    async updateRecipeImageTable(recipeId: any, imagePath: string): Promise<any> {
        await this.knex.insert({
            recipe_id: recipeId,
            image_name: imagePath
        }).into("recipe_images")


    }

    async insertBlankRecipe(blankIngredientsObj: Object): Promise<any> {
        await this.knex.insert(blankIngredientsObj).into("ingredients")
    }

    async getIngredientsData(recipeId: number): Promise<any> {
        let relativeData = this.knex.select("recipe_id", "id", "ingredient_name", "quantity")
            .from("ingredients")
            .where("recipe_id", recipeId)

        return relativeData
    }

    async updateIngredientData(data: any): Promise<any> {
        const { recipeId, id, ingredient_name, quantity } = data

        await this.knex("ingredients")
            .where({ id: id })
            .update({
                ingredient_name: ingredient_name,
                quantity: quantity
            })

    }

    async getNewIngredientData(recipeId: number): Promise<any> {
        let ingredientsPostItems = await this.knex.select("recipe_id", "id", "ingredient_name", "quantity")
            .from("ingredients")
            .where("recipe_id", recipeId)

        return ingredientsPostItems

    }

    async deleteIngredientData(data: any): Promise<any> {

        const { recipeId, id } = data

        await this.knex("ingredients")
            .where("id", id)
            .del()

        console.log("deleteIngredientsPostItems in service", id)

    }

}