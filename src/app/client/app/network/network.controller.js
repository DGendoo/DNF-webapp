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
      hideToolbar();

      $state.go('documentation')

    };

    //Display the graph
    $scope.back = function () {
      $scope.showHelp = false;
      $("div.ui-cytoscape-toolbar").show();
    }

    var showScoreBreakdown = function (edge) {
      $scope.showChart = true;

      $scope.selectedEdge = {
        source: edge._private.data.source,
        target: edge._private.data.target
      };


      $('#pie').remove(); // this is my <canvas> element
      $('#chart').append('<canvas id="pie"</canvas>');

      var ctx = document.getElementById("pie");
      var myChart = new Chart(ctx, {
        type: 'doughnut',
        options: {
          legend: {
            labels: {fontColor: 'white'}
          }
        },
        data: {
          labels: ["Perturbation", "Sensitivity", "Structure"],
          datasets: [{
            data: [edge._private.data['perturbation'], edge._private.data['physical structure'], edge._private.data['sensitivity']],
            backgroundColor: [
              'rgba(255, 255, 255, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(170, 255, 219, 0.5)'
            ],
            borderColor: [
              'rgba(255, 255, 255,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(170, 255, 219, 1.0)'
            ],
            borderWidth: 1
          }]
        }
      });

      $scope.$apply();
    };

    var showToolbar = function () {
      //This enable the toolbar;
      console.log("showingToolbar");
      // hideToolbar();
      $scope.cy.toolbar({position: 'right'});
      $("div.ui-cytoscape-toolbar").show();
    };

    var hideToolbar = function () {
      $("div.ui-cytoscape-toolbar").hide();
    };

    function findSection(json, sec) {
      for (var i = 0; i < json.length; i++) {
        if (json[i]['TOCHeading'].startsWith(sec)) {
          return json[i];
        }
      }

    }

    var showPubChem = function (node) {
      $scope.showInfo = true;

      $scope.selectedNode = {};
      $scope.selectedNode.id = node._private.data.id;

      if (node._private.data.url === 'null') {
        $scope.selectedNode.found = false;
        $scope.selectedNode.url = "Not found.";

      } else {
        $scope.selectedNode.found = false;
        $scope.selectedNode.url = node._private.data.url;

        var c = $scope.selectedNode.url.lastIndexOf("/");
        var id = $scope.selectedNode.url.substring(c + 1, $scope.selectedNode.url.length - 1);
        var data = null;
        Restangular.all('api/things/pubchem/')
          .get(id).then(function (serverJson) {
          var sec = serverJson['Record']['Section'];
          $scope.selectedNode.found = true;
          var unsubscripted = findSection(sec, 'Names and Identifiers')['Section'][2]['Information'][0]['StringValue'];
          $scope.selectedNode.form = $sce.trustAsHtml(unsubscripted.replace(/(\d+)/g, "$1".sub()));
          $scope.selectedNode.names = findSection(sec, 'Names and Identifiers')['Section'][3]['Section'][0]['Information'][0]['StringValueList'];
          $scope.selectedNode.weight = findSection(sec, 'Chemical and Physical Properties')['Section'][0]['Section'][0]['Information'][0]['NumValue'];

        });
      }
      $scope.$apply();
    };



    var displayCluster = function (nodeName) {
      $scope.state = 'Cluster';
      $scope.$apply();
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
        showPubChem(evt.cyTarget);
      });

      $scope.cy.on('tap', 'edge', function (evt) {
        $scope.showChart = true;
        $scope.showInfo = false;
        showScoreBreakdown(evt.cyTarget);
        $scope.$apply();
        // showScoreBreakDown(evt.cyTarget);
        //  $scope.selected = evt.cyTarget.id();
        //  $scope.cy.zoom(0.5);
        // $scope.cy.center('#' + evt.cyTarget.id());
      });
      showToolbar();
    };

    var highlightNode = function (nodeName) {
      $scope.showInfo = false;
      $scope.showChart = false;
      $scope.showHelp = false;


    }

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
