define(['./module', "jquery"], function (services, $) {
    'use strict';
    services.factory('site.services.api', ['$http', '$q', function ($http, $q) {
            var meta = {};
            return {
                messages: {
                    'findByEmail': '/api/findByEmail',
                    'sendEmail': '/api/sendEmail',
                    'getMailboxes': '/api/getMailboxes'
                },
                setToken: function (m) {
                    meta = m;
                },
                get: function (url, dataToSend, error) {
                    return this._send("GET", url, dataToSend, error);
                },
                post: function (url, dataToSend, error) {
                    return this._send("POST", url, dataToSend, error);
                },
                _send: function (method, url, dataToSend, error) {
                    if (!dataToSend)
                        dataToSend = {};

                    dataToSend['_meta'] = meta;

                    return $http({method: method, url: url, data: dataToSend}).then(function (response) {

                        var data = response.data;

                        if (data.response !== false)
                            return data.response;

                        if (!error && data.error)
                            alert(data.error);
                        else
                            error(data);

                        return false;
                    }, function (response) {


                    });
                }
            }
        }]);
});

