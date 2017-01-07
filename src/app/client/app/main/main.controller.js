'use strict';

angular.module('dnftestApp')
  .controller('MainCtrl', function ($scope, $state, $location, $anchorScroll) {
    $('.ui.dropdown')
      .dropdown({
        onChange: function (result, response) {
          $state.go('exemplar', {id: response});
        }
      });

    $scope.showHelp = false;

    $scope.help = function () {
      $scope.showHelp = true;
    };

    $scope.scrollTo = function(section) {
      // $location.hash(section);
      $anchorScroll(section);

        // $('html, body').stop().animate({
        //   scrollTop: ($(section).offset().top - 50)
        // }, 1250, 'easeInOutExpo');
        // event.preventDefault();

    };

    //Remove tool bar
    $("div.ui-cytoscape-toolbar").remove();

  });

//This is for prefetching the json and act like a database.
angular.module('dnftestApp').service('JsonData', ['$q','Restangular', function($q,Restangular) {
    var networkData = {};
    var nodes = {};
    var clusters = {};
    var exemplarData = {};

    var getJson = function (networkId){
      var deferred = $q.defer();
      var urlCalls = [];
      if (!(networkId in networkData)){
        urlCalls.push(Restangular.all('api/things/drug_network/').get(networkId).then(function (data) {
          networkData[networkId] = JSON.parse(data).element;
          console.log("wtf")
        }));
      }
      if (!(networkId in clusters)){
        urlCalls.push(Restangular.all('api/things/drug_clusters/').get(networkId).then(function (data) {
          clusters[networkId] = JSON.parse(data).element;
        }));      
      }
      if (!(networkId in exemplarData)){
        urlCalls.push(Restangular.all('api/things/exemplar/').get(networkId).then(function (data) {
          exemplarData[networkId] = JSON.parse(data).elements;
        }));
      }
      if (!(networkId in nodes)){
        urlCalls.push(Restangular.all('api/things/drug_list/').get(networkId).then(function (data){
          nodes[networkId] = JSON.parse(data).data;
        }));
      }
      $q.all(urlCalls)
      .then(function(results) {
            deferred.resolve({
              'networkData':networkData[networkId],
              'nodes':nodes[networkId],
              'clusters':clusters[networkId],
              'exemplarData':exemplarData[networkId]
            }) 
          });
      return deferred.promise;
    }
    return {
      getJson:getJson
    };

}]);

//This service is for handling ui changes
angular.module('dnftestApp').service('UIChange', function($sce,Restangular){
  var search = function ($scope, $state, $stateParams ,node) {
      if ($scope.state == "Exemplar") {
        $state.go('cluster',{id:$stateParams.id,clusterId:node});
      }
      else {
        highlightNode($scope, $state, $stateParams, node);
      }
    };
  var goExemplar = function($scope, $state, $stateParams){
      $state.go('exemplar', {id:$stateParams.id});
  };
  var goNetwork = function($scope, $state, $stateParams){
      $state.go('network', {id:$stateParams.id})
  };
  var download = function ($scope, $state, $stateParams) {
      var downloadLink = angular.element('<a></a>');
      downloadLink.attr('href', $scope.cy.png());
      downloadLink.attr('download', $stateParams.id);
      downloadLink[0].click();
  };
  var hideToolbar = function ($scope, $state, $stateParams) {
      $("div.ui-cytoscape-toolbar").hide();
  };
  var showToolbar = function ($scope, $state, $stateParams) {
    $("div.ui-cytoscape-toolbar").remove();
    $scope.cy.toolbar({position: 'right'});
    $("div.ui-cytoscape-toolbar").show();
  };

  var help = function ($scope, $state, $stateParams) {
      hideToolbar();
      $state.go('documentation');
  };

  var back = function ($scope, $state, $stateParams) {
      hideToolbar();
      $state.go("main");
  }
      //Show score break down
  var showScoreBreakdown = function ($scope, $state, $stateParams,edge) {
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

  var showPubChem = function ($scope, $state, $stateParams,node) {
    function findSection(json, sec) {
      for (var i = 0; i < json.length; i++) {
        if (json[i]['TOCHeading'].startsWith(sec)) {
          return json[i];
        }
      }
    }
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

  var highlightNode = function ($scope, $state, $stateParams,nodeName) {
    $scope.showInfo = false;
    $scope.showChart = false;
    $scope.showHelp = false;

    $scope.cy.nodes("#" + nodeName).animate(
    {
      css: { 'background-color': 'lightgreen' }
    })
    .delay( 500 )
    .animate(
    {
      css: { 'background-color': 'yellow' }
    })
    .delay( 500 )
    .animate(
    {
      css: { 'background-color': 'lightgreen' }
    })

    var pos = $scope.cy.nodes("#" + nodeName).position();
    $scope.cy.zoom({
      level: 2.0,
      position: pos
    });
  }

  return {
      search:search,
      goExemplar:goExemplar,
      goNetwork:goNetwork,
      download:download,
      hideToolbar:hideToolbar,
      showToolbar:showToolbar,
      back:back,
      help:help,
      showScoreBreakdown:showScoreBreakdown,
      showPubChem:showPubChem,
      highlightNode:highlightNode
  };

})