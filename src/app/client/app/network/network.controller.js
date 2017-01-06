'use strict';

angular.module('dnftestApp')
  .controller('NetworkCtrl', function ($scope, $state, $sce, $stateParams, Restangular,JsonData, UIChange) {
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
    $scope.state = 'Network';

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
    $scope.help = function () {
      UIChange.help($scope, $state, $stateParams);
    };

    //Display the graph
    $scope.display = function () {

      $('#network').addClass('active');
      $('#exemplar').removeClass('active');

      $scope.state = 'Full Network';
      $scope.showInfo = false;
      $scope.showChart = false;
      $scope.showHelp = false;

      $scope.cy = cytoscape({
        container: document.getElementById('cy'),
        elements: $scope.networkData,
        autolock: false, //worth looking into later
        autoungrabify: false,
        layout: {
          name: 'cose',
          idealEdgeLength: function (edge) {
            for (var i = 0; i < $scope.networkData.edges.length; i++) {
              var curEdge = $scope.networkData.edges[i].data;
              if (edge._private.data.source == curEdge.source && edge._private.data.target == curEdge.target) {
                return 1 / curEdge.weight;
              }
              ;
            }
            ;
          }
        },
        zoom: 0.3,
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
            }
          }
        ]
      });

      $scope.cy.maxZoom(5);
      $scope.cy.minZoom(0.3);
      $scope.cy.on('tap', 'node', function (evt) {
        $state.go('cluster',{id:$stateParams.id,clusterId:evt.cyTarget.id()});
      });

      $scope.cy.on('tap', 'edge', function (evt) {
        $scope.showChart = true;
        $scope.showInfo = false;
        UIChange.showScoreBreakdown($scope, $state, $stateParams,evt.cyTarget);
        $scope.$apply();
      });
      UIChange.showToolbar($scope, $state, $stateParams);
    };
    /*
      After download, do display
    */
    JsonData.getJson($stateParams.id).then(function(result){
      console.log(result)
      $scope.clusters = result.clusters;
      $scope.networkData = result.networkData;
      $scope.exemplarData = result.exemplarData;
      $scope.nodes = result.nodes;
      $scope.display();
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
