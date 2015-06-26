'use strict';
define([
    'angular',
    'angularRoute',
    'bitcoinutils/apiservice'
], function(angular) {

angular.module('myApp.txtree', ['ngRoute', 'apiservice'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/txtree', {
            templateUrl: 'txtree/txtree.html',
            controller: 'TxTreeCtrl'
        });
    }])
    .controller('TxTreeCtrl', [ '$http', '$routeParams', 'bitcoinapi', function($http, $routeParams, bitcoinapi){
        //Receive the block hash in the route parameters
        this.rootTransactionId = $routeParams.txid;

        var treeCtrl = this;

        //To be called when the user clicks a node in the directive/svg
        this.handleClick = function (clickedNode) {

            //Check that transaction is spent
            if ( clickedNode.redeemed_tx )
            {
                var child_txId = clickedNode.redeemed_tx[0];
                //Remove the array to prevent launching the task twice
                delete clickedNode.redeemed_tx;

                //Fetch the new branch of the tree
                bitcoinapi.getTree(child_txId).then(function (data) {
                    //Ensure node is setup with a child array
                    if ( !clickedNode.children )
                        clickedNode.children = [];

                    //The API has returned an object with an array of nodes, we want to add that node array to the clicked node
                    clickedNode.children = clickedNode.children.concat(data.children);
                });
            }
        };

        //Fetch the initial tree from the transaction id passed into this page
        bitcoinapi.getTree(this.rootTransactionId).then(function(data)
        {
            treeCtrl.treedata = data;
        });
    }])

    .directive("transactionTree", function () {
        var margin = {top: 20, right: 20, bottom: 20, left: 120},
            width = 1650 - margin.right - margin.left,
            height = 780 - margin.top - margin.bottom;

        return {
            restrict: 'E',
            scope: {
                treedata: '=',
                confirmAction: '&'
            },
            link: function (scope, element, attrs) {

                var i = 0,
                    duration = 750,
                    root;

                var tree = d3.layout.tree().size([height, width]);

                var diagonal = d3.svg.diagonal()
                    .projection(function(d) { return [d.y, d.x]; });

                var svg = d3.select("transaction-tree").append("svg")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                //Return a count of nodes in the tree in order to detect changes in the watcher
                function watchNode(){
                    //Count all child nodes
                    function countNodes(node)
                    {
                        if ( !node.children )
                        {
                            return 1;
                        }

                        var ret = 1;

                        for ( var i = 0; i < node.children.length; ++i )
                        {
                            ret = ret + countNodes(node.children[i]);
                        }

                        return ret;
                    }

                    if ( scope.treedata ) {
                        //Crawl the tree and return a count of the total number of nodes
                        var totNodes = countNodes(scope.treedata);
                        return totNodes;
                    }
                    return 0;
                }

                //Setup a watcher for changes to the tree. Uses our own change function because of the complexity in a tree
                scope.$watch(watchNode, function(newVal, oldVal){

                    if ( !newVal )
                        return;

                    root = scope.treedata;
                    root.x0 = height / 2;
                    root.y0 = 0;

                    update(root);

                    d3.select(self.frameElement).style("height", "500px");

                    function update(source) {
                        var rawNodes = tree.nodes(root);

                        // Compute the new tree layout.
                        var nodes = tree.nodes(root).reverse(),
                            links = tree.links(nodes);

                        // Normalize for fixed-depth.
                        nodes.forEach(function(d) { d.y = d.depth * 180; });

                        // Update the nodes…
                        var node = svg.selectAll("g.node")
                            .data(nodes, function(d) { return d.id || (d.id = ++i); });

                        // Enter any new nodes at the parent's previous position.
                        var nodeEnter = node.enter().append("g")
                            .attr("class", "node")
                            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                            .on("click", click);

                        nodeEnter.append("circle")
                            .attr("r", 1e-6)
                            .style("fill", function(d)
                                            {
                                                if (d.redeemed_tx)
                                                    return "#FFF";
                                                else
                                                    return "#CCC";
                                            });

                        nodeEnter.append("text")
                            .attr("fill", "green")
                            .attr("y", function(d) { return 24; })
                            .attr("dy", ".35em")
                            .attr("text-anchor", function(d) { return "middle"; })
                            .text(function(d) { return /*d.name + */"(" + d.value + " BTC)"; })
                            .style("fill-opacity", 1e-6);

                        // Transition nodes to their new position.
                        var nodeUpdate = node.transition()
                            .duration(duration)
                            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                        nodeUpdate.select("circle")
                            .attr("r", 10)
                            .style("fill", function(d)
                                            {
                                                if (d.redeemed_tx)
                                                    return "#FFF";
                                                else
                                                    return "#CCC";
                                            });

                        nodeUpdate.select("text")
                            .style("fill-opacity", 1);

                        // Transition exiting nodes to the parent's new position.
                        var nodeExit = node.exit().transition()
                            .duration(duration)
                            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                            .remove();

                        nodeExit.select("circle")
                            .attr("r", 1e-6);

                        nodeExit.select("text")
                            .style("fill-opacity", 1e-6);

                        // Update the links…
                        var link = svg.selectAll("path.link")
                            .data(links, function(d) { return d.target.id; });

                        // Enter any new links at the parent's previous position.
                        link.enter().insert("path", "g")
                            .attr("class", "link")
                            .attr("d", function(d) {
                                var o = {x: source.x0, y: source.y0};
                                return diagonal({source: o, target: o});
                            });

                        // Transition links to their new position.
                        link.transition()
                            .duration(duration)
                            .attr("d", diagonal);

                        // Transition exiting nodes to the parent's new position.
                        link.exit().transition()
                            .duration(duration)
                            .attr("d", function(d) {
                                var o = {x: source.x, y: source.y};
                                return diagonal({source: o, target: o});
                            })
                            .remove();

                        // Stash the old positions for transition.
                        nodes.forEach(function(d) {
                            d.x0 = d.x;
                            d.y0 = d.y;
                        });
                    }

                    // Toggle children on click.
                    function click(d) {
                        scope.$apply(scope.confirmAction({"item": d}));
                    }
                });
            }
        }
    });
});

