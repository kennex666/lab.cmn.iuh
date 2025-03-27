require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const { dynamoDB } = require("./helpers/aws.helper");
const { uploadFile } = require("./helpers/file.helper");

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("./views"));

app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware upload

const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 1024 * 1024 * 2
    }
}).single("img");

//  Random
const randomStr = (len) => {
    var char = '';

    while (char.length < len) {
        char += Math.random().toString(36).substring(2);
    }
    return char.substring(0, len);
}

app.get("/", (req, res) => {

    dynamoDB.scan({
        TableName: process.env.TABLE_NAME
    }, (err, data) => {
        if (err) {
            console.error("Rev fail");
            console.error(err)

            res.render("index", {
                papers: []
            })
            return;
        }
        res.render("index", {
            papers: data.Items
        })
    })

})

app.get('/add', (req, res) => {
    res.render("add")
})

app.get('/delete', (req, res) => {
    const id = req.query.id;

    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }

    console.log(params)
    dynamoDB.query(params, (err, data) => {
        if (err) {
            console.log(err)
            return res.redirect("/")
        }

        dynamoDB.delete({
            TableName: process.env.TABLE_NAME,
            Key: {
                id: data.Items[0].id,
                name: data.Items[0].name
            }
        }, (err, data) => {
            if (err) {
                console.log(err)
            }
            return res.redirect("/")
        })
    })
})

app.post("/add", uploadMiddleware, async(req, res) => {
    const body = req.body;

    const file = req.file;
    if (!file) {
        console.log("Error: No file found!")
        res.redirect("/")
        return
    }
    const image = await uploadFile(file);


    console.log(body)
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            ...body,
            id: randomStr(4) + "-" + new Date().getTime(),
            image: image,
            numberSheet: body.numberSheet - 0,
            year: body.year - 0
        }
    }

    dynamoDB.put(params, (err, data) => {
        if (err) {
            console.log(err);
            return res.redirect("/add");
        }
        return res.redirect("/")
    })
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})