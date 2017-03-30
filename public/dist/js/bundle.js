"use strict";

angular.module("toDoApp", ["ui.router"]).config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state("login", {
    url: "/",
    templateUrl: "views/login.html",
    controller: "loginController"
  }).state("home", {
    url: "/home",
    templateUrl: "views/home.html",
    controller: "mainController"
  });

  $urlRouterProvider.otherwise("/");
});
"use strict";

angular.module("toDoApp").controller("loginController", function ($scope, loginService, $location) {

  console.log("PLEASE DO NOT USE REAL PASSWORD! Please use dummy email and password for testing purposes");
  alert("PLEASE DO NOT USE REAL PASSWORD! Please use dummy email and password for testing purposes");

  $scope.createAccount = function (org_name, name_first, name_last, email, password) {
    var newUserInfo = {
      org_name: org_name,
      name_first: name_first,
      name_last: name_last,
      email: email,
      password: password
    };

    $scope.emailExists = false;
    $scope.email_feedback = "";
    $scope.passNotMatch = false;
    $scope.pass_confirm_feedback = "";

    if (password != $scope.confirm_password) {
      $scope.passNotMatch = true;
      $scope.pass_confirm_feedback = "**Passwords must match**";
    } else {
      loginService.createAccount(newUserInfo).then(function (res) {
        if (res.accountExists === true) {
          $scope.emailExists = true;
          $scope.email_feedback = "**Account already exists for that email address**";
        } else {
          $location.path("/home");
        }
      });
    }
  };

  $scope.returnUserLogin = function (email, password) {
    var returnUserInfo = {
      email: email,
      password: password
    };

    $scope.returnAccount = false;
    $scope.return_feedback = "";

    loginService.returnUserLogin(returnUserInfo).then(function (res) {
      if (res.accountCredentials === false) {
        $scope.returnAccount = true;
        $scope.return_feedback = "**Incorrect email/pass combination**";
      } else {
        $location.path("/home");
      }
    });
  };
});
"use strict";

angular.module("toDoApp").controller("mainController", function ($scope, mainService, loginService, $location) {

  //function that hides and shows organization members on click using ng-class
  $scope.torf = true;

  $scope.hideOrg = function () {
    if ($scope.torf) {
      $scope.torf = false;
    } else {
      $scope.torf = true;
    }
  };

  $scope.inputTodo = "";

  $scope.updateTodo = function (todo) {
    mainService.updateTodo(todo).then(function (res) {
      $scope.toDoArray = [];
      $scope.archivedArray = [];
      $scope.getTodoList();
    });
  };

  $scope.setCompleted = function (todo) {
    mainService.setCompleted(todo);
  };

  $scope.deleteTodo = function (id) {
    mainService.deleteTodo(id).then(function (res) {
      $scope.toDoArray = [];
      $scope.archivedArray = [];
      $scope.getTodoList();
    });
  };

  $scope.deleteCompleted = function () {
    // mainService.deleteCompleted($scope.toDoArray)
    //   $scope.getTodoList();

    for (var i = 0; i < $scope.toDoArray.length; i++) {
      console.log($scope.toDoArray[i].completed);
      if ($scope.toDoArray[i].completed === true) {
        console.log("THIS WORKD");
        $scope.ar.push($scope.toDoArray[i]);
        console.log($scope.ar);
      }
    }
  };

  $scope.archiveCompleted = function () {
    mainService.archiveCompleted($scope.toDoArray);
    setTimeout(function () {
      $scope.toDoArray = [];
      $scope.archivedArray = [];
      $scope.getTodoList();
    }, 10);
  };

  $scope.addTodo = function (todo) {
    $scope.inputTodo = "";
    if (todo) {
      mainService.addTodo(todo);
      $scope.toDoArray = [];
      $scope.archivedArray = [];
      setTimeout(function () {
        $scope.getTodoList();
      }, 10);
      $scope.inputTodo = "";
      console.log($scope.inputTodo);
    }
  };

  $scope.toDoArray = [];
  $scope.archivedArray = [];

  $scope.getTodoList = function () {
    mainService.getTodoList().then(function (res) {

      ////////// this for loop will push items in toDoArray and archivedArray /////////////
      for (var i = 0; i < res.length; i++) {
        if (res[i].archived === false) {
          $scope.toDoArray.push(res[i]);
        } else {
          $scope.archivedArray.push(res[i]);
        }
      }

      $scope.todoTotal = $scope.toDoArray.length;
      if ($scope.todoTotal === 1) {
        $scope.todoText = "thing";
      } else {
        $scope.todoText = "things";
      }
      $scope.archivedTotal = $scope.archivedArray.length;
      if ($scope.todoTotal === 1) {
        $scope.archivedText = "thing";
      } else {
        $scope.archivedt = "things";
      }
    });
  };

  $scope.addLastItem = function () {
    mainService.getTodoList().then(function (res) {
      $scope.toDoArray.push(res[res.length - 1]);
      $scope.todoTotal++;
    });
  };

  $scope.logoutUser = function () {
    loginService.logoutUser().then(function (res) {
      $location.path("/");
    });
  };

  $scope.getUsername = function () {
    loginService.getUsername().then(function (res) {
      $scope.userName = res.name_first;
      $scope.userOrg = res.org_name;
    });
  };

  $scope.getUsersInOrg = function () {
    loginService.getUsersInOrg().then(function (res) {
      $scope.usersInOrg = res;
    });
  };

  $scope.getUsername(); //get username on load
  $scope.getUsersInOrg(); //get users in organziation on load
  $scope.getTodoList(); //get all todo's on page load
});
"use strict";

