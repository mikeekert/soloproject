myApp.factory('UserService', function ($http, $location) {
  console.log('UserService Loaded');

  var userObject = [{}];

  return {
    userObject: userObject,

    getuser: function () {
      $http.get('/user').then(function (response) {
        if (response.data.username) {
          userObject.userName = response.data.username;
          userObject.userID = response.data.id;
        } else {
          // user has no session, bounce them back to the login page
          $location.path("/home");
        }
      }, function (response) {
        console.log('UserService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    },

    logout: function () {
      $http.get('/user/logout').then(function (response) {
        $location.path("/home");
      });
    },

    getgames: function () {
      userObject.selectedGame = [];
      $http.get('/games/').then(function (response) {
        userObject.games = response.data;
      });
    },

    apiSearch: function (name) {
      userObject.selectedGame = [];
      $http.post('/games/api/' + name).then(function (response) {
        userObject.results = response.data;
      });
    },

    selectGame: function (target) {
      $http.post('/games/hours/' + target.name).then(function (res) {
        userObject.selectedGame = [target];
        userObject.results = [];
        userObject.selectedGame[0].time = res.data[0].gameplayMain;
        console.log('selected this one: ', userObject.selectedGame);
        
      });
    },

    sendGame: function () {
      
      userObject.gameObj = {
        user: userObject.userID,
        title: userObject.selectedGame[0].name,
        releasedate: userObject.selectedGame[0].release_dates[0].human,
        platform: userObject.selectedGame[0].system.name,
        coverart: userObject.selectedGame[0].image,
        timetobeat: 20,
        nowplaying: userObject.nowplaying,
        completed: false,
        progress: userObject.hoursIn
      };

      console.log('ready to post: ', userObject.gameObj);
      
      
      $http.post('/games/', userObject.gameObj).then(function (response) {
        console.log(response);
      }).then(function () {
        userObject.selectedGame = [];
        userObject.nowplaying = [];
        userObject.hoursIn = [];
        $location.path("/user");
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