/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
require.config({
    paths: {
        'angular': 'lib/angular/angular',
        'angular-route': 'lib/angular-route/angular-route',
        'angular-sanitize': 'lib/angular-sanitize/angular-sanitize',
        'domReady': 'lib/domReady/domReady',
        "jquery": "lib/jquery/dist/jquery",
        'angular-spinner': "lib/angular-spinner/dist/angular-spinner"
    },
    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery']
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-sanitize': {
            deps: ['angular']
        }
    },
    deps: [
        './bootstrap',
    ],
    urlArgs: 'bust=' + _bust,
    waitSeconds: 50
});
