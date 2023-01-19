import express from 'express'
import expressSession from 'express-session'
import { initialize as initializeUserRoutes, userRoutes } from './routes/userRoute'
import { initialize as initializeRecipeRoutes, recipeRoutes } from './routes/recipeRoute'
import cors from "cors";
import { Request, Response } from "express";
// knex setup
import Knex from 'knex'
const knexConfigs = require("./knexfile")
let configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);


import { Client } from 'pg'
import dotenv from 'dotenv'
dotenv.config()
export const client = new Client({
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
})

import fs from 'fs'
import { uploadDir } from './upload'
import { logger } from './logger'
import http from 'http'
import { Server as SocketIO } from 'socket.io'
import grant from 'grant'
import { postingRoutes } from './routes/postingRoute';
import { isLoggedIn } from './token/guards';
import { IngredientsPostItem } from './models/PostModel';
import { initFormidable } from './utils/upload';
import IncomingForm from 'formidable/Formidable';
import { uploadToS3 } from './utils/aws-s3-upload';
import { profileRoutes } from './routes/profileRoute';

declare module 'express-session' {
	interface SessionData {
		name?: string
		isloggedin?: boolean
	}
}
declare global {
	namespace Express {
		interface Request {
			user_id?: any,
			token?: string
		}
	}
}
const app = express()
// Auto create a folder
fs.mkdirSync(uploadDir, { recursive: true })
app.use(cors());
const server = new http.Server(app)

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const grantExpress = grant.express({
	defaults: {
		// origin: 'http://192.168.59.115:8080',
		origin: 'http://localhost:8080',
		transport: 'session',
		state: true
	},
	google: {
		key: process.env.GOOGLE_CLIENT_ID || '',
		secret: process.env.GOOGLE_CLIENT_SECRET || '',
		scope: ['profile', 'email'],
		callback: '/user/login/google'
	}
})


app.use(grantExpress as express.RequestHandler)

// initialize function for future socket usage
initializeUserRoutes()
initializeRecipeRoutes()
app.use('/user', userRoutes)
app.use('/recipe', recipeRoutes)
app.use("/posting", postingRoutes)
app.use("/profileRecipe", profileRoutes)










app.put("/test/edit", isLoggedIn, async function (req: Request, res: Response) {
	try {
		console.log(req.body)

		let hardcodeData = {
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		}

		await knex.update(hardcodeData)
			.table("users").where("id", req.user_id)
		res.json({ statusbar: 'success' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Internal server error' })
	}
});


// ----------------------------------------------------------------


app.post("/file", async function (req: Request, res: Response) {
	const form: IncomingForm = initFormidable()
	console.log("triggered post /file")
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

		console.log(accessPath)
		res.json({ accessPath: accessPath })
	})

})

server.listen(8080, () => {
	// logger.info(JSON.stringify(knexConfig))
	logger.info('Listening on port 8080')
})
