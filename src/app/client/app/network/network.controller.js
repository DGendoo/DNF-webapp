'use strict';

angular.module('dnftestApp')
  .controller('NetworkCtrl', function ($scope, $state,$http, $stateParams, Restangular) {
    $scope.selected = null;
    $scope.showOptions = false;
    $scope.dest = null;
    $scope.nodeToSearch = null;
    $scope.image = null;
    $scope.networkToShow = $stateParams.id;
    $scope.exemplarData = null;
    $scope.showInfo = false;
    $scope.selectedNode = false;
    $scope.showChart = false;

    $scope.networkData = null;
    //$scope.nodes = {title: 'hiiiiiiii'}; //seems to be extraneous leftover variable

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
      downloadLink.attr('download', $stateParams.id);
      downloadLink[0].click();
    };

    $scope.back = function(){
      $("div.ui-cytoscape-toolbar").remove();
      // window.history.back();
      $state.go("main");
    }

    //This function gets the data--i.e. the nodes and the edges
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

    var getExemplar = function () {
      Restangular.all('api/things/exemplar/').get($stateParams.id).then(function (data) {
        $scope.exemplarData = JSON.parse(data).elements;

        console.log('here');
      });
    };


    $scope.displayExemplar = function () {
      $scope.showInfo = false;
      $scope.showChart = false;

      $scope.cy = cytoscape({
        container: document.getElementById('cy'),
        elements: $scope.exemplarData,
        autolock: false, //worth looking into later
        autoungrabify: false,
        layout: {
           name: 'cose',
          idealEdgeLength: function (edge) {
            // for (var i = 0; i < $scope.networkData.edges.length; i++) {
            //   var curEdge = $scope.networkData.edges[i].data;
            //   if (edge._private.data.source == curEdge.source && edge._private.data.target == curEdge.target) {
            //     return curEdge.weight;
            //   };
            // };
            return 1/edge._private.data.weight;
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
              'shape' : 'octagon'
            }
          }
        ]
      });

      $scope.cy.on('tap', 'node', function (evt) {
        displayCluster(evt.cyTarget.id());
      });

      $scope.cy.on('tap', 'edge', function (evt) {
        $scope.showChart = true;
        $scope.showInfo = false;
        $scope.$apply();

        // showScoreBreakDown(evt.cyTarget);
        //  $scope.selected = evt.cyTarget.id();
        //  $scope.cy.zoom(0.5);
        // $scope.cy.center('#' + evt.cyTarget.id());
      });
    };

    var getCluster = function () {
      Restangular.all('api/things/drug_clusters/').get($stateParams.id).then(function (data) {
        $scope.clusters = JSON.parse(data).element;
      });
    };

    var getClusterNum = function (node) {
      for (var i = 0; i < $scope.networkData.nodes.length; i++) {
        var obj = $scope.networkData.nodes[i].data;
        if (obj.id == node) {
          return (obj.cluster);
        }
      }
    };

    // to fill in
    var showScoreBreakdown = function(edge) {

    };

    var showPubChem = function (node) {
      $scope.showInfo = true;
      $scope.selectedNode = {url: node._private.data.url || "Not found.", id: node._private.data.id};
      if ($scope.selectedNode.url == "null") {
        $scope.selectedNode.url = "Not found.";
      }

      $scope.$apply();
    };

    var displayCluster = function (nodeName) {
      $scope.showInfo = false;
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
                  return 1/curEdge.weight;
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
                'background-fit': 'cover',
                'background-color': 'data(colo)',
                'shape' : 'octagon'
              }
            }
          ]
        });

      $scope.cy.on('tap', 'node', function (evt) {
        $scope.showChart = false;
        showPubChem(evt.cyTarget);
      });

      $scope.cy.on('tap', 'edge', function (evt) {
        $scope.showChart = true;
        $scope.showInfo = false;
        $scope.$apply();
        // showScoreBreakDown(evt.cyTarget);
        //  $scope.selected = evt.cyTarget.id();
        //  $scope.cy.zoom(0.5);
        // $scope.cy.center('#' + evt.cyTarget.id());
      });

    };

    $scope.display = function () {
      $scope.showInfo = false;
      $scope.showChart = false;

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
                return 1/curEdge.weight;
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
              'background-fit': 'cover',
              'background-color': 'data(colo)',
              'shape' : 'octagon'
            }
          }
        ]
      });

     $scope.cy.maxZoom(5);
     $scope.cy.minZoom(0.3);
      $scope.cy.on('tap', 'node', function (evt) {

        displayCluster(evt.cyTarget.id());
      });

      $scope.cy.on('tap', 'edge', function (evt) {
        $scope.showChart = true;
        $scope.showInfo = false;
        $scope.$apply();

        // showScoreBreakDown(evt.cyTarget);
        //  $scope.selected = evt.cyTarget.id();
        //  $scope.cy.zoom(0.5);
        // $scope.cy.center('#' + evt.cyTarget.id());
      });
    };


    $('.ui.dropdown')
      .dropdown()
    ;

    /// run this code when controller load
    getCluster();
    getNetworkData();
    populateDrugList();
    getExemplar();
    $scope.display();
    //This enable the toolbar; 
    $("div.ui-cytoscape-toolbar").remove();
    $scope.cy.toolbar({position: 'right'});
    //cy.$('ABT737').lock();
  });
