define(['./module'], function (services) {
    'use strict';
    services.factory('site.services.mailService', [function () {
            const _CUTLENGTH = 250;
            let template = '';
            let subject = '';
            let saveTemplates = function (templates) {
                localStorage.setItem('mw-templates', angular.toJson(templates));
            };
            return {
                getTemplate: function () {
                    let t = template;
                    return new Promise(function (resolve, reject) {
                        resolve(t);
                    });
                },
                setTemplate: function (t) {
                    template = t;
                },
                getTemplates: function () {
                    return new Promise(function (resolve, reject) {
                        let data = localStorage.getItem('mw-templates');
                        if (!data) {
                            data = [];
                            saveTemplates(data);
                        }
                        data = angular.fromJson(data);
                        resolve(data);
                    });
                },
                addTemplate: function (text, templates) {
                    function containsObject(obj, list) {
                        var i;
                        for (i = 0; i < list.length; i++) {
                            if (list[i].text === obj.text) {
                                return true;
                            }
                        }
                        return false;
                    }

                    let template = {};
                    if (!text || text.trim() === '')
                        return false;
                    template.text = text;
                    if (!containsObject(template, templates))
                        templates.push(template);
                    saveTemplates(templates);
                },
                deleteTemplate: function (id, templates) {
                    templates.splice(id, 1);
                    saveTemplates(templates);
                },
                parseMessages: function (messages) {
                    let result = messages.map(function (_msg) {
                        let msg = {};
                        msg.email = _msg.from;
                        msg.owner = _msg.direction === 'ToMe';
                        msg.date = new Date(_msg.date * 1000);
                        msg.shown = true;
                        msg.subj = _msg.subj;
                        let l = _msg.body ? _msg.body.length : 0;
                        let shortBody = '';
                        if (_CUTLENGTH > l) {
                            msg.isShort = true;
                            shortBody = _msg.body;
                        } else {
                            shortBody = _msg.body.substr(0, _msg.body.lastIndexOf(' ', _CUTLENGTH)) + (_CUTLENGTH < l ? '...' : '');
                        }
                        msg.showAll = function showAll() {
                            if (!msg.shown) {
                                msg.body = _msg.body;
                            } else {
                                msg.body = shortBody;
                            }
                            msg.shown = !msg.shown;
                        };
                        msg.showAll();
                        return msg;
                    });
                    if (result.length > 1 && result[0].subj)
                        subject = result[0].subj.replace('Re: ', '');

                    for (let i = 1; i < result.length; i++) {
                        if (!result[i - 1].owner && !result[i].owner)
                            result[i - 1].divider = true;
                    }
                    
                    return result;
                },
                newMessage: function (body, email) {
                    let msg = {};
                    msg.body = body;
                    msg.subj = '';
                    if (subject)
                        msg.subj = 'Re: ' + subject;
                    msg.to = email;
                    return msg;
                }
            }
        }])
});
