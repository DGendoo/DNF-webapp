'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/drug_list/:id', controller.drugList);
router.get('/drug_network/:id', controller.drugNetwork);


module.exports = router;
