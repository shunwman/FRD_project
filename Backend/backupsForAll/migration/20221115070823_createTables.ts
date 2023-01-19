import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    const hasUsers = await knex.schema.hasTable("users")

    if (!hasUsers) {
        await knex.schema.createTable("users", (table) => {
            table.increments()
            table.string("username").notNullable()
            table.string("email").nullable()
            table.string("password").notNullable()
            table.text("introduction").nullable()
            table.text("user_icon").nullable()
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }


    const hasRecipes = await knex.schema.hasTable("recipes")

    if (!hasRecipes) {
        await knex.schema.createTable("recipes", (table) => {
            table.increments()
            table.integer("user_id").nullable().references("users.id")
            table.text("name").notNullable()
            table.integer("cuisine_type_id").notNullable()
            table.text("serving_size").notNullable()
            table.integer("duration_min").notNullable()
            table.boolean("isVegan")
            table.text("descriptions").nullable()
            table.jsonb("steps").notNullable()
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

        })
    }

    const hasRecipeImages = await knex.schema.hasTable("recipe_images")

    if (!hasRecipeImages) {
        await knex.schema.createTable("recipe_images", (table) => {
            table.increments()
            table.integer("recipe_id").notNullable().references("recipes.id")
            table.text("image_name").notNullable()
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

        })
    }

    const hasIngredients = await knex.schema.hasTable("ingredients")

    if (!hasIngredients) {
        await knex.schema.createTable("ingredients", (table) => {
            table.increments()
            table.text("ingredient_name").notNullable()
            table.integer("recipe_id").notNullable()
            table.text("quantity").notNullable()
            table.text("image_name").notNullable()
            // v keep it first 
            table.text("ingredient_type").nullable()
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

        })
    }

    const hasCookingMethods = await knex.schema.hasTable("cooking_methods")

    if (!hasCookingMethods) {
        await knex.schema.createTable("cooking_methods", (table) => {
            table.increments()
            table.integer("recipe_id").notNullable().references("recipes.id")
            table.text("style_name").notNullable()
            table.text("image_name").notNullable()
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }

    const getCuisineTypes = await knex.schema.hasTable("cuisine_types")

    if (!getCuisineTypes) {
        await knex.schema.createTable("cuisine_types", (table) => {
            table.increments()
            table.text("name").notNullable()
            table.text("image_name").notNullable().references("image_name")
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }



    const hasLikedRecipes = await knex.schema.hasTable("liked_recipes")

    if (!hasLikedRecipes) {
        await knex.schema.createTable("liked_recipes", (table) => {
            table.increments()
            table.integer("recipe_id").notNullable().references("recipes.id")
            table.integer("user_id").notNullable().references("users.id")
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }

    const hasSavedRecipes = await knex.schema.hasTable("saved_recipes")

    if (!hasSavedRecipes) {
        await knex.schema.createTable("saved_recipes", (table) => {
            table.increments()
            table.integer("recipe_id").notNullable().references("recipes.id")
            table.integer("user_id").notNullable().references("users.id")
            // v timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

        })
    }

    const hasUserFeedbacks = await knex.schema.hasTable("user_feedbacks")

    if (!hasUserFeedbacks) {
        await knex.schema.createTable("user_feedbacks", (table) => {
            table.increments()
            table.integer("recipe_id").notNullable().references("recipes.id")
            table.integer("user_id").notNullable().references("users.id")
            table.text("content").notNullable()
            table.text("content_type").notNullable()
            table.text("image_name").nullable()
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }

        )

    }


}





export async function down(knex: Knex): Promise<void> {

    await knex.schema.dropTableIfExists("user_feedbacks")
    await knex.schema.dropTableIfExists("saved_recipes")
    await knex.schema.dropTableIfExists("liked_recipes")
    await knex.schema.dropTableIfExists("cuisine_types")
    await knex.schema.dropTableIfExists("cooking_methods")
    await knex.schema.dropTableIfExists("ingredients")
    await knex.schema.dropTableIfExists("recipe_images")
    await knex.schema.dropTableIfExists("recipes")
    await knex.schema.dropTableIfExists("users")

}

