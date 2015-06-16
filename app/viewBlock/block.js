'use strict'

angular.module('myApp.viewBlock', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/viewBlock', {
        templateUrl: 'viewBlock/block.html',
        controller: 'ViewBlockCtrl'
        });
    }])
    .controller('ViewBlockCtrl', [ '$http', '$routeParams', function($http, $routeParams){
        //Receive the block hash in the route parameters
        this.blockHash = $routeParams.blockId;
        this.totalBTC = 0;

        var container = this;
        var blockData = {};

        //Add to the end of api calls to identify ourself
        var apiKeyAppend = "";

        $http.get('api_alternate/rawblock/' + $routeParams.blockId + apiKeyAppend).success(function(block_data_result){
            container.blockData = block_data_result;
            container.transactions = block_data_result.tx;

            //Sum up the total BTC from each transaction element to get the total BTC value for this block
            container.totalBTC = 0;
            for ( var t = 0; t < container.transactions.length; ++t )
            {
                container.totalBTC += container.getTotalOut(container.transactions[t]);
            }
        });

        //Function to calculate the total out value BTC for a transaction
        this.getTotalOut = function(transactionRow){
            var totRet = 0.0;

            //Sum up the value of each out item
            for ( var i = 0; i < transactionRow.out.length; ++i )
            {
                totRet += transactionRow.out[i].value;
            }

            return totRet;
        };
    }
    ]
);