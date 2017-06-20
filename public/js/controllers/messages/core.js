define(['../module', 'jquery'], function (controllers, $) {
    'use strict';
    controllers.controller('site.controllers.messages',
            ['$scope', '$rootScope', '$q', 'site.services.api', '$routeParams', '$filter', '$location', 'site.services.mailService', 'usSpinnerService',
                function ($scope, $rootScope, $q, api, $routeParams, $filter, $location, mailService, usSpinnerService) {
                    let email = $routeParams.email ? atob($routeParams.email) : '';
                    let request = {};
                    let mailboxes = [];
                    request.email = email;

                    $scope.messages = [];
                    $scope.loading = false;
                    $scope.email = email;


                    $q.race([mailService.getTemplate()]).then(
                            function (response) {
                                $scope.newMessage = response;
                            }
                    );

                    $scope.toTemplates = function () {
                        mailService.setTemplate($scope.newMessage);
                        $location.url('/templates');
                    };

                    $scope.closeIFrame = function () {
                        if (window.self === window.top)
                            return;
                        top.postMessage({action: "mw_closeIframe"}, '*');
                    };

                    $scope.extOptions = function () {
                        if (window.self === window.top)
                            return;
                        top.postMessage({action: "mw_optionsShow"}, '*');
                    };

                    $scope.listMailboxes = function () {
                        alert(mailboxes);
                    };

                    $scope.receiveMail = function (reload) {
                        if ($scope.loading) {
                            return;
                        }
                        if ($rootScope.messages && !reload) {
                            $scope.loading = false;
                            return;
                        }
                        $scope.loading = true;
                        api.post(api.messages.findByEmail, request)
                                .then(function (response) {
                                    if (response) {
                                        $scope.messages = mailService.parseMessages(response.messages);
                                        setTimeout(function () {
                                            $("#mw-messages").animate({scrollTop: $(document).height() + 200}, "slow");
                                        }, 200);
                                    }
                                    $scope.loading = false;
                                });
                    }

                    $scope.sendEmail = function () {
                        if ($scope.newMessage && confirm('Send message?')) {
                            $scope.loading = true;
                            let msg = mailService.newMessage($scope.newMessage, email);
                            api.post(api.messages.sendEmail, msg)
                                    .then(function (response) {
                                        $scope.newMessage = '';
                                        if (response) {
                                            msg.owner = true;
                                            msg.email = 'Just sent to ' + email;
                                            msg.date = new Date();
                                            msg.isShort = true;
                                            $scope.messages.unshift(msg);
                                            $scope.loading = false;
                                        }
                                    });
                        }
                    };

                    function getMailboxes() {
                        api.post(api.messages.getMailboxes)
                                .then(function (response) {
                                    mailboxes = response;
                                });
                    }

                    $scope.receiveMail();
                    getMailboxes();


                }]);
});
