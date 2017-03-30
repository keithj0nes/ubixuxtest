const express = require("express"),
      bodyParser = require("body-parser"),
      session = require("express-session"),
      cors = require("cors"),
      massive = require("massive"),
      config = require("./config.js"),
      passport = require("passport"),
      LocalStrategy = require('passport-local').Strategy;

const app = module.exports = express();

const loginController = require("./controller/nodeLoginCtrl.js");
const todoController = require("./controller/nodeTodoCtrl.js");

var conn = massive.connectSync({
  connectionString : config.psqlConnString ////////// change this to your db link, such as postgres://postgres:@localhost/DBNAMEHERE
});

app.set('db', conn);
var db = app.get('db');

// Middleware  =  =  =  =  =

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(cors());
app.use(express.static(__dirname + "/public"));    //current file directory + /public folder
app.use(passport.initialize());
app.use(passport.session());

function checkLoggedIn(req, res, next){
  if(!!req.session.currentUser){
    next()
  } else {
    res.status(401).send("You must be logged in")
  }
}

// END POINTS  =  =  =  =  =  =  =  =  =

// Authentication  = = = = =
app.get("/api/auth/getusername", loginController.getUsername);
app.get("/api/auth/getusersinorg", loginController.getUsersInOrg);
app.post("/api/auth/createaccount", loginController.createAccount);
app.post("/api/auth/login", loginController.login);
app.post("/api/auth/logout", loginController.logout);

// Todo List  = = = = =
app.get("/api/todo", checkLoggedIn, todoController.getTodoList);
app.post("/api/todo", checkLoggedIn, todoController.addTodo);
app.put("/api/todo/:id", checkLoggedIn, todoController.editTodo);
app.put("/api/settodo/:id", checkLoggedIn, todoController.completeTodo);
app.put("/api/archivetodo/:id", checkLoggedIn, todoController.archiveTodo);
app.delete("/api/todo/:id", checkLoggedIn, todoController.deleteTodo);
app.delete("/api/deletecompleted/:id", checkLoggedIn, todoController.deleteCompleted);

app.listen(config.port, function(){
  console.log("listening on port ", config.port)
})
