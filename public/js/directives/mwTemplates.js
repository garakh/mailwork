define(['./module'], function (directives) {
    'use strict';
    directives. directive('mwTemplates',[function() {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/templates/templates.html',
            transclude: true,
            scope: {
                'templates': '=mwTemplates',
                'delete': '&delete',
                'send': '&send'
            }
        }
    }])
});