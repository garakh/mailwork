/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./app'], function (app) {
    'use strict';

    var r = function (route, template) {
        return {
            templateUrl: '/js/controllers/' + route + '/' + (template ? template :'template') + '.html?' +  _bust,
            controller: 'site.controllers.' + route
        }
    }

    return app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/init/:meta/:email', r('init'));
        $routeProvider.when('/messages', r('messages'));
        $routeProvider.when('/messages/:email', r('messages'));
        $routeProvider.when('/templates', r('templates'));
        $routeProvider.otherwise({
            redirectTo: '/messages123'
        });
    }]);
});
