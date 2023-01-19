import UserService from "../services/UserService";
import SocketIO from 'socket.io';
import { Request, Response } from 'express';
import { checkPassword } from "../hash";
import fetch from 'cross-fetch'
import jwtSimple from 'jwt-simple';
import jwt from "../token/jwt";
import knex, { Knex } from "knex";
import IncomingForm from 'formidable/Formidable';
import { uploadToS3 } from '../utils/aws-s3-upload';
import fs from 'fs'
import { initFormidable } from '../utils/upload';
export default class UserController {
    private service: UserService;
    constructor(service: UserService) {
        this.service = service;
    }

    register = async (req: Request, res: Response) => {
        console.log('userRoutes - [/register]')
        try {
            const username = req.body.username
            const password = req.body.password
            const email = req.body.email

            if (!username || !password && !username || !email && !username) {
                res.status(400).json({
                    message: 'Invalid username or password'
                })
                return
            }

            // this.service.register(username, password, email, user_icon)
            this.service.register(username, password, email)


            res.json({ message: 'User created' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    login = async (req: Request, res: Response) => {
        console.log('userRoutes - [/login]')
        const username = req.body.username
        const password = req.body.password

        try {
            if (!username || !password) {
                res.status(400).json({
                    message: 'Invalid username or password'
                })
                return
            }

            let dbUser = await this.service.getUser(username)
            console.log(dbUser)
            if (!dbUser) {
                res.status(400).json({
                    message: 'user not found'
                })
                return
            }

            let isMatched = await checkPassword(password, dbUser.password)
            if (!isMatched) {
                res.status(400).json({
                    message: 'Invalid username or password'
                })
                return
            }
            const payload = {
                user_id: dbUser.id,
                displayName: dbUser.username,
                displayEmail: dbUser.email,
                // displayUserIcon: dbUser.user_icon,
                time: new Date().toLocaleTimeString()
            }
            const token = jwtSimple.encode(payload, jwt.jwtSecret);

            // req.session['user'] = dbUser.id
            // console.log("user: " + req.session['user'])
            console.log("token", token)
            console.log("payload", payload)

            res.status(200).json({
                status: "successful",
                token: token,
                dbUser
            })

        } catch (err) {
            console.log("error", err)
        }
    }



    logout = async (req: Request, res: Response) => {
        req.session.destroy(() => {
            console.log('user logged out')
        })
        res.redirect('/')
    }
    me = async (req: Request, res: Response) => {
        res.json({
            message: 'Success retrieve user',
            data: {
                user: req.session['user'] ? req.session['user'] : null
            }
        })
    }

    editString = async (req: Request, res: Response) => {
        console.log(req.body)
        console.log("triggered /user/profile/edit02")
        try {

            await this.service.editProfile(req.body.username, req.body.introduction, req.body.email, req.body.icon, req.body.userId)

            // Insert accessPath to your table

            res.json({ message: "success" })
            return

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    editObject = async (req: Request, res: Response) => {

        const form: IncomingForm = initFormidable()
        console.log("triggered /user/profile/edit01")
        try {
            form.parse(req, async (err, fields, files) => {


                let file = Array.isArray(files.icon) ? files.icon[0] : files.icon
                let fileName = file ? file.newFilename : undefined

                // Upload file to AWS S3
                const accessPath = await uploadToS3({
                    Bucket: 'c22-frd011b',
                    Key: `${fileName}`,
                    Body: fs.readFileSync(file.filepath!),
                })
                console.log(accessPath)
                // Insert accessPath to your table
                await this.service.editProfile(req.body.username, req.body.introduction, req.body.email, accessPath, req.body.userId)
                res.json({ message: "success" })
                return
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    getme = async (req: Request, res: Response) => {
        console.log("triggered post /user/getme")
        try {
            const payload = jwtSimple.decode(req.body.token, jwt.jwtSecret);
            //console.log("payload: ", payload)
            let result = await this.service.getmeUser(payload.user_id)
            //console.log(result)
            const newPayload = {
                user_id: result[0].id,
                displayName: result[0].username,
                displayEmail: result[0].email,
                displayIcon: result[0].user_icon,
                // displayUserIcon: dbUser.user_icon,
                time: new Date().toLocaleTimeString()
            }
            const token = jwtSimple.encode(newPayload, jwt.jwtSecret);


            //console.log("token", newPayload)

            //console.log("payload", payload)

            res.status(200).json({
                status: "successful",
                token: token
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }



    }

    cooksnapSend = async (req: Request, res: Response) => {
        const form: IncomingForm = initFormidable()
        console.log("triggered post /user/cooksnap")
        try {
            form.parse(req, async (err, fields, files) => {
                //console.log( "err: ",err )
                //console.log( "fields: ", fields)
                //console.log( "files: ", files)

                // vv make it a number later
                console.log("recipeId got:", fields.recipeId)

                let file = Array.isArray(files.image) ? files.image[0] : files.image
                let fileName = file ? file.newFilename : undefined

                // Upload file to AWS S3
                const accessPath = await uploadToS3({
                    Bucket: 'c22-frd011b',
                    Key: `${fileName}`,
                    Body: fs.readFileSync(file.filepath!),
                })
                console.log(accessPath)
                // Insert accessPath to your table
                let result = await this.service.commentSend(fields.userId, fields.recipeId, fields.content, fields.contentType, accessPath)
                res.json({ accessPath: accessPath })
                return
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }

    }

    commentSend = async (req: Request, res: Response) => {
        console.log("[send comment:/user/comment]")
        try {
            let result = await this.service.commentSend(req.body.userId, req.body.recipeId, req.body.content, req.body.contentType, req.body.imageName)
            res.json({ message: 'comment sent' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }

    }

    getSavedPosts = async (req: Request, res: Response) => {
        try {

            let dataFromDB = await this.service.SavedPosts(req.body.userId)
            res.json(dataFromDB);
        } catch (error) {
            console.log("getSavedPosts error", error)
        }



    }

}