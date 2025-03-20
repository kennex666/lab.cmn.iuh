const { s3 } = require("./aws.helper");

function randomChars(len) {
    var chars = '';

    while (chars.length < len) {
        chars += Math.random().toString(36).substring(2);
    }

    // Remove unnecessary additional characters.
    return chars.substring(0, len);
}

const uploadFile = async(file) => {
    const fileName = `${randomChars(5)}-${new Date().getTime()}_${file.originalname}`;

    try {
        const result = await s3.putObject({
            Bucket: process.env.BUCKET_NAME,
            Body: file.buffer,
            Key: fileName
        }).promise();
        console.log(result);
        return "https://s3.ap-southeast-2.amazonaws.com/" + process.env.BUCKET_NAME + "/" + fileName;
    } catch (error) {
        console.log(error)
        return null;
    }
}

module.exports = {
    uploadFile
}