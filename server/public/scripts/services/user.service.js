myApp.factory('UserService', function ($http, $location) {

  var userObject = [{}];
  userObject.sequence=[];
  
  getgames = function () {
    userObject.selectedGame = [];
    userObject.editGame = [];
    $http.get('/games/').then(function (response) {
      userObject.games = response.data;
      for (var i = 0; i < userObject.games.length; i++) {
        if (userObject.games[i].progress > userObject.games[i].timetobeat) {
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
        // // console.log('UserService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    },

    logout: function () {
      $http.get('/user/logout').then(function (response) {
        $location.path("/home");
      });
    },

    cancel: function () {
      userObject.editGame = [];
      getgames();
    },

    apiSearch: function (name) {
      userObject.selectedGame = [];
      userObject.results = [];
      userObject.loading = true;
      setTimeout(function () {
        $http.post('/games/api/' + name).then(function (response) {
          // // console.log('response from api: ', response);
          if (response.data == false) {
            userObject.loading = false;
          } else {
            userObject.loading = false;
            userObject.results = response.data;
          }
        });
      }, 1500);
    },

    selectGame: function (target) {
      $http.post('/games/hours/' + target.name).then(function (res) {
        userObject.selectedGame = [target];
        userObject.results = [];
        userObject.selectedGame[0].time = Math.floor(res.data[0].gameplayMain);
        if (userObject.selectedGame[0].hasOwnProperty('release_dates') == false) {
          userObject.selectedGame[0].release_dates.human = '2017';
        }
        // // console.log('selected this one: ', userObject.selectedGame);
      });
    },

    editGame: function (target) {
      userObject.editGame = [target];
      userObject.games = [];
      // // console.log('editing this one: ', userObject.editGame);
    },

    updateGame: function (target) {
      if (target.nowplaying == null) {
        target.nowplaying = false;
      }
      if (target.progress == target.timetobeat) {
        target.completed = true;
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
      // // console.log(userObject.updateGm);
      $http.put('/games/', userObject.updateGm).then(function (response) {}).then(getgames());
    },

    calcPercent: function (target) {
      var width = parseInt(((target.progress / target.timetobeat) * 100).toFixed(0));
      // // console.log('width:', width);
      if (width > 100) {
        width = 100;
        // // console.log('width adj:', width);

      }
      var strCss = '{"width":' + width + '%}';
      // // console.log(strCss);


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
        timetobeat: userObject.selectedGame[0].time,
        nowplaying: userObject.selectedGame[0].nowplaying,
        completed: false,
        progress: userObject.selectedGame[0].progress
      };

      if (userObject.gameObj.nowplaying == null) {
        userObject.gameObj.nowplaying = false;
      }

      if (userObject.gameObj.progress == null) {
        userObject.gameObj.progress = 0;
      }

      if (userObject.gameObj.progress == userObject.gameObj.timetobeat) {
        userObject.gameObj.completed = true;
      }

      // // console.log('output:', userObject.gameObj);

      $http.post('/games/', userObject.gameObj).then(function (response) {}).then(function () {
        userObject.selectedGame = [];
        userObject.nowplaying = [];
        userObject.hoursIn = [];
        $location.path("/user");
      });
    },

    highlight: function (target) {
      if (target) {
        return {
          opacity: '.5'
        };
      } else {
        return {
          opacity: '1'
        };
      }
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