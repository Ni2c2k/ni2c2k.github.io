
angular.module('skinulisApp', ['ngRoute'])
  .config(function($routeProvider){
    $routeProvider.when('/view/:billId', {
      controller: 'ViewController as viewCtrl',
      templateUrl: 'views/view.html'
    })
    .when('/create',{
      controller: 'CreatingController as ctrl',
      templateUrl: 'views/create.html'
    });
    $routeProvider.otherwise({
      redirectTo: '/create'
    });
  });
