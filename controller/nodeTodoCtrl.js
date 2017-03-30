const app = require("../server.js");

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
  db.run("SELECT * FROM todo WHERE user_id = $1 ORDER BY id ASC", [req.session.currentUser.id], function(err, todos){
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
    res.status(200).send(todo);
  })
}


function completeTodo(req, res, next){
  const db = app.get('db');
  db.run("UPDATE todo SET completed = $1, datecompleted = $3 WHERE id = $2",[req.body.completed, req.params.id, req.body.datecompleted], function(err, todo){
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
    res.status(200).send(todo)
  })
}

function editTodo(req, res, next){
  const db = app.get('db');
  db.run("UPDATE todo SET name = $1, completed = $2 WHERE id = $3", [req.body.name, req.body.completed, req.params.id], function(err, todo){
    if(err){
      console.log(err);
      res.status(500).send(err)
    }
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
