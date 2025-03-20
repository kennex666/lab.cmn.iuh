const AWS = require("aws-sdk");

const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "ap-southeast-2"
})

AWS.config = config;


const docClient = new AWS.DynamoDB.DocumentClient();

const s3 = new AWS.S3();

module.exports = {
    docClient,
    s3
}