const app = require("../server.js");
// const db = app.get('db');


module.exports = {
  getTodoList: getTodoList,
  addTodo: addTodo,
  editTodo: editTodo,
  completeTodo: completeTodo,
  archiveTodo: archiveTodo,
  deleteTodo: deleteTodo,
  deleteCompleted: deleteCompleted
}


function getTodoList(req, res, next){
  const db = app.get('db');
  // console.log(req.session.currentUser, "getTodoList")
  db.run("SELECT * FROM todo WHERE user_id = $1 ORDER BY id ASC", [req.session.currentUser.id], function(err, todos){
    // console.log(todos);
    res.status(200).send(todos);
  })
}


function addTodo(req, res, next){
  const db = app.get('db');

  var todoInfo = [req.body.todo, req.body.completed, req.body.archived, req.session.currentUser.id];
  db.addTodo(todoInfo, function(err, todo){
    if(err){
      console.log(err);
      res.status(500).send(err)
    }
    // console.log(req.body, "in db");
    res.status(200).send(todo);
  })
}


function completeTodo(req, res, next){
  const db = app.get('db');

  db.run("UPDATE todo SET completed = $1, datecompleted = timenow() WHERE id = $2",[req.body.completed, req.params.id], function(err, todo){
    if(err){
      console.log(err);
      res.status(500).send(err)
    }
    res.status(200).send(todo)
  })
}


function archiveTodo(req, res, next){
  const db = app.get('db');

  db.run("UPDATE todo SET archived = $1 WHERE id = $2", [req.body.archived, req.params.id], function(err,todo){
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    console.log(todo);
    res.status(200).send(todo)
  })
}


function editTodo(req, res, next){
  const db = app.get('db');

  db.run("UPDATE todo SET name = $1, completed = $2 WHERE id = $3", [req.body.name, req.body.completed, req.params.id], function(err, todo){
    // console.log("before err");
    if(err){
      console.log(err);
      res.status(500).send(err)
    }
    // console.log("save button worked");
    res.status(200).send(todo)
  })
}


function deleteTodo(req, res, next){
  const db = app.get('db');

  db.run("DELETE FROM todo WHERE id = $1",[req.params.id], function(err, todo){
    if(err){
      console.log(err);
      return res.status(500).send(err);
    }
    return res.status(200).send(todo)
  })
}


function deleteCompleted(req, res, next){
  const db = app.get('db');

  db.run("DELETE FROM todo WHERE id = $1", [req.params.id], function(err, todo){
    if(err){
      console.log(err);
      return res.status(500).send(err);
    }
    return res.status(200).send(todo)
  })
}
