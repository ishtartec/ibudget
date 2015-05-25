'use strict';

var _ = require('lodash');
var Budget = require('./budget.model');

// Get list of budgets
exports.index = function(req, res) {
  Budget.find(function (err, budgets) {
    if(err) { return handleError(res, err); }
    return res.json(200, budgets);
  });
};

// Get a single budget
exports.show = function(req, res) {
  Budget.findById(req.params.id, function (err, budget) {
    if(err) { return handleError(res, err); }
    if(!budget) { return res.send(404); }
    return res.json(budget);
  });
};

// Creates a new budget in the DB.
exports.create = function(req, res) {
  Budget.create(req.body, function(err, budget) {
    if(err) { return handleError(res, err); }
    return res.json(201, budget);
  });
};

// Updates an existing budget in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Budget.findById(req.params.id, function (err, budget) {
    if (err) { return handleError(res, err); }
    if(!budget) { return res.send(404); }
    var updated = _.merge(budget, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, budget);
    });
  });
};

// Deletes a budget from the DB.
exports.destroy = function(req, res) {
  Budget.findById(req.params.id, function (err, budget) {
    if(err) { return handleError(res, err); }
    if(!budget) { return res.send(404); }
    budget.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}