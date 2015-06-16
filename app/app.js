'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.viewMaster',
  'myApp.viewBlock',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/viewBlock/:blockId', {
    templateUrl: 'viewBlock/block.html',
    controller: 'ViewBlockCtrl',
    controllerAs: 'block'
  })
  .otherwise( {redirectTo: '/viewMaster'} )

  //$routeProvider.otherwise({redirectTo: '/viewMaster'});
}]);
