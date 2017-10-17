myApp.controller('UserController', function(UserService) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.Math = window.Math;

  vm.userService.getgames();
  console.log(vm.userObject);
  
vm.inProgress = function (filter) {
  return filter.nowplaying === false || filter.completed === false; 
};

});
