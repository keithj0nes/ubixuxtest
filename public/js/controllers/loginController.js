angular.module("toDoApp").controller("loginController", function($scope, loginService, $location){


$scope.createAccount = function(org_name, name_first, name_last, email, password){
  let newUserInfo = {
    org_name: org_name,
    name_first: name_first,
    name_last: name_last,
    email: email,
    password: password
  }

  if(password != $scope.confirm_password){
    alert("Your passwords are not the same")
  } else {
    loginService.createAccount(newUserInfo).then(function(res){
      $location.path("/home")
    });
  }
}

$scope.returnUserLogin = function(email, password){
  let returnUserInfo = {
    email: email,
    password: password
  }


  loginService.returnUserLogin(returnUserInfo).then(function(res){
    // console.log(res, "response from loginService");
    if(res.length < 1){
      alert("incorrect email/password")
    } else {
      $location.path("/home");
    }
  })
}

})
