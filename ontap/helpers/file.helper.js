const { s3 } = require("./aws.helper");

//  Random
const randomStr = (len) => {
    var char = '';

    while (char.length < len) {
        char += Math.random().toString(36).substring(2);
    }
    return char.substring(0, len);
}


const uploadFile = async(file) => {
    const fileName = randomStr(6) + "-" + new Date().getTime();

    try {
        const result = await s3.putObject({
            Bucket: process.env.BUCKET_NAME,
            Body: file.buffer,
            Key: fileName
        }).promise();
        return "https://s3." + process.env.AWS_REGION + ".amazonaws.com/" + process.env.BUCKET_NAME + "/" + fileName;
    } catch (error) {
        console.log(err)
        return null;
    }
}

module.exports = {
    uploadFile
}