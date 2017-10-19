myApp.factory('UserService', function($http, $location){
  console.log('UserService Loaded');

  var userObject = [{}];

  return {
    userObject : userObject,

    getuser : function(){
      console.log('UserService -- getuser');
      $http.get('/user').then(function(response) {
          if(response.data.username) {
              // user has a curret session on the server
              userObject.userName = response.data.username;
              console.log('UserService -- getuser -- User Data: ', userObject.userName);
          } else {
              console.log('UserService -- getuser -- failure');
              // user has no session, bounce them back to the login page
              $location.path("/home");
          }
      },function(response){
        console.log('UserService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    },

    logout : function() {
      console.log('UserService -- logout');
      $http.get('/user/logout').then(function(response) {
        console.log('UserService -- logout -- logged out');
        $location.path("/home");
      });
    },

    getgames : function() {
      $http.get('/games/').then(function(response) {
        userObject.games = response.data;
        console.log('UserService -- games -- getting games');
        console.log('userObject -- GET /games/ -- Response:', userObject.games);
      });
    },

    apiSearch : function(name) {
      $http.post('/games/api/'+name).then(function(response) {
        console.log('UserService -- API call:', response);
        userObject.results = response.data;
      });
    },

    selectGame : function(target) {
      userObject.selectedGame = target;
    }
  };
});
