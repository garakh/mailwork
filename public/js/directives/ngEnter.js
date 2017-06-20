define(['./module'], function (directives) {
    'use strict';
    directives. directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keyup",function(e) {
                e.preventDefault();


                var ctrl = true;
                if (attrs.ctrl) {
                    ctrl = e.ctrlKey;
                }
                if(e.which === 13 && ctrl) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter);
                    });

                }
            });
        };
    });
});