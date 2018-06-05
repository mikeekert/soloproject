myApp
    .controller('UserController', function (UserService) {
        const vm = this;
        vm.userService = UserService;
        vm.userObject = UserService.userObject;
        vm.Math = window.Math;

        vm
            .userService
            .getgames();

        vm.inProgress = function (filter) {
            return filter.nowplaying === false || filter.completed === false;
        };

    });
