/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'jquery',
    'angular-route',
    'angular-sanitize',
    'angular-spinner',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index',
], function (angular, $) {
    'use strict';

    return angular.module('app', [
        'ngSanitize',
        'app.controllers',
        'app.directives',
        'app.filters',
        'app.services',
        'ngRoute',
        'angularSpinner'
    ]);

});
