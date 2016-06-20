'use strict';

angular.module('dnftestApp')
  .controller('NetworkCtrl', function ($scope, $http, $stateParams, Restangular) {
    $scope.selected = null;
    $scope.showOptions = false;
    $scope.dest = null;
    $scope.nodeToSearch = null;
    $scope.image = null;
    $scope.networkToShow = 'CTRP';
    $scope.networkData = null;
    $scope.nodes = {title: 'hiiiiiiii'};


    $scope.cy = null;

    $scope.bringBack = function () {
      $scope.cy.reset();
    };

    $scope.search = function (node) {
      $scope.cy.zoom(0.5);
      $scope.cy.center('#' + node);
    };

    $scope.download = function () {
      var downloadLink = angular.element('<a></a>');
      downloadLink.attr('href', $scope.cy.png());
      downloadLink.attr('download', 'network.png');
      downloadLink[0].click();
    };

    var getNetworkData = function () {
      Restangular.all('api/things/drug_network/').get($stateParams.id).then(function (data) {
        $scope.networkData = JSON.parse(data).element;
        display();
      });
    };

    var populateDrugList = function () {
        Restangular.all('api/things/drug_list/').get($stateParams.id).then(function (data) {
          $scope.nodes = JSON.parse(data).data;
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
      };

    var displayCluster = function () {
      $scope.cy = cytoscape({
        container: document.getElementById('cy'),
        elements: {
        "nodes": [
          {
            "data": {
              "id": "n0"
            }
          },
          {
            "data": {
              "id": "n1"
            }
          }
        ],
          "edges": [
          {
            "data": {
              "source": "n0",
              "target": "n1",
              "weight": 0.1
            }
          }
        ]
      }
      ,
        layout: {
          name: 'cose',
          idealEdgeLength: function (edge) {
            for (var i = 0; i < $scope.networkData.edges.length; i++) {
              var curEdge = $scope.networkData.edges[i].data;
              if (edge._private.data.source == curEdge.source && edge._private.data.target == curEdge.target) {
                return curEdge.weight * 1000;
              };
            };
          }
        },
        zoom: 0.5
        ,
        style: [
          {
            selector: 'node',
            style: {
              'content': 'data(id)',
              'background-fit': 'cover'
            }
          }
        ]
      });
    };

    var display = function () {
      $scope.cy = cytoscape({
        container: document.getElementById('cy'),
        elements: $scope.networkData,
        layout: {
          name: 'cose',
          idealEdgeLength: function (edge) {
            for (var i = 0; i < $scope.networkData.edges.length; i++) {
              var curEdge = $scope.networkData.edges[i].data;
              if (edge._private.data.source == curEdge.source && edge._private.data.target == curEdge.target) {
                return curEdge.weight * 1000;
              };
            };
          }
        },
        zoom: 0.5
        ,
        style: [
          {
            selector: 'node',
            style: {
              'content': 'data(id)',
              'background-fit': 'cover'
            }
          }
        ]
      });


      $scope.cy.on('tap', 'node', function (evt) {

        // displayCluster();
        $scope.selected = evt.cyTarget.id();
        $scope.cy.zoom(0.5);
        $scope.cy.center('#' + evt.cyTarget.id());
      });
    };

    /// run this code when controller load
    getNetworkData();
    populateDrugList();
    // display();
  });
