'use strict';

angular.module('myApp.viewMaster', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/viewMaster', {
            templateUrl: 'viewMaster/master.html',
            controller: 'ViewMasterCtrl'
        });
    }])

    .controller('ViewMasterCtrl', [ '$http', function($http){
        var master = this;
        master.latestHash = "";
        master.rawObjects = [];

        //Add to the end of api calls to identify ourself
        var apiKeyAppend = "";

        // Get the hash for the latest block
        $http.get('api_alternate/latestblock' + apiKeyAppend).success(function(data){
            master.loadPrevious = function () {
                var currentHead = master.rawObjects[master.rawObjects.length-1];

                master.rawObjects = [];
                getBlockFromHash(currentHead.hash);
            };

            //Log the latest hash and its index
            master.latestHash = data.hash;

            var getBlockFromHash = function(hash_to_get)
            {
                $http.get('api_alternate/rawblock/' + hash_to_get  + apiKeyAppend).success(function(block_data){
                    master.rawObjects.push(block_data);

                    //Change the number here to determine how many blocks are displayed
                    if ( master.rawObjects.length < 3 )
                    {
                        getBlockFromHash(block_data.prev_block);
                    }
                });
            };

            master.rawObjects = [];
            getBlockFromHash(master.latestHash);
        });
    }
    ]
);