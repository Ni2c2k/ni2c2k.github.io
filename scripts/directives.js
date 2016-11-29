angular.module('skinulisApp')
  .directive('focusOn', function(){
    return function(scope, elem, attr){
      scope.$on('focusOn', function(e,name){
        console.log('on focus');
        if(name === attr.focusOn){
          elem[0].focus();
        }
      });
    };
  });
