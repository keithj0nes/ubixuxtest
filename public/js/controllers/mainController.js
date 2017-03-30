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

$scope.inputTodo = "";

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
    mainService.deleteTodo(id).then(function(res){
      $scope.toDoArray = [];
      $scope.archivedArray = [];
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
    $scope.inputTodo = "";
    if(todo){
      mainService.addTodo(todo)
      $scope.toDoArray = [];
      $scope.archivedArray = [];
      setTimeout(function () {
        $scope.getTodoList();
      }, 10);
      $scope.inputTodo = "";
      console.log($scope.inputTodo);
    }
  }

  $scope.toDoArray = [];
  $scope.archivedArray = [];

  $scope.getTodoList = function(){
    mainService.getTodoList().then(function(res){

    ////////// this for loop will push items in toDoArray and archivedArray /////////////
      for (var i = 0; i < res.length; i++) {
        if(res[i].archived === false){
          $scope.toDoArray.push(res[i])
        } else {
          $scope.archivedArray.push(res[i])
        }
      }

      $scope.todoTotal = $scope.toDoArray.length;
      if($scope.todoTotal === 1) {
        $scope.todoText = "thing"
      } else {
        $scope.todoText = "things"
      }
      $scope.archivedTotal = $scope.archivedArray.length;
      if($scope.todoTotal === 1) {
        $scope.archivedText = "thing"
      } else {
        $scope.archivedt = "things"
      }
    });
  }

  $scope.addLastItem = function(){
    mainService.getTodoList().then(function(res){
      $scope.toDoArray.push(res[res.length-1])
      $scope.todoTotal++;
    })
  }

  $scope.logoutUser = function(){
    loginService.logoutUser().then(function(res){
      $location.path("/");
    });
  }

  $scope.getUsername = function(){
    loginService.getUsername().then(function(res){
      $scope.userName = res.name_first;
      $scope.userOrg = res.org_name;
    })
  }

  $scope.getUsersInOrg = function(){
    loginService.getUsersInOrg().then(function(res){
      $scope.usersInOrg = res
    })
  }

  $scope.getUsername(); //get username on load
  $scope.getUsersInOrg(); //get users in organziation on load
  $scope.getTodoList(); //get all todo's on page load

})
