import formidable, { Files } from 'formidable'
export const uploadDir = 'uploads'
import express from 'express'

const form = formidable({
	uploadDir: uploadDir,
	keepExtensions: true,
	maxFiles: 1,
	maxFileSize: 52428800,
	// the default limit is 200KB
	filter: (part) => part.mimetype?.startsWith('image/') || false
})

export const formParseBetter = (req: express.Request) => {
	return new Promise<any>((resolve, reject) => {
		// req.body => fields :36
		form.parse(req, (err, fields, files: Files) => {
			if (err) {
				console.log('err in form parsing', err)
				reject(err)
			}
			try {
				const text = fields.text
				const fromSocketId = fields.fromSocketId
				let file = Array.isArray(files.image)
					? files.image[0]
					: files.image
				//console.log(file)
				const filename = file ? file.newFilename : null

				//console.log({
				//	filename,
				//	text
				//})
				// Get File Name
				resolve({
					filename,
					fields,
					text,
					fromSocketId
				})
			} catch (error) {
				console.log('error in form parsing', error)
				reject(error)
			}
		})
	})
}
