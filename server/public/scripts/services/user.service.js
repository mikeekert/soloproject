myApp.factory('UserService', function ($http, $location) {
  console.log('UserService Loaded');

  var userObject = [{}];
  
  getgames = function () {
    userObject.selectedGame = [];
    userObject.editGame = [];
    $http.get('/games/').then(function (response) {
      userObject.games = response.data;
        for (var i = 0; i < userObject.games.length; i++) {
          if(userObject.games[i].progress > userObject.games[i].timetobeat) {
            userObject.games[i].progress = userObject.games[i].timetobeat;
          }          
        }
    });
  };

  return {
    userObject: userObject,
    getgames: getgames,

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

    cancel: function() {
      userObject.editGame = [];
      getgames();
    },

    apiSearch: function (name) {
      userObject.selectedGame = [];
      $http.post('/games/api/' + name).then(function (response) {
        userObject.results = response.data;
        console.log('api call array (userObject.results): ',userObject.results);
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

    editGame: function (target) {
      userObject.editGame = [target];
      userObject.games = [];
      console.log('editing this one: ', userObject.editGame);
    },

    updateGame: function (target) {
      if (target.nowplaying == null) {
        target.nowplaying = false;
      }
      userObject.updateGm = {
        user: target.usergame_id,
        title: target.title,
        releasedate: target.releasedate,
        platform: target.platform,
        coverart: target.coverart,
        timetobeat: target.timetobeat,
        nowplaying: target.nowplaying,
        completed: target.completed,
        progress: target.progress
      };
      console.log(userObject.updateGm);
      $http.put('/games/', userObject.updateGm).then(function (response) {
      }).then(getgames());
      
    },

    calcPercent: function(target) {
      var width =  parseInt( ( (target.progress / target.timetobeat)*100).toFixed(0) );
      console.log('width:', width);
      if (width > 100) {
        width=100;
        console.log('width adj:', width);
        
      }
      var strCss = '{"width":'+width+'%}';
      console.log(strCss);
      
      
      return strCss;
    },

    deleteGame: function (target) {
      $http.delete('/games/' + target.usergame_id).then(function (response) {
        getgames();
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
      if (userObject.gameObj.nowplaying == null) {
        userObject.gameObj.nowplaying = false;
      }
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