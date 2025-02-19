/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

var request = require('request');
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var request = require('request');

exports.pubchem = function(req, res) {
    request('https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/' + req.params.id + '/JSON/',
    function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  });
};

exports.exemplar = function(req, res) {
  var url = '';
  if (req.params.id == 'CTRP') {
    url = 'http://individual.utoronto.ca/myricecrispi/exemplar_ctrp.json';
  } else {
    url = 'http://individual.utoronto.ca/myricecrispi/exemplar_nci60.json';
  }
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(body);
    }
  });
};


exports.drugList = function(req, res) {
  var url = '';
  if (req.params.id == 'CTRP') {
    url = 'http://individual.utoronto.ca/myricecrispi/ctrp.json';
  } else {
    url = 'http://individual.utoronto.ca/myricecrispi/nci60.json';
  }
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(body);
    }
  });
};


exports.drugNetwork = function(req, res) {
  var url = '';
  if (req.params.id == 'CTRP') {
    url = 'http://individual.utoronto.ca/myricecrispi/new.noting.dnf.ctrp.json';
  } else {
    url = 'http://individual.utoronto.ca/myricecrispi/new.noting.dnf.nci60.json';
  }
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(body);
    }
  });
};

//Drugs in their clusters
exports.drugClusters = function(req, res) {
  var url = '';
  if (req.params.id == 'CTRP') {
    url = 'http://individual.utoronto.ca/myricecrispi/cluster.as.key.dnf.ctrp.json';
  } else {
    url = 'http://individual.utoronto.ca/myricecrispi/cluster.as.key.dnf.nci60.json';
  }
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(body);
    }
  });
};


// Get list of things
exports.index = function(req, res) {
  res.json([
  {
  name : 'Development Tools',
  info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
  name : 'Server and Client integration',
  info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
  name : 'Smart Build System',
  info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
  name : 'Modular Structure',
  info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
  name : 'Optimized Build',
  info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
  name : 'Deployment Ready',
  info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  }
  ]);
};
