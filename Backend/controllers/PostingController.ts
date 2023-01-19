import PostingService from "../services/PostingService";
import { Request, Response } from "express"
import { knex } from "../utils/db";
import { initFormidable } from "../utils/upload";
import IncomingForm from "formidable/Formidable";
import { uploadToS3 } from "../utils/aws-s3-upload";
import fs from 'fs'


export default class PostingController {
    private service: PostingService;

    constructor(private postingService: PostingService) {

    }


    fetchGetPostedRecipes = async (req: Request, res: Response) => {

        // const userPostedRecipes = {nothing: "nothing"}

        if (!req.user_id) {
            console.log("user is not logged in.")
            res.status(400).json({ message: "User is not logged in" })
            return
        }

        console.log("user with user_id:", req.user_id, "is fetching his posted recipes.")

        let userPostedRecipes: any[] = await this.postingService.getRecipesByUserId(req.user_id)
        res.json(userPostedRecipes);

        console.log("User with user_id:", req.user_id, "got:", userPostedRecipes)

    }

    fetchPostNewBlankRecipe = async (req: Request, res: Response) => {
        // Call DB
        console.log("user with user_id:", req.user_id, "is adding new blank post.")

        if (!req.user_id) {
            console.log("user is not logged in.")
            res.status(400).json({ message: "User is not logged in" })
            return
        }

        let userPostedRecipes: any[] = await this.postingService.addNewBlankPost(req.user_id)

        res.json(userPostedRecipes);

        console.log("User with user_id:", req.user_id, "posted a new blank recipe and got the id:", userPostedRecipes)
    }

    fetchPublishRecipeForm = async (req: Request, res: Response) => {

        try {
            let testTokens = false;

            const { recipeId } = req.body

            console.log("user with user_id:", req.user_id, "is publishing recipe with id:", recipeId)

            let recipeFormItems = await this.postingService.getRecipeFormItems(recipeId)

            console.log(recipeFormItems[0].steps)

            if (recipeFormItems[0].name === null || recipeFormItems[0].name === "") {
                console.log("name fail")
                res.status(400).json({ message: "invalid input" })
                return
            }
            if (recipeFormItems[0].descriptions === null || recipeFormItems[0].descriptions === "") {
                console.log("desc fail")
                res.status(400).json({ message: "invalid input" })
                return
            }
            if (recipeFormItems[0].cuisine_type === null || recipeFormItems[0].cuisine_type === "") {
                console.log("cuisine type fail")
                res.status(400).json({ message: "invalid input" })
                return
            }
            if (recipeFormItems[0].duration_min === null || recipeFormItems[0].duration_min === "") {
                console.log(recipeFormItems[0].duration_min)
                console.log("duration_min fail")
                res.status(400).json({ message: "invalid input" })
                return
            }
            if (recipeFormItems[0].cover_image === null || recipeFormItems[0].cover_image === "") {
                console.log("cover_image fail")
                res.status(400).json({ message: "invalid input" })
                return
            }
            if (recipeFormItems[0].serving_size === null || recipeFormItems[0].serving_size === "") {
                console.log("serving_size fail")
                res.status(400).json({ message: "invalid input" })
                return
            }
            testTokens = (recipeFormItems[0].steps).some((step: any) => step.step === "")
            if (testTokens) {
                console.log("steps fail:", testTokens)
                res.status(400).json({ message: "invalid input" })
                return
            }

            let recipeIngredients = await this.postingService.getRecipeIngredients(recipeId)

            testTokens = recipeIngredients.some((ingredient: any) => !ingredient.ingredient_name || !ingredient.quantity)

            if (testTokens) {
                console.log("ingredients fail")
                res.status(400).json({ message: "invalid input" })
                return
            }

            console.log("the body:", req.body)

            if (!req.user_id) {
                console.log("user is not logged in.")
                res.status(400).json({ message: "User is not logged in" })
                return
            }

            await this.postingService.publishRecipe(recipeId)

            res.json({ success: true });



        } catch (err) {
            console.log("Update ErrorL", err)

        }

    }

    fetchGetRecipeFormItems = async (req: Request, res: Response) => {
        try {
            // Call DB

            if (!req.user_id) {
                console.log("user is not logged in.")
                res.status(400).json({ message: "User is not logged in" })
                return
            }

            const theRecipeId = req.body.recipeId
            console.log("user with user_id:", req.user_id, "is getting form item with id:", theRecipeId)


            let recipeFormItems: any[] = await this.postingService.getRecipeFormItemsByTheRecipeId(theRecipeId)

            res.json(recipeFormItems);

            console.log("User with user_id:", req.user_id, "got:", recipeFormItems)


        } catch (err) {
            console.log("fetchGetRecipeFormItems error: ", err)
        }
    }

