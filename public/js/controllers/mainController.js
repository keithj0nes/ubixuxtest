angular.module("toDoApp").controller("mainController", function($scope, mainService, loginService, $location){

//function that hides and shows organization members on click using ng-class
$scope.torf = true;

$scope.hideOrg = function(){
  if($scope.torf){
    $scope.torf = false;
  } else {
    $scope.torf = true;
  }
}


//DONE --- create function that updates checked off todo with new name and sets completed to false when saved;
//DONE --- change deletealltodo to an archivetodo function
//DONE --- archivetodo pushes to an array?
//DONE --- ng-if todo / archive pages
//DONE --- on setcomplete function, set completed time to timenow
//show timenow on hover of todo item (css)



  $scope.updateTodo = function(todo){
    mainService.updateTodo(todo).then(function(res){
      $scope.toDoArray = [];
      $scope.archivedArray = [];
      $scope.getTodoList();
    })
  }

  $scope.setCompleted = function(todo){
    mainService.setCompleted(todo)
  }

  $scope.deleteTodo = function(id){
    // console.log(id, "deleted id from db");
    mainService.deleteTodo(id).then(function(res){
      $scope.toDoArray = [];
      $scope.archivedArray = [];
      // console.log(res, "alksdjgalsd");
      $scope.getTodoList();
    });
  }

  $scope.deleteCompleted = function(){
    // mainService.deleteCompleted($scope.toDoArray)
    //   $scope.getTodoList();

    for (var i = 0; i < $scope.toDoArray.length; i++) {
      console.log($scope.toDoArray[i].completed);
      if($scope.toDoArray[i].completed === true){
      console.log("THIS WORKD");
      $scope.ar.push($scope.toDoArray[i])
      console.log($scope.ar);
      }
    }
  }

  $scope.archiveCompleted = () => {
    mainService.archiveCompleted($scope.toDoArray)
    setTimeout(function () {
      $scope.toDoArray = [];
      $scope.archivedArray = [];
      $scope.getTodoList();
    }, 10);
  }

  $scope.addTodo = (todo) => {

    if(todo){
      mainService.addTodo(todo)
      $scope.toDoArray = [];
      $scope.archivedArray = [];
      setTimeout(function () {
        // $scope.addLastItem();
        $scope.getTodoList();
      }, 10);
      $scope.inputTodo = "";
    }
  }


  $scope.toDoArray = [];
  $scope.archivedArray = [];

  $scope.getTodoList = function(){
    mainService.getTodoList().then(function(res){

    ////////// this for loop will push items in toDoArray and archivedArray /////////////

      for (var i = 0; i < res.length; i++) {
        if(res[i].archived === false){
          // console.log("toDoArray being pushed");
          $scope.toDoArray.push(res[i])
        } else {
          // console.log('archivedArray being pushed');
          $scope.archivedArray.push(res[i])
        }
      }
      // console.log($scope.toDoArray);

      $scope.todoTotal = $scope.toDoArray.length;
      $scope.archivedTotal = $scope.archivedArray.length;
    });
  }


  $scope.addLastItem = function(){
    mainService.getTodoList().then(function(res){
      // console.log("addLastItem");
      $scope.toDoArray.push(res[res.length-1])
      $scope.todoTotal++;
    })
  }

  $scope.logoutUser = function(){
    // console.log("logout clicked");
    loginService.logoutUser().then(function(res){
      $location.path("/");
    });
  }

  $scope.getUsername = function(){
    loginService.getUsername().then(function(res){
      // console.log(res, "in controller");
      $scope.userName = res.name_first;
      $scope.userOrg = res.org_name;
    })
  }

  $scope.getUsersInOrg = function(){
    loginService.getUsersInOrg().then(function(res){
      // console.log(res, "in controller");
      $scope.usersInOrg = res
    })
  }


  $scope.getUsername(); //get username on load
  $scope.getUsersInOrg(); //get users in organziation on load
  $scope.getTodoList(); //get all todo's on page load


})
