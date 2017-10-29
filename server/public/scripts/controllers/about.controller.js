myApp
    .controller('AboutController', function ($http, $location, UserService) {
        var vm = this;
        vm.userService = UserService;
        vm.userObject = UserService.userObject;        
    });