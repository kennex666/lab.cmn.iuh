require("dotenv").config();
const express = require("express");

const app = express();
const { docClient } = require("./helper/aws.helper");
const tableName = "MonHoc";


app.use(express.urlencoded({ extended: true }));
app.use(express.static("./views"));

app.set("view engine", "ejs");
app.set("views", "./views");

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

app.post("/add", (req, res) => {
    console.log(docClient)
    const params = {
        TableName: tableName,
        Item: {...req.body, id: req.body.id - 0 }

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