    updateAllDataExceptIngredientsAndCover = async (req: Request, res: Response) => {
        // Call DB

        try {
            if (!req.user_id) {
                console.log("user is not logged in.")
                res.status(400).json({ message: "User is not logged in" })
                return
            }

            let recipeId = req.body.recipeId
            // const { recipeId, recipeName, recipeFormDescriptions, recipeFormCuisineType, recipeFormIsVegan, recipeFormServingSize, recipeFormDurationMin, recipeSteps } = req.body

            console.log("user with user_id:", req.user_id, "is updating form item with id:", recipeId)

            console.log("the body:", req.body)

            await this.postingService.backupRecipeData(req.body)

            let recipeFormItems: any[] = await this.postingService.getRecipeFormItemsAfterUpdate(recipeId)

            res.json(recipeFormItems);

            console.log("User with user_id:", req.user_id, "updated and got:", recipeFormItems)

        } catch (err) {
            console.log("Update ErrorL", err)
            res.status(400).json(err);

        }

    }

    getIngredientsPostItems = async (req: Request, res: Response) => {
        // Call DB

        try {
            const { recipeId } = req.body
            console.log("get ingredientsPostItems & id=", recipeId)

            let relativeData = await this.postingService.getRelativeData(recipeId)

            res.json(relativeData);

            console.log("get ingredientsPostItems & id=", recipeId)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }



    }

    uploadCoverImage = async (req: Request, res: Response) => {
        try {
            // console.log("postRecipeImage", backendData)
            console.log("postingRecipeImage", req.body)

            const form: IncomingForm = initFormidable()
            console.log("triggered post posting/uploadCoverImage")
            form.parse(req, async (err, fields, files) => {

                console.log(err)
                console.log(fields)
                console.log(files)

                // vv make it a number later
                console.log("recipeId got:", fields.recipeId)

                let file = Array.isArray(files.test) ? files.test[0] : files.test
                let fileName = file ? file.newFilename : undefined

                // Upload file to AWS S3
                const accessPath = await uploadToS3({
                    Bucket: 'c22-frd011b',
                    Key: `${fileName}`,
                    Body: fs.readFileSync(file.filepath!),
                })

                // Insert accessPath to your table

                await this.postingService.updateRecipeImage(fields.recipeId, accessPath)

                await this.postingService.updateRecipeImageTable(fields.recipeId, accessPath)


                console.log(accessPath)

                res.json({ accessPath: accessPath })
            })
        } catch (err) {
            console.log(err.message)
        }

    }

    addBlankIngredientsPostItem = async (req: Request, res: Response) => {
        // Call DB
        const { recipeId } = req.body

        const blankIngredientsObj = {
            recipe_id: recipeId
        }

        await this.postingService.insertBlankRecipe(blankIngredientsObj)

        let relativeData = await this.postingService.getIngredientsData(recipeId)

        res.json(relativeData);

        console.log("addBlankIngredientsPostItem & id=", recipeId)
    }

    putIngredientsPostItems = async (req: Request, res: Response) => {


        console.log("putIngredientsPostItems", req.body)

        await this.postingService.updateIngredientData(req.body)

        let ingredientsPostItems = await this.postingService.getNewIngredientData(req.body.recipeId)


        res.json(ingredientsPostItems)

        console.log("put ingredient (backend)", ingredientsPostItems)
    }

    deleteIngredientsPostItems = async (req: Request, res: Response) => {

        console.log("deleteIngredientsPostItems:", req.body)
        await this.postingService.deleteIngredientData(req.body)



        res.json(req.body)


    }

    // vv for development use only: input cardCode data by insomnia
    posting = async (req: Request, res: Response) => {
        try {


            console.log(req.body)

            let hardcodeData = {
                user_id: 1,
                name: req.body.recipeName,
                cuisine_type_id: 4,
                serving_size: 1,
                duration_min: 10,
                isVegan: true,
                descriptions: '測試',
                steps: "{\"steps\":[\"加入牛絞肉與豬絞肉, 混合炒熟後, 加入高湯, 調味料, 然後用叉子把馬鈴薯搗碎後加入, 煮30分鐘至收汁, 關火放冷至室溫.\", \"混合炒熟後, 加入高湯, 調味料, 然後用叉子把馬鈴薯搗碎後加入, 煮30分鐘至收汁, 關火放冷至室溫.\",\"蓋上另一個派皮, 用手將兩份派皮的邊緣由外往內捲後捏合. 在派皮表面畫幾刀, 刷上蛋液, 190度C 烤50分鐘\", \"完成:) 肉鮮嫩多汁, 因為加了馬鈴薯泥, 讓整個內餡超綿密, 連酥脆的外皮都吃的到肉香, 出爐後熱熱吃, 真的超幸福!(T_T) 一定要試試看!!!\"]} "

            }

            await this.postingService.InsertPostingData(hardcodeData)



            res.json({ statusbar: 'success' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

}