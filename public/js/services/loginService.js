angular.module("toDoApp").service("loginService", function($http){


  this.createAccount = function(newUserInfo){
    return $http({
      method: "POST",
      url: "/api/auth/createaccount",
      data: newUserInfo
    }).then(function(res) {
      return res.data
    })
  }

  this.returnUserLogin = function(returnUserInfo){
    return $http({
      method: "POST",
      url: "/api/auth/login",
      data: returnUserInfo
    }).then(function(res){
      return res.data;
    })
  }

  this.logoutUser = function(){
    return $http({
      method: "POST",
      url: "/api/auth/logout"
    }).then(function(res){
      return res.data;
    })
  }

  this.getUsername = function(){
    return $http({
      method: "GET",
      url: "/api/auth/getusername"
    }).then(function(res){
      return res.data;
    })
  }

  this.getUsersInOrg = function(){
    return $http({
      method: "GET",
      url: "/api/auth/getusersinorg"
    }).then(function(res){
      return res.data;
    })
  }

})
