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
      $scope.cy.zoom(0.5);
    };

    $scope.search = function (node) {
      displayCluster(node);
      //$scope.cy.center('#' + node);
      // $scope.cy.zoom(0.5);
      // $scope.cy.center('#' + node);
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
        $scope.display();
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

    var displayCluster = function (nodeName) {
      Restangular.all('api/things/drug_clusters/').get($stateParams.id).then(function (data) {
        $scope.clusters = JSON.parse(data).element;
        var getClusterNum = function (node) {
          for (var i = 0; i < $scope.networkData.nodes.length; i++) {
            var obj = $scope.networkData.nodes[i].data;
            if (obj.id == node) {
              return (obj.cluster);
            }
          };
        };
        var clusterNum = getClusterNum(nodeName);
        $scope.cy = cytoscape({
          container: document.getElementById('cy'),
          elements: $scope.clusters[clusterNum],
          layout: {
            name: 'cose',
            idealEdgeLength: function (edge) {
              for (var i = 0; i < $scope.networkData.edges.length; i++) {
                var curEdge = $scope.networkData.edges[i].data;
                if (edge._private.data.source == curEdge.source && edge._private.data.target == curEdge.target) {
                  return curEdge.weight;
                };
              };
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
                'background-fit': 'cover'
              }
            }
          ]
        });
      });

    };

    $scope.display = function () {
      $scope.cy = cytoscape({
        container: document.getElementById('cy'),
        elements: $scope.networkData,
        layout: {
          name: 'cose',
          idealEdgeLength: function (edge) {
            for (var i = 0; i < $scope.networkData.edges.length; i++) {
              var curEdge = $scope.networkData.edges[i].data;
              if (edge._private.data.source == curEdge.source && edge._private.data.target == curEdge.target) {
                return curEdge.weight;
              };
            };
          }
        },
        zoom: 0.3,
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

     $scope.cy.maxZoom(5);
     $scope.cy.minZoom(0.3);

      $scope.cy.on('tap', 'node', function (evt) {

        displayCluster(evt.cyTarget.id());
        //  $scope.selected = evt.cyTarget.id();
        //  $scope.cy.zoom(0.5);
        // $scope.cy.center('#' + evt.cyTarget.id());
      });

    };


    $('.ui.dropdown')
      .dropdown()
    ;

    /// run this code when controller load
    getNetworkData();
    populateDrugList();
    $scope.display();
  });
