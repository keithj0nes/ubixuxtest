angular.module("toDoApp").service("mainService", function($http){

  var arrrrr = ["wash hands", "buy clothes"];

  this.addTodo = function(x){
    // console.log(x, "in service");

    var dataObj = {
      todo: x,
      completed: false,
      archived: false
    }
    return $http({
      method: "POST",
      url: "/api/todo",
      data: dataObj
    }).success(function(){
      console.log("successfully added to server");
    })
  }

  this.getTodoList = function(){
    return $http({
      method: "GET",
      url: "/api/todo"
    }).then(function(response){
      return response.data;
    })
  }

  this.deleteTodo = function(todoId){
    return $http({
      method: "DELETE",
      url: "/api/todo/" + todoId
    }).then(function(res){
      return res.data;
    })
  }

  this.deleteCompleted = function(toDoArray){

    for (var i = 0; i < toDoArray.length; i++) {
      if(toDoArray[i].completed === true){
        console.log(toDoArray[i].id, "THIS IS DONE");
         $http({
          method: "DELETE",
          url: "/api/deletecompleted/" + toDoArray[i].id
        }).then(function(res){
          console.log(res.data, "innnnn");
          return res.data;
        })
      }
    }
  }

  this.archiveCompleted = function(toDoArray){

    for (var i = 0; i < toDoArray.length; i++) {
      if(toDoArray[i].completed === true){
        toDoArray[i].archived = true;

        var setarchivetrue = {
          archived: toDoArray[i].archived
        }

        // console.log(setarchivetrue, "in service again");

        $http({
          method: "PUT",
          url: "/api/archivetodo/" + toDoArray[i].id,
          data: setarchivetrue
        }).then(function(res){
          // console.log(res, "response in service");
        })
      }
    }
  }


  this.setCompleted = function(todo){
    // console.log(todo.completed, "set completed to true / false in service");
    if(todo.completed === false){
      todo.completed = true;
    } else {
      todo.completed = false;
    }

    let todocompleted = {
      completed: todo.completed
    };
    return $http({
      method: "PUT",
      url: "/api/settodo/" + todo.id,
      data: todocompleted
    }).success(function(){
        console.log("todo completed updated");
    })
  }


  this.updateTodo = function(todo){
    // console.log(todo, "updateTodo in service");
    let updatedObj = {
      name: todo.name,
      completed: false
    }
    return $http({
      method: "PUT",
      url: "/api/todo/" + todo.id,
      data: updatedObj
    }).then(function(res){
      // console.log(res, "updateTodo worked");
    })
  }


})
