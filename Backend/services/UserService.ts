import { Client } from 'pg';
import { hashPassword } from '../hash';
import User from '../models/UserModel'


export default class UserService {
    constructor(private knex: any) { }
    async register(username: string, password: string, email: string) {
        let hashedPassword = await hashPassword(password)
        //await this.client.query(
        //	`insert into users (username, password) values ($1, $2)`,
        //	[username, hashedPassword]
        //)
        const ids = await this.knex.insert({ username: username, password: hashedPassword, email: email }).into("users").returning("id")
    }
    async getUser(username: string) {
        try {

            if (!username) {
                console.log("No username!")
                return
            }
            const result = await this.knex.select("username", "password", "id", "user_icon", "created_at", "updated_at", "email").from("users")
                .where("username", username)

            // if (!result) {
            //     console.log("result db error")
            //     return 
            // }
            console.log(result[0])

            let dbUser: User = result[0]

            // console.log(dbUser)

            // if (!dbUser) {
            //     return
            // }

            return dbUser;

        } catch (err) {
            console.log("getUser error:", err)
            throw new Error(err)
        }

    }
    async editProfile(username: string, introduction: string, email: string, icon: string, userId: number) {

        try {
            const ids = await this.knex("users")
                .where("id", userId)
                .update({
                    username: username,
                    introduction: introduction,
                    email: email,
                    // user_icon: icon
                })
            console.log("service used")
            return
        } catch (err) {
            console.log("editProfile error:", err)
            throw new Error(err)
        }



    }
    async getmeUser(user_id: number) {

        try {
            const result = await this.knex.select("username", "password", "id", "user_icon", "created_at", "updated_at", "email").from("users")
                .where("id", user_id)
            console.log(result[0])
            let dbUser = result
            console.log(dbUser)
            return dbUser;
        } catch (err) {
            console.log("getmeUser error:", err)
            throw new Error(err)
        }

    }

    async commentSend(userId: any, recipeId: any, content: any, contentType: any, imageName: any) {

        try {

            const ids = await this.knex.insert({
                user_id: userId,
                recipe_id: recipeId,
                content: content,
                content_type: contentType,
                image_name: imageName
            }).into("user_feedbacks")
            return
        } catch (err) {
            console.log("commentSend error:", err)
            throw new Error(err)
        }
    }


    async SavedPosts(userId: number) {

        try {
            let dataFromDB = await this.knex.select("*")
                .from("saved_recipes")
                .where("user_id", userId)
            return dataFromDB;
        } catch (err) {
            console.log("SavedPosts error:", err)
            throw new Error(err)
        }

    }
}


