import RecipeService from "../services/recipeService";
import SocketIO from 'socket.io';
import { Request, Response } from 'express';


export default class RecipeController {
	private service: RecipeService;
	constructor(service: RecipeService) {
		this.service = service;
	}

	listData = async (req: Request, res: Response) => {
		const limit: any = req.query.limit;
		const page: any = req.query.page;

		console.log("/recipe/list/data: ", "setting-", req.query.limit, req.query.page)
		let result = await this.service.getDataList(limit, page)
		res.json({ recipes: result.rows });
	}

	postComment = async (req: Request, res: Response) => {



		try {

			console.log("get comment: ", req.body)

			let result = await this.service.getComment(parseInt(req.body.recipeId))
			// let result = await this.service.getComment(parseInt(req.params.recipeId))
			// let result = await this.service.getComment(1)

			res.json({ comment: result.rows })


		} catch (error) {
			console.log("postComment error", error)
			res.status(500).json({ message: 'Internal server error' })
		}

	}

	like = async (req: Request, res: Response) => {

		try {

			console.log("like recipe: ", req.body)

			let recipeId = parseInt(req.body.recipeId)
			const ids = await this.service.likeRecipe(req.body.userId, recipeId)
			res.json({ message: 'liked' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal server error' })
		}

	}

	checklike = async (req: Request, res: Response) => {

		try {

			console.log("checklike: ", req.body)

			let recipeId = parseInt(req.body.recipeId)
			let result = await this.service.checklikeRecipe(req.body.userId, recipeId)

			//console.log(recipeItem)
			console.log(result)
			if (result[0]) {
				res.json({ message: 'unlike' })
			} else {
				res.json({ message: 'like' })
			}
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal server error' })
		}

	}

	unlike = async (req: Request, res: Response) => {

		try {

			console.log("unlike recipe: ", req.body)

			let recipeId = parseInt(req.body.recipeId)
			let result = await this.service.checklikeRecipe(req.body.userId, recipeId)
			//console.log(recipeItem)
			console.log(result[0])
			if (result[0]) {
				console.log("unlike")
				result = await this.service.unlikeRecipe(req.body.userId, recipeId)
				res.json({ message: 'unlike' })
			} else {
				res.json({ message: 'Already unlike' })
			}

		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	save = async (req: Request, res: Response) => {

		try {
			console.log("like recipe: ", req.body)

			let recipeId = parseInt(req.body.recipeId)
			const ids = await this.service.saveRecipe(req.body.userId, recipeId)
			res.json({ message: 'saved' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal server error' })
		}

	}

	checksave = async (req: Request, res: Response) => {

		try {
			console.log("checklike: ", req.body)

			let recipeId = parseInt(req.body.recipeId)
			let result = await this.service.checksaveRecipe(req.body.userId, recipeId)

			//console.log(recipeItem)
			console.log(result)
			if (result[0]) {
				res.json({ message: 'unsave' })
			} else {
				res.json({ message: 'save' })
			}
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal server error' })
		}

	}
	unsave = async (req: Request, res: Response) => {

		try {
			console.log("unlike recipe: ", req.body)

			let recipeId = parseInt(req.body.recipeId)
			let result = await this.service.checksaveRecipe(req.user_id, recipeId)
			if (!result && !result.isArray()) {
				res.status(404).json({ message: 'record not found' })
				return
			}
			result = await this.service.unsaveRecipe(req.body.userId, recipeId)


		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal server error' })
			throw new Error(error)
		}
	}
	postRecipe = async (req: Request, res: Response) => {

		try {
			console.log("recipe: ", req.body)

			const id = req.body.id
			const result = await this.service.recipeResult(parseInt(id))
			console.log(result[0].steps)
			const resultIn = await this.service.ingredientResult(parseInt(id))
			console.log(resultIn)
			const resultMe = await this.service.cookingMethodsResult(parseInt(id))
			console.log(resultMe)
			const resultType = await this.service.typeResult(result[0].cuisine_type_id)
			const resultImg = await this.service.imageResult(parseInt(id))
			const resultUser = await this.service.userResult(result[0].user_id)

			console.log(resultUser[0])
			const numOfLike = await this.service.likeResult(id)

			let recipeItem = {
				user: resultUser[0],
				name: result[0].name,
				cuisine_type: resultType[0].name,
				serving_size: result[0].serving_size,
				duration_min: result[0].duration_min,
				isVegan: result[0].isVegan,
				description: result[0].descriptions,
				steps: result[0].steps,
				image_names: resultImg,
				cooking_methods: resultMe,
				recipeIngredients: resultIn,
				numOfLike: numOfLike.rows
			}
			//console.log(recipeItem)
			res.json({ recipeData: recipeItem })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	searchRecipe = async (req: Request, res: Response) => {

		try {


			console.log("recipeKeyword: ", "recipe/search")
			const recipeKeyword = req.body.recipeKeyword
			const ingredients = req.body.ingredients
			const methods = req.body.methods
			console.log(methods[0])
			const style = req.body.style
			const time = req.body.time
			const isVegan = req.body.isVegan
			console.log(style)
			let middleResults = await this.service.middleSearch(recipeKeyword, ingredients)

			middleResults = middleResults.rows.map((middleResult: { recipe_id: number }) => {
				return middleResult.recipe_id;
			})
			console.log("1.", middleResults)
			// if (methods.isArray() && !methods[0]) {
			if (Array.isArray(methods) && !methods[0]) {

				middleResults = await this.service.middleSearch02(middleResults, methods)
				middleResults = middleResults.rows.map((middleResult: { recipe_id: number }) => {
					return middleResult.recipe_id;

				})
				console.log("2.", middleResults)
			}
			// if (style && (Array.isArray(style) && style.length > 0)) {
			if (style && style.length > 0) {
				middleResults = await this.service.middleSearch03(middleResults, style)
				middleResults = middleResults.rows.map((middleResult: { id: number }) => {
					return middleResult.id;
				})
				console.log("3.", middleResults)
			}
			if (time !== "") {
				if (time === "under30min") {
					middleResults = await this.service.middleSearchDuration(middleResults, 0, 30)
				}
				if (time === "30to60min") {
					middleResults = await this.service.middleSearch0430to60min(middleResults)
				}
				if (time === "over60min") {
					middleResults = await this.service.middleSearch04over60min(middleResults)
				}
				middleResults = middleResults.rows.map((middleResult: { id: number }) => {
					return middleResult.id;
				})
				console.log("4.", middleResults)
			}
			if (isVegan) {
				let isVeganState = (isVegan === "notVegan")
				middleResults = await this.service.middleSearch05(middleResults, isVeganState)
				middleResults = middleResults.rows.map((middleResult: { id: number }) => {
					return middleResult.id;
				})
				console.log("5.", middleResults)
			}
			if (middleResults[0] !== undefined) {
				const result = await this.service.searchResult(middleResults)
				res.json({ recipeData: result.rows })
			} else {
				res.json({ recipeData: [] })
			}
		} catch (err) {
			console.log("search error", err)
		}
	}
}



