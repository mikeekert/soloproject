myApp.controller('LoginController', function($http, $location, UserService) {
    const vm = this;

    vm.userService = UserService;
    vm.userObject = UserService.userObject;
  

    vm.user = {
      username: '',
      password: ''
    };
    vm.message = '';

    vm.alpha = ('abcdefghijklmnopqrstuvwxyz').split('');
    vm.alpha.push('del');

    vm.userService.letter = function(letter){
      if (vm.user.username.length < 10 || letter === 'del') {
        if (letter === 'del') {
          vm.user.username = vm.user.username.slice(0, -1);
          return;
        }
        vm.user.username = vm.user.username + letter;
      }
    };

    vm.login = function() {
      if(vm.user.username === '' || vm.user.password === '') {
        vm.message = "Enter your username and password!";
      } else {
        $http.post('/', vm.user).then(function(response) {
          if(response.data.username) {
            // location works with SPA (ng-route)
            vm.userObject.games = [];
            vm.userObject.results = [];          
            $location.path('/user'); // http://localhost:5000/#/user
          } else {
            
          }
        }).catch(function(){
          vm.message = "Wrong username or password";
        });
      }
    };

    vm.registerUser = function() {
      if(vm.user.username === '' || vm.user.password === '') {
        vm.message = "Choose a username and password!";
      } else {
        // // console.log('LoginController -- registerUser -- sending to server...', vm.user);
        $http.post('/register', vm.user).then(function() {
          // // console.log('LoginController -- registerUser -- success');
          $location.path('/home');
        }).catch(function() {
          // // console.log('LoginController -- registerUser -- error');
          vm.message = "Please try again.";
        });
      }
    };
});
