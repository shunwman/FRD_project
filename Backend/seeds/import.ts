const Papa = require('papaparse')
import fs from 'fs';
import path from 'path';
import { Knex } from "knex";
// import XLSX from "xlsx";
interface Users {
    username: string
    email?: string
    password: string
    introduction?: string
    user_icon?: string
}

interface CuisineTypes {
    name: string
    image_name: string
}

const csvPath = 'data_csv'

export async function seed(knex: Knex): Promise<void> {
    try {
        // Deletes ALL existing entries

        // await knex.raw(`truncate table user_feedbacks RESTART identity cascade`)
        // await knex.raw(`truncate table saved_recipes RESTART identity cascade`)
        // await knex.raw(`truncate table liked_recipes RESTART identity cascade`)
        await knex.raw(`truncate table cuisine_types RESTART identity cascade`)
        await knex.raw(`truncate table cooking_methods RESTART identity cascade`)
        await knex.raw(`truncate table ingredients RESTART identity cascade`)
        await knex.raw(`truncate table recipe_images RESTART identity cascade`)
        await knex.raw(`truncate table recipes RESTART identity cascade`)
        await knex.raw(`truncate table users RESTART identity cascade`)

        // Inserts seed entries

        // vv dummy users
        let usersData = fs.readFileSync(path.join(__dirname, csvPath, "users.csv"), { encoding: 'utf-8' });
        let { data: usersObj } = await Papa.parse(usersData, { header: true, delimiter: '||' })
        await knex.insert(usersObj).into("users")

        // vv recipes
        let recipeData = fs.readFileSync(path.join(__dirname, csvPath, "recipes.csv"), { encoding: 'utf-8' });
        let { data: recipeDataObj } = await Papa.parse(recipeData, { header: true, delimiter: '||' })

        // recipeDataObj = recipeDataObj.map((row: any) => {

        //     return {
        //         ...row,
        //         steps: row.steps ? JSON.stringify(row.steps) : {}
        //     }


        // })

        // console.log("outside",recipeDataObj)

        // !! vv example of extracting the data from steps
        // let tester = recipeDataObj[0].steps
        // let tester2 = JSON.parse(tester)
        // let tester3 = JSON.parse(tester2)
        // console.log(tester3.steps[0])

        await knex.insert(recipeDataObj).into("recipes")

        /// raw method for testing
        // await knex.raw(`INSERT INTO recipes
        // (user_id, name, cuisine_type_id, serving_size, duration_min, "isVegan", 
        // descriptions, steps)
        // VALUES(1, 'test', 1, '2', 60, false, 'test test', 
        // '{"steps":["加入牛絞肉與豬絞肉, 混合炒熟後, 加入高湯, 調味料, 然後用叉子把馬鈴薯搗碎後加入, 煮30分鐘至收汁, 關火放冷至室溫.加入牛絞肉與豬絞肉", "混合炒熟後, 加入高湯, 調味料, 然後用叉子把馬鈴薯搗碎後加入, 煮30分鐘至收汁, 關火放冷至室溫.","蓋上另一個派皮, 用手將兩份派皮的邊緣由外往內捲後捏合. 在派皮表面畫幾刀, 刷上蛋液, 190度C 烤50分鐘", "完成:) 肉鮮嫩多汁, 因為加了馬鈴薯泥, 讓整個內餡超綿密, 連酥脆的外皮都吃的到肉香, 出爐後熱熱吃, 真的超幸福!(T_T) 一定要試試看!!!"]} ')
        // `)


        // vv recipes_images
        let recipesImagesData = fs.readFileSync(path.join(__dirname, csvPath, "recipe_images.csv"), { encoding: 'utf-8' });
        let { data: recipesImagesObj } = await Papa.parse(recipesImagesData, { header: true, delimiter: '||' })
        // console.log(recipesImagesObj)
        await knex.insert(recipesImagesObj).into("recipe_images")


        // vv ingredients

        let ingredientsData = fs.readFileSync(path.join(__dirname, csvPath, "ingredients.csv"), { encoding: 'utf-8' });
        let { data: ingredientsObj } = await Papa.parse(ingredientsData, { header: true, delimiter: '||' })
        // console.log(ingredientsObj)
        await knex.insert(ingredientsObj).into("ingredients")


        // vv cooking_methods
        let cookingMethodsData = fs.readFileSync(path.join(__dirname, csvPath, "cooking_methods.csv"), { encoding: 'utf-8' });
        let { data: cookingMethodsObj } = await Papa.parse(cookingMethodsData, { header: true, delimiter: '||' })
        // console.log(cookingMethodsObj)
        await knex.insert(cookingMethodsObj).into("cooking_methods")


        // vv cuisine_types
        let cuisineTypesData = fs.readFileSync(path.join(__dirname, csvPath, "cuisine_types.csv"), { encoding: 'utf-8' });
        let { data: cuisineTypesObj } = await Papa.parse(cuisineTypesData, { header: true, delimiter: '||' })
        // console.log(cuisineTypesObj)
        await knex.insert(cuisineTypesObj).into("cuisine_types")





    } catch (err) {
        console.log("Seed failed: " + err.message)
    }

};




