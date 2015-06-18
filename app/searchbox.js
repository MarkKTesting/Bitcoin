angular.module("myApp.searchbox", ['apiservice'])
    .controller('BitcoinSearchController', function($scope, $timeout, $location, bitcoinapi){
        $scope.$watch("searchText", function(searchText) {
            if (searchText) {
                $scope.citySearchResults = [];
                $scope.isSearching = true;
                $scope.hasFailed = false;

                bitcoinapi.doSearch(searchText).then(function () {
                    $scope.isSearching = false;
                    $location.path('viewBlock/' + '000000000000000007b230684d60ccd77e36f587692f53ba601fb21c53b5e688');
                }, function(errorMsg){
                    $scope.isSearching = false;
                    $scope.hasFailed = true;
                } );
            } else {
                $scope.isSearching = false;
                $scope.citySearchResults = [];
            }
        });
    })

    .directive('mySearchBox', function() {
        return {
            restrict: 'E',
            transclude: false,
            scope: {
                searchText: '=',
                isSearching: '=',
                hasFailed: '='
            },
            controller: function($scope) {
                $scope.localSearchText = '';
                $scope.clearSearch = function() {
                    $scope.searchText = "";
                    $scope.localSearchText = "";
                };
                $scope.doSearch = function() {
                    $scope.searchText = $scope.localSearchText;
                };
            },
            replace: true,
            template:
            '<form>' +
            '<div>' +
            '<input ng-model="localSearchText" type="text" /><button ng-click="doSearch()" class="btn btn-small" style="margin: 25px">Search</button>' +
            '</div>' +
            '<h6 ng-show="hasFailed">No results</h6>' +
            '<div ng-show="isSearching">' +
            '<img ng-show="isSearching" src="http://loadinggif.com/images/image-selection/3.gif" /> ' +
            'Searching&#8230;' +
            '</div>' +
            '</form>'
        };
    });
