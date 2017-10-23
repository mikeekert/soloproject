myApp.factory('UserService', function ($http, $location) {
  console.log('UserService Loaded');

  var userObject = [{}];

  return {
    userObject: userObject,

    getuser: function () {
      console.log('UserService -- getuser');
      $http.get('/user').then(function (response) {
        if (response.data.username) {
          // user has a curret session on the server
          userObject.userName = response.data.username;
          console.log('UserService -- getuser -- User Data: ', userObject.userName);
        } else {
          console.log('UserService -- getuser -- failure');
          // user has no session, bounce them back to the login page
          $location.path("/home");
        }
      }, function (response) {
        console.log('UserService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    },

    logout: function () {
      console.log('UserService -- logout');
      $http.get('/user/logout').then(function (response) {
        console.log('UserService -- logout -- logged out');
        $location.path("/home");
      });
    },

    getgames: function () {
      $http.get('/games/').then(function (response) {
        userObject.games = response.data;
        console.log('UserService -- games -- getting games');
        console.log('userObject -- GET /games/ -- Response:', userObject.games);
      });
    },

    apiSearch: function (name) {
      $http.post('/games/api/' + name).then(function (response) {
        console.log('UserService -- API call:', response);
        userObject.results = response.data;
      });
    },

    selectGame: function (target) {
      userObject.selectedGame = [target];
      console.log(userObject.selectedGame);
      userObject.results = [];
    },
    
    sendGame : function () {
      userObject.gameObj = {
        user: userObject.userName,
        title: userObject.selectedGame.name,
        platform: userObject.selectedGame.system,
        // releasedate: userObject.selectedGame.release_dates[0].human,
        coverart: userObject.selectedGame.image,
        timetobeat: userObject.selectedGame.time_to_beat,
        nowplaying: userObject.nowplaying,
        completed: false,
        progress: userObject.hoursIn
      };
      $http.post('/games/', userObject.gameObj).then(function(response){
        console.log('posted game');
      });
    },

    setfade: function (target) {
      if (target) {
        return {
          opacity: '.5'
        };
      } else {
        return {
          opacity: '1'
        };
      }
    }
  };
});