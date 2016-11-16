'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/drug_list/:id', controller.drugList);
router.get('/drug_network/:id', controller.drugNetwork);
router.get('/drug_clusters/:id', controller.drugClusters);
router.get('/exemplar/:id', controller.exemplar);
router.get('/scores/:id', controller.scores);


module.exports = router;
