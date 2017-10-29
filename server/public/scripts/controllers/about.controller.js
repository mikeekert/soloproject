myApp
    .controller('AboutController', function ($http, $location, UserService, $scope) {
        var vm = this;
        vm.userService = UserService;
        vm.userObject = UserService.userObject;
        vm.sequence = [];
        vm.konamiStatus=false;
        vm.mainLoad=true;

        console.log(vm.konami);

        vm.konami = function () {
            console.log('konami loaded');
            cheet('↑ ↑ ↓ ↓ ← → ← → b a', {
                next: function (str, key, num, seq) {
                    vm
                        .sequence
                        .push(seq[num]);
                    console.log('userObject.sequence:', vm.sequence);
                    $scope.$apply();
                },
                fail: function () {
                    console.log('sequence failed');
                    vm.sequence = [];
                    $scope.$apply();

                },
                done: function () {
                    console.log('+30 lives ;)');

                    vm.playAudio = function() {
                        console.log('audio!');
                        var audio = new Audio('assets/secret.mp3');
                        audio.play();
                    };
                    vm.playAudio();
                    $scope.$apply();                    
                    setTimeout(function () {
                        vm.loading=true;   
                        vm.mainLoad=false;                     
                        $scope.$apply();
                        setTimeout(function() {
                            vm.loading=false;
                            vm.konamiStatus=true;
                            $scope.$apply(); 
                            setTimeout(function() {
                                vm.playAudio = function() {
                                    console.log('audio!');
                                    var audio = new Audio('assets/game-over.mp3');
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