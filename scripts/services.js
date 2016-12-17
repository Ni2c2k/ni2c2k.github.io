angular.module('skinulisApp')
  .factory('focus', function($rootScope, $timeout){
    return function(name){
      $timeout(function(){
        $rootScope.$broadcast('focusOn', name);
      });
    };
  });