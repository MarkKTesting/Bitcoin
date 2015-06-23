'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.searchbox',
  'myApp.viewMaster',
  'myApp.viewBlock',
  'myApp.txtree',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewBlock/:blockId', {
    templateUrl: 'viewBlock/block.html',
    controller: 'ViewBlockCtrl',
    controllerAs: 'block'
  })
  .when('/txtree/:txid', {
    templateUrl: 'txtree/txtree.html',
    controller: 'TxTreeCtrl',
    controllerAs: 'block'
  })

  .otherwise( {redirectTo: '/viewMaster'} );
}]);
