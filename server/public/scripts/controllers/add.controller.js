myApp.controller('AddController', function (UserService) {
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.userObject.selectedGame = [];
});