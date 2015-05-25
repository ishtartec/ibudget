'use strict';

angular.module('budgetsApp')
  .factory('BService',['$resource', function ($resource) {
      return $resource('api/budgets/:id', {}, {
        'query': { method: 'GET', isArray: true},
        'get': { method: 'GET'},
        'details': {method:'GET', params:{id:'date'}, isArray:true},
        'update': { method: 'PUT'}
      });
    }]);
