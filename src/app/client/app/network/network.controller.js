'use strict';

angular.module('dnftestApp')
  .controller('NetworkCtrl', function ($scope, $state, $sce, $http, $stateParams, Restangular) {
    $scope.selected = null;
    $scope.showOptions = false;
    $scope.dest = null;
    $scope.nodeToSearch = null;
    $scope.image = null;
    $scope.networkToShow = $stateParams.id;
    $scope.exemplarData = null;
    $scope.showInfo = false;
    $scope.selectedNode = false;
    $scope.selectedEdge = false;
    $scope.showHelp = false;
    $scope.showChart = false;
    $scope.state = 'Exemplar';

    $scope.networkData = null;
    //the max/min weight of normal graph edges
    $scope.maxWeight = 0;
    $scope.minWeight = 0;
    //the max/min weight of exemplar graph edges
    $scope.exemplarMaxWeight = 0;
    $scope.exemplarMinWeight = 0;


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

    $scope.back = function () {
      hideToolbar();
      // window.history.back();
      $state.go("main");
    }



    //This function gets the data--i.e. the nodes and the edges
    var getNetworkData = function () {
      Restangular.all('api/things/drug_network/').get($stateParams.id).then(function (data) {
        $scope.networkData = JSON.parse(data).element;
        var maxWeight = 0;
        var minWeight = 9999999;
        for (var i = 0; i < $scope.networkData.edges.length; i++) {
          var edge = $scope.networkData.edges[i]
          if (edge.data.weight > maxWeight) {
            maxWeight = edge.data.weight;
          }
          if (edge.data.weight < minWeight) {
            minWeight = edge.data.weight;
          }
        }
        $scope.maxWeight = maxWeight;
        $scope.minWeight = minWeight;
        // $scope.display();
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
        var maxWeight = 0;
        var minWeight = 9999999;
        for (var i = 0; i < $scope.exemplarData.edges.length; i++) {
          var edge = $scope.exemplarData.edges[i];
          if (edge.data.weight > maxWeight) {
            maxWeight = edge.data.weight;
          }
          if (edge.data.weight < minWeight) {
            minWeight = edge.data.weight;
          }
        }
        $scope.exemplarMaxWeight = maxWeight;
        $scope.exemplarMinWeight = minWeight;
        console.log('here');
        $scope.displayExemplar();
      });
    };


    $scope.displayExemplar = function () {
      $scope.state = 'Exemplar';
      $scope.showInfo = false;
      $scope.showChart = false;
      $scope.showHelp = false;

      $scope.cy = cytoscape({
        container: document.getElementById('cy'),
        elements: $scope.exemplarData,
        autolock: false, //worth looking into later
        autoungrabify: false,
        layout: {
          name: 'preset'
        },
        zoom: 0.3,
        style: [
          {
            selector: 'node',
            style: {
              'content': 'data(id)',
              'background-fit': 'cover',
              'background-color': 'data(colo)'
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': '#565656'
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
        showScoreBreakdown(evt.cyTarget);
        $scope.$apply();

        // showScoreBreakDown(evt.cyTarget);
        //  $scope.selected = evt.cyTarget.id();
        //  $scope.cy.zoom(0.5);
        // $scope.cy.center('#' + evt.cyTarget.id());
      });
      showToolbar();
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

    $scope.help = function () {
      $scope.showHelp = true;
      $scope.state = 'Help';
      $scope.showInfo = false;
      $scope.showChart = false;
      $scope.cy = null;

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
        data: {
          labels: ["Perturbation", "Sensitivity", "Structure"],
          datasets: [{
            data: [edge._private.data['perturbation'], edge._private.data['physical structure'], edge._private.data['sensitivity']],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
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
      hideToolbar();
      $scope.cy.toolbar({position: 'right'});
    };

    var hideToolbar = function () {
      $("div.ui-cytoscape-toolbar").remove();
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
              'background-color': 'data(colo)'
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': '#565656'
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

    $scope.display = function () {
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
              'background-color': 'data(colo)'
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': '#565656'
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
        showScoreBreakdown(evt.cyTarget);
        $scope.$apply();

        // showScoreBreakDown(evt.cyTarget);
        //  $scope.selected = evt.cyTarget.id();
        //  $scope.cy.zoom(0.5);
        // $scope.cy.center('#' + evt.cyTarget.id());
      });
      showToolbar();
    };


    $('.ui.dropdown')
      .dropdown()
    ;

    /// run this code when controller load
    getCluster();
    getNetworkData();
    populateDrugList();
    getExemplar();


    $(document).ready(function() {

      if (window.history && window.history.pushState) {

        $(window).on('popstate', function() {
          //confirmation box
          confirm('Are you sure?');
        });
      }
    });

  });
