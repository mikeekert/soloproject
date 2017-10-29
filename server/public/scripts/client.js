var myApp = angular.module('myApp', ['ngRoute']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {

  $locationProvider.hashPrefix('');
  console.log('myApp -- config');
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/add', {
      templateUrl: '/views/templates/add.html',
      controller: 'AddController as ac',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    }).when('/about', {
      templateUrl: '/views/templates/about.html',
      controller: 'AboutController as tc',
    })
    .otherwise({
      redirectTo: 'home'
    });
});
