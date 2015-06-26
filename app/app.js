'use strict';

define([
	'angular',
	'angularRoute',
	'bitcoinutils/apiservice',
	'bitcoinutils/filters',
	'bitcoinutils/searchbox',
	'viewMaster/master',
	'viewBlock/block',
	'txtree/txtree'
], function(angular) {
	// Declare app level module which depends on views, and components
	return angular.module('myApp', [
		'ngRoute',
		'myApp.viewMaster',
		'myApp.viewBlock',
		'myApp.txtree',
		'bitcoinFilters',
		'myApp.searchbox'
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
});

