angular.module("toDoApp", ["ui.router"])
  .config(function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state("login", {
        url: "/",
        templateUrl: "views/login.html",
        controller: "loginController"
      })
      .state("home", {
        url: "/home",
        templateUrl: "views/home.html",
        controller: "mainController"
      })

    $urlRouterProvider
      .otherwise("/")

  })
