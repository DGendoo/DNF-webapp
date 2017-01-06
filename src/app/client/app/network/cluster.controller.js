'use strict';

angular.module('dnftestApp')
	.controller('ClusterCtrl', function ($scope, $state, $sce, $stateParams, Restangular, JsonData, UIChange) {
    /*
      Init scope data
      */
    //The network id
    $scope.networkToShow = $stateParams.id;
    //Showing stuff
    $scope.showInfo = false;
    $scope.showHelp = false;
    $scope.showChart = false;
    //Selecting stuff
    $scope.selectedNode = false;
    $scope.selectedEdge = false;
    //We actually don't need this
    //TO-DELETE
    $scope.state = 'Cluster';

    //All the data
    $scope.nodes = null;
    $scope.exemplarData = null;
    $scope.networkData = null;
    $scope.clusters = null;

    //Cy container
    $scope.cy = null;

    /*
      UI related
      */
    //Search button
    $scope.search = function (node) {
      UIChange.search($scope, $state, $stateParams, node)
    };
    //To Exemplar
    $scope.goExemplar = function(){
      UIChange.goExemplar($scope, $state, $stateParams);
    }
    $scope.goNetwork = function(){
      UIChange.goNetwork($scope, $state, $stateParams);
    }
    //Download button
    $scope.download = function () {
      UIChange.download($scope, $state, $stateParams);
    };
    //Home page button
    $scope.back = function () {
      UIChange.back($scope, $state, $stateParams);
    }
    //Help button
    //Help button
    $scope.help = function () {
      UIChange.help($scope, $state, $stateParams);
    };

    var getClusterNum = function (node) {
      for (var i = 0; i < $scope.networkData.nodes.length; i++) {
        var obj = $scope.networkData.nodes[i].data;
        if (obj.id == node) {
          return (obj.cluster);
        }
      }
    };



    $scope.displayCluster = function (nodeName) {
      $scope.showInfo = false;
      $scope.showHelp = false;
      $scope.showChart = false;

      var clusterNum = getClusterNum(nodeName);

      //Makes a new instance of cy based on the group of nodes given
      $scope.cy = cytoscape({
        container: document.getElementById('cy'),
        elements: $scope.clusters[clusterNum],
        //autolock: true,
        layout: {
          name: 'cose',
          idealEdgeLength: function (edge) {
            for (var i = 0; i < $scope.networkData.edges.length; i++) {
              var curEdge = $scope.networkData.edges[i].data;
              if (edge._private.data.source == curEdge.source && edge._private.data.target == curEdge.target) {
                return 1 / curEdge.weight;
              }
            }
          }
        },
        zoom: 1,
        maxZoom: 5,
        minZoom: 0.3,
        style: [
          {
            selector: 'node',
            style: {
              'content': 'data(id)',
              'background-fit': 'cover',
              'background-color': 'data(colo)',
              'color': 'white'
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': 'lightgrey'
              // 'line-color': 'mapData(weight,' + $scope.minWeight.toString() + ' ,' + $scope.maxWeight.toString() + ', white, black)',
            }
          }
        ]
      });

      $scope.cy.on('tap', 'node', function (evt) {
        $scope.showChart = false;
        UIChange.showPubChem($scope,$state,$stateParams,evt.cyTarget);
      });

      $scope.cy.on('tap', 'edge', function (evt) {
        $scope.showChart = true;
        $scope.showInfo = false;
        UIChange.showScoreBreakdown($scope,$state,$stateParams,evt.cyTarget);
        $scope.$apply();
        // showScoreBreakDown(evt.cyTarget);
        //  $scope.selected = evt.cyTarget.id();
        //  $scope.cy.zoom(0.5);
        // $scope.cy.center('#' + evt.cyTarget.id());
      });
      UIChange.showToolbar($scope,$state,$stateParams);
    };

    JsonData.getJson($stateParams.id).then(function(result){
      $scope.clusters = result.clusters;
      $scope.networkData = result.networkData;
      $scope.exemplarData = result.exemplarData;
      $scope.nodes = result.nodes;
      $scope.displayCluster($stateParams.clusterId);
      $('.ui.search')
          .search({
            source: $scope.nodes,
            searchFields: [
              'title'
            ],
            searchFullText: false,
            onSelect: function (result, response) {
              $scope.search(result.title);
            }
      });
    });

});
