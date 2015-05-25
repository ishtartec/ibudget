'use strict';

angular.module('budgetsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  //'ui.bootstrap'
  'mgcrea.ngStrap',
    'angular-growl',
    'textAngular'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $datepickerProvider, growlProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
        growlProvider.globalTimeToLive(5000);
        $httpProvider.interceptors.push(growlProvider.serverMessagesInterceptor);

        /*
        angular.extend($tooltipProvider.defaults, {
            animation: 'am-flip-x',
            trigger: 'hover',
            delay: { show: 2000, hide: 100 }
        });
        */

        angular.extend($datepickerProvider.defaults, {
            dateFormat: 'dd/MM/yyyy',
            startWeek: 1,
            daysOfWeekDisabled: [0,6]
        });
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });