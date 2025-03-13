const express = require("express");

const app = express();
const data = require("./data");

app.use(express.urlencoded({extended: true}));
app.use(express.static("./views"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
	return res.render("index", {courses: data});
})

app.listen(3000, () =>{
	console.log("Running on port 3000");
})