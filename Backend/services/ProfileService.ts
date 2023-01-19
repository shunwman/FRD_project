export default class ProfileService {
    constructor(private knex: any) { }

    async getCollectionItem(userId: number) {
        let collection = await this.knex.select("*")
            .from("saved_recipes")
            .join("recipes", "recipes.id", "=", "saved_recipes.recipe_id")
            .join("users", "users.id", "=", "saved_recipes.user_id")
            .where("users.id", userId)
        return collection

    }


    async getMyRecipeItem(userId: number) {
        let myRecipe = await this.knex.select("*")
		.from("users")
		.join("recipes", "recipes.user_id", "=", "users.id")
		.where("users.id", userId)
		.where("status", "published")
        return myRecipe
    }



}