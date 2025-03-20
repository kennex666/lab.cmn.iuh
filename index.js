require("dotenv").config();
const express = require("express");
const multer = require("multer");

const app = express();
const { docClient } = require("./helper/aws.helper");
const { uploadFile } = require("./helper/file.helper");
const tableName = "MonHoc";


app.use(express.urlencoded({ extended: true }));
app.use(express.static("./views"));

app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
const stogare = multer.memoryStorage();
const uploadMiddleware = multer({
    stogare,
    fileSize: 1024 * 1024 * 3,
}).single("image");

app.get("/", (req, res) => {
    const params = {
        TableName: tableName
    }

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error("Rev fail");
            console.error(err)
            return;
        }
        return res.render("index", { courses: data.Items });
    })
})

app.post("/add", uploadMiddleware, async(req, res) => {

    const file = req.file;
    if (!file) {
        console.log("Error: No file found!")
        res.redirect("/")
        return
    }
    const image = await uploadFile(file);
    console.log(image);
    console.log(docClient)


    const params = {
        TableName: tableName,
        Item: {...req.body, id: req.body.id - 0, image }

    }

    docClient.put(params, (err, data) => {
        console.info(params)
        if (err) {
            console.log(err)
            return res.send("Put fail")
        }

        return res.redirect("/");
    })
})

app.get("/delete/:id", (req, res) => {
    console.log("Ran into delete")
    const paramItem = {
        TableName: tableName,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": req.params.id - 0
        }
    }


    docClient.query(paramItem,
        (err, data) => {
            if (err) {
                console.log(err);
                return res.redirect("/");
            }

            docClient.delete({
                TableName: tableName,
                Key: { id: data.Items[0].id, name: data.Items[0].name },
            }, (err, data) => {
                if (err) {
                    console.log(err);
                }

                return res.redirect("/");

            });

        });
});



app.listen(3000, () => {
    console.log("Running on port 3000");
})