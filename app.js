const express = require("express");
const app = express();
const path = require("path");

const errorHandler = require("./middlewares/errorHandler.middleware");
const pageNotFound = require("./middlewares/notFound.middleware");
const checkAuth = require("./middlewares/auth.middleware");
const default_routes = require("./routes/default");
const users_routes = require("./routes/users");
const contact_routes = require("./routes/contact");
const students_routes = require("./routes/students");
const teachers_routes = require("./routes/teachers");
const { createSessionConfig } = require("./config/session");

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

//session a isAuth musia byt vzdy pred routami, inak to nepojde!!!!!
app.use(createSessionConfig());
app.use(checkAuth); 

app.use("/", default_routes);
app.use("/", users_routes);
app.use("/", contact_routes);
app.use("/", students_routes);
app.use("/", teachers_routes);

app.use(errorHandler);   
app.use(pageNotFound); 

app.listen(3000);