angular.module("toDoApp").service("loginService", function ($http) {

  this.createAccount = function (newUserInfo) {
    return $http({
      method: "POST",
      url: "/api/auth/createaccount",
      data: newUserInfo
    }).then(function (res) {
      return res.data;
    });
  };

  this.returnUserLogin = function (returnUserInfo) {
    return $http({
      method: "POST",
      url: "/api/auth/login",
      data: returnUserInfo
    }).then(function (res) {
      return res.data;
    });
  };

  this.logoutUser = function () {
    return $http({
      method: "POST",
      url: "/api/auth/logout"
    }).then(function (res) {
      return res.data;
    });
  };

  this.getUsername = function () {
    return $http({
      method: "GET",
      url: "/api/auth/getusername"
    }).then(function (res) {
      return res.data;
    });
  };

  this.getUsersInOrg = function () {
    return $http({
      method: "GET",
      url: "/api/auth/getusersinorg"
    }).then(function (res) {
      return res.data;
    });
  };
});
"use strict";

angular.module("toDoApp").service("mainService", function ($http) {

  this.addTodo = function (x) {
    var dataObj = {
      todo: x,
      completed: false,
      archived: false
    };

    return $http({
      method: "POST",
      url: "/api/todo",
      data: dataObj
    }).success(function () {
      console.log("successfully added to server");
    });
  };

  this.getTodoList = function () {
    return $http({
      method: "GET",
      url: "/api/todo"
    }).then(function (response) {
      return response.data;
    });
  };

  this.deleteTodo = function (todoId) {
    return $http({
      method: "DELETE",
      url: "/api/todo/" + todoId
    }).then(function (res) {
      return res.data;
    });
  };

  this.deleteCompleted = function (toDoArray) {

    for (var i = 0; i < toDoArray.length; i++) {
      if (toDoArray[i].completed === true) {
        $http({
          method: "DELETE",
          url: "/api/deletecompleted/" + toDoArray[i].id
        }).then(function (res) {
          return res.data;
        });
      }
    }
  };

  this.archiveCompleted = function (toDoArray) {
    for (var i = 0; i < toDoArray.length; i++) {
      if (toDoArray[i].completed === true) {
        toDoArray[i].archived = true;

        var setarchivetrue = {
          archived: toDoArray[i].archived
        };

        $http({
          method: "PUT",
          url: "/api/archivetodo/" + toDoArray[i].id,
          data: setarchivetrue
        }).then(function (res) {
          return res.data;
        });
      }
    }
  };

  this.setCompleted = function (todo) {
    todo.completed = !todo.completed;

    if (todo.datecompleted) {
      todo.datecompleted = null;
    } else {
      todo.datecompleted = new Date();
    }

    var todoObj = {
      completed: todo.completed,
      datecompleted: todo.datecompleted
    };

    return $http({
      method: "PUT",
      url: "/api/settodo/" + todo.id,
      data: todoObj
    }).success(function () {
      console.log("todo completed updated");
    });
  };

  this.updateTodo = function (todo) {
    // console.log(todo, "updateTodo in service");
    var updatedObj = {
      name: todo.name,
      completed: false
    };
    return $http({
      method: "PUT",
      url: "/api/todo/" + todo.id,
      data: updatedObj
    }).then(function (res) {
      return res.data;
    });
  };
});
//# sourceMappingURL=bundle.js.map
