define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('site.controllers.init', ['$scope', '$location', '$routeParams', 'site.services.api', function ($scope, $location, $routeParams, api) {
            var meta = decodeURIComponent(escape(atob($routeParams.meta.replace(/~/g, '/'))));
            meta = JSON.parse(meta);
            api.setToken(meta);
            $location.url('/messages/' + $routeParams.email);
        }])
});
