define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('site.controllers.templates',
            ['$scope', '$q', 'site.services.api', '$routeParams', '$window', 'site.services.mailService',
                function ($scope, $q, api, $routeParams, $window, mailService) {

                    $scope.closeIFrame = function () {
                        if(window.self === window.top) return ;
                        top.postMessage({action:"mw_closeIframe"}, '*');
                    };

                    $q.race([mailService.getTemplates()]).then(
                        function (response) {
                            $scope.templates = response;
                    });

                    $scope.addTemplate = function () {
                        mailService.addTemplate($scope.newTemplateText, $scope.templates);
                    }

                    $scope.deleteTemplate = function (id) {
                        mailService.deleteTemplate(id, $scope.templates);
                    };

                    $scope.back = function () {
                        $window.history.back();
                    };

                    $scope.sendTemplate = function (template) {
                        mailService.setTemplate(template);
                        $window.history.back();
                    }
                }]);
});
