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
    $scope.selectedEdge = false;
    $scope.showChart = false;

    $scope.networkData = null;
    var pData = null;
    
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
      hideToolbar();
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

    var showScoreBreakdown = function(edge) {   
      Restangular.all('api/things/scores').get($stateParams.id).then(function (data) {
          //pData = JSON.parse("[" + data + "]");
          pData = [data];
        });

      //INTERCORRELATION PLOT
        var testData = [
          {
            "name": "physical structure",
            "genes": {
              "GDC0879": {
                "GDC0879": 1.70349236536953,
                "PAC1": 0.098378713517361993,
                "BRDK33514849": 0.080471212162904898
              },
              "PAC1": {
                "GDC0879": 0.098378713517361993,
                "PAC1": 1.7005794382344899,
                "BRDK33514849": 0.070495638653992401
              }
            }
          },
          {
            "name": "perturbation",
            "genes": {
              "GDC0879": {
                "GDC0879": 1.7111234765543899,
                "PAC1": 0.058085421744542197,
                "BRDK33514849": 0.060223861111900902
              },
              "PAC1": {
                "GDC0879": 0.058085421744542197,
                "PAC1": 1.89719899517321,
                "BRDK33514849": 0.044262981948498897
              }
            }
          },
          {
            "name": "sensitivity",
            "genes": {
              "GDC0879": {
                "GDC0879": 1.5931273063764098,
                "PAC1": 0.038696891020244303,
                "BRDK33514849": 0.0895449098458794,
              },
              "PAC1": {
                "GDC0879": 0.038696891020244303,
                "PAC1": 1.9334633180409,
                "BRDK33514849": 0.056603802858537798
              }
            }
          }
        ];
        var i = 0;
        var sum = 0;
        var gene1 = 'GDC0879';
        var gene2 = 'PAC1';
        for (i = 0; i < 3; i++) {
            sum = sum + testData[i].genes[gene1][gene2];
        };
  
  
        var plots = [testData[0].genes[gene1][gene2] / sum, testData[1].genes[gene1][gene2] / sum, testData[2].genes[gene1][gene2] / sum];
        
        var newData = [
                        [testData[0].name, plots[0]], 
                        [testData[1].name, plots[1]],
                        [testData[2].name, plots[2]]
                      ];
     
        var margin = {top: 20, right: 30, bottom: 60, left: 60}
          , width = 400 - margin.left - margin.right //960
          , height = 300 - margin.top - margin.bottom; //500
      

        var x = d3.scale.ordinal()
          .domain([testData[0].name, testData[1].name, testData[2].name])
          .rangePoints([0, width]);

        // RECTANGLE FOR TESTING PURPOSES - uncomment code and move rectangle below the code
        // if rectangle does not show then problem
        //
        // var svg = d3.select("#piechart")
        //   .append("svg")
        //   .attr("width", 200)
        //   .attr("height", 200);

        // var rect = svg.append("rect")
        //   .attr("x", 10)
        //   .attr("y", 10)
        //   .attr("width", 50)
        //    .attr("height", 100);
        
       
        
        var y = d3.scale.linear()
                .domain([0, d3.max(newData, function(d) { return d[1]; })])
                .range([ height, 0 ]);
     
        var chart = d3.select('#scatter')
          .append('svg:svg')
          .attr('width', width + margin.right + margin.left)
          .attr('height', height + margin.top + margin.bottom)
          .attr('class', 'chart')

        var main = chart.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
          .attr('width', width)
          .attr('height', height)
          .attr('class', 'main')   
            
        // draw the x axis
        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');

        main.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'main axis date')
          .call(xAxis);

        // draw the y axis
        var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left');

        main.append('g')
          .attr('transform', 'translate(0,0)')
          .attr('class', 'main axis date')
          .call(yAxis);

        var g = main.append("svg:g"); 
        
        g.selectAll("scatter-dots")
          .data(newData)
          .enter().append("svg:circle")
              .attr("cx", function (d,i) { return x(d[0]); } )
              .attr("cy", function (d) { return y(d[1]); } )
              .attr("r", 8);

        //PIECHART

        var w = 500,                        
          h = 300,                            
          r = 80;                           
        var color = d3.scale.category20c(); 
          
        var vis = d3.select("#piechart")
        .append("center")
          .append("svg:svg")              
          .data([testData])     
              .attr("width", w)           
              .attr("height", h)
              .append("svg:g") // group
                  .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

        var arc = d3.svg.arc()              
            .outerRadius(r);
    
        var pie = d3.layout.pie() //arc data given list of values
          
            .value(function(d) { 
                return d.genes[gene1][gene2]; 
            }); //each value element in array
    
        var arcs = vis.selectAll("g.slice")
            .data(pie)                         
            .enter() // create <g> for every object in data
                .append("svg:g")
                  .attr("transform", "translate(" + 180 + "," + 50 + ")") // position pie chart
                    .attr("class", "slice");    //to style each slice
    
            arcs.append("svg:path")
                    .attr("fill", function(d, i) { return color(i); } ) //color for each slice 
                    .attr("d", arc); //svg arc
            
            //label
            arcs.append("svg:text")                                     
                    .attr("transform", function(d) {  //center
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    var _d = arc.centroid(d); // position outside of arc
                    _d[0] *= 3.0; //multiply by a constant factor
                    _d[1] *= 2.8; 
                    return "translate(" + _d + ")"; //return coordinates, arc.centroid(d) for inside
                })
                .attr("dx", "1em") // no attr for inside
                .attr("dy", "0em") //0em for inside
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(function(d, i) { 
                  return testData[i].name;  
                });  
            
            // //percentage
            // arcs.append("svg:text")                                     
            //     .attr("transform", function(d) {  //center
            //     d.innerRadius = 0;
            //     d.outerRadius = r;
            //     return "translate(" + arc.centroid(d) + ")"; //return coordinates
            //   })
            //   //.attr("dy", "1em") for inside
            // .attr("text-anchor", "middle")
            // .attr("fill", "white")
            // .text(function(d, i) { 
            //   return testData[i].genes[gene1][gene2] + "%"; 
            // });
        //end pie
          
        $scope.showChart = true;
        $scope.selectedEdge = {score: edge._private.data.weight.toFixed(2)};
        $scope.$apply();
      
        
    };

    var showToolbar = function (){
      //This enable the toolbar; 
      console.log("showingToolbar");
      hideToolbar();
      $scope.cy.toolbar({position: 'right'});
    }

    var hideToolbar = function (){
      $("div.ui-cytoscape-toolbar").remove();
    }

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
    // $scope.display();
    //cy.$('ABT737').lock();
  });
