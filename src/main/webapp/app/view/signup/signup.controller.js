(function () {
    'use strict';

    angular
        .module('sogo')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['Auth'];

    function SignupController(Auth) {
        var vm = this;

        vm.account = {
            login: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            authorities: []
        };

        vm.signup = signup;
        vm.success = false;

        function signup() {
            Auth.register(vm.account)
            .then(function () {
                vm.success = true;
            }).catch(function (error) {
                vm.error = true;
            });
        }
    }
})();
