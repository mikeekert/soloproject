myApp
    .controller('AboutController', function ($http, $location, UserService, $scope) {
        const vm = this;
        vm.userService = UserService;
        vm.userObject = UserService.userObject;
        vm.sequence = [];
        vm.konamiStatus = false;
        vm.mainLoad = true;

        vm.konami = function () {
            cheet('↑ ↑ ↓ ↓ ← → ← → b a', {
                next: function (str, key, num, seq) {
                    vm
                        .sequence
                        .push(seq[num]);
                    $scope.$apply();
                },
                fail: function () {
                    vm.sequence = [];
                    $scope.$apply();

                },
                done: function () {
                    vm.playAudio = function () {
                        const audio = new Audio('assets/secret.mp3');
                        audio.play();
                    };
                    vm.playAudio();
                    $scope.$apply();
                    setTimeout(function () {
                        vm.loading = true;
                        vm.mainLoad = false;
                        $scope.$apply();
                        setTimeout(function () {
                            vm.loading = false;
                            vm.konamiStatus = true;
                            $scope.$apply();
                            setTimeout(function () {
                                vm.playAudio = function () {
                                    const audio = new Audio('assets/game-over.mp3');
                                    audio.play();
                                };
                                vm.playAudio();
                            }, 500);
                        }, 2000);
                    }, 2000);

                }
            });
        };

        vm.konami();

    });