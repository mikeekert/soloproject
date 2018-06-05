myApp.controller('AddController', function (UserService) {
    const vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    vm.userObject.selectedGame = [];
});