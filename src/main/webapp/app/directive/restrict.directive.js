angular
    .module('sogo')
    .directive('restrict', ['$rootScope', function ($rootScope) {
        return{
            restrict: 'A',
            priority: 100000,
            scope: false,
            link: function(){
                // alert('ergo sum!');
            },
            compile:  function(element, attr, linker){
                var access = false;
                var user = $rootScope.currentUser;
                var roles = user.authorities;

                if(roles.includes("ROLE_ADMIN")){
                    roles = ["ROLE_ADMIN"];
                } else if(roles.includes("ROLE_SYSTEM_MANAGER")){
                    roles = ["ROLE_SYSTEM_MANAGER"];
                }

                var attributes = attr.access.split(" ");
                for(var i in attributes){
                    for(var role in roles){
                        if(roles[role] == attributes[i]){
                            // console.log(roles[role] + " == " + attributes[i]);
                            // console.log(element.innerHTML);
                            access = true;
                        }
                    }
                }

                if(!access){
                    element.children().remove();
                    element.remove();
                }
            }
        }
    }]);
