
import { Request, Response } from 'express';
import ProfileService from "../services/ProfileService";

export default class ProfileController {
    private service: ProfileService;
    constructor(service: ProfileService) {
        this.service = service;
    }




    collection = async (req: Request, res: Response) => {
        try {
            console.log("/collection/items:", req.body)
            const dbData = await this.service.getCollectionItem(req.body.userId)
            res.json(dbData);
        }
        catch (err) {
            console.log("collection error:", err);
        }
    }

    myRecipe = async (req: Request, res: Response) => {
        try {
            console.log("/my-recipe/items:", req.body)
            const dbData = await this.service.getMyRecipeItem(req.body.userId)
            res.json(dbData);
        }
        catch (err) {
            console.log("myRecipe error:", err);
        }
    }
}
