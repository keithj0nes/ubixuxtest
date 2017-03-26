angular.module("toDoApp").controller("loginController", function($scope, loginService, $location){


$scope.createAccount = function(org_name, name_first, name_last, email, password){
  let newUserInfo = {
    org_name: org_name,
    name_first: name_first,
    name_last: name_last,
    email: email,
    password: password
  }

  $scope.emailExists = false;
  $scope.email_feedback = "";
  $scope.passNotMatch = false;
  $scope.pass_confirm_feedback = "";

  if(password != $scope.confirm_password){
    // alert("Your passwords are not the same")
    $scope.passNotMatch = true;
    $scope.pass_confirm_feedback = "**Passwords must match**";
  } else {
    loginService.createAccount(newUserInfo).then(function(res){
      if(res.accountExists === true){
        $scope.emailExists = true;
        $scope.email_feedback = "**Account already exists for that email address**";
      } else {
        $location.path("/home");
      }
    });
  }
}


$scope.returnUserLogin = function(email, password){
  let returnUserInfo = {
    email: email,
    password: password
  }

  $scope.returnAccount = false;
  $scope.return_feedback = "";


  loginService.returnUserLogin(returnUserInfo).then(function(res){
    // console.log(res, "response from loginService");
    if(res.accountCredentials === false){
      $scope.returnAccount = true
      $scope.return_feedback = "**Incorrect email/pass combination**";
    } else {
      $location.path("/home");
    }
  })
}

})
