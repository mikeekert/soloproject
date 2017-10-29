myApp.controller('AddController', function (UserService) {
  console.log('AddController created');
  var vm = this;

  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  console.log(vm.userObject);
  vm.userObject.selectedGame = [];
});