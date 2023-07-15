const dotEnv = require("dotenv").config();
const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')

const region =  "ap-southeast-2"
const bucketName = process.env.S3_BUCKET_NAME
const accessKeyId = process.env.S3_ACCESS_KEY_ID
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey  
})

 function uploadFile(file, folder) {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: `${folder}/${file.filename}`,
        ACL:'public-read'
    }

    return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile

function getFileStream(filekey) {
    const downloadParams = {
        Key: filekey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream()
}

exports.getFileStream = getFileStream