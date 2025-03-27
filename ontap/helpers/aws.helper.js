const AWS = require("aws-sdk");

const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
})

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();

const s3 = new AWS.S3();

module.exports = {
    dynamoDB: docClient,
    s3: s3
}