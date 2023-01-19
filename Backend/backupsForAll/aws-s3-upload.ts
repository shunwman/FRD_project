import aws from 'aws-sdk'

export const uploadToS3 = async (params: {
	Bucket: string
	Key: string
	Body: Buffer
}): Promise<string> => {
	const s3 = new aws.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: 'ap-southeast-1'
	})

	const s3Url = await putObjectPromise(s3, params)
	return s3Url
}

const putObjectPromise = async (
	s3: any,
	params: {
		Bucket: string
		Key: string
		Body: Buffer
	}
): Promise<string> => {
	return new Promise((resolve, reject) => {
		s3.putObject(params, (err: any) => {
			if (err) {
				console.debug('Error uploading data: ' + err)
			} else {
				resolve(
					`https://${params.Bucket}.s3.ap-southeast-1.amazonaws.com/${params.Key}`
				)
			}
		})
	})
}
