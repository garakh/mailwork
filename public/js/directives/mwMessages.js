define(['./module'], function (directives) {
    'use strict';
    directives. directive('mwMessages', function() {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/templates/messages.html',
            scope: {
                messages: '=mwMessages'
            }
        }
    })
});
