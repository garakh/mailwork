;(function () {
    var validateEmail = function (email) {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!email.match(re)) return '';
        return email;
    };

    var extractEmails = function (text) {
        return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    };

    var getEmail = function (data) {
        data = data.trim();
        var valid = validateEmail(data);
        if (valid.length > 0) return valid;
        if (data.indexOf('@') < 0) return '';
        var email = extractEmails(data);
        return email[0];
    };

    var createIFrame = function (tab, email) {
        var message = {action: "mw_open_mailwork", data: email};
        chrome.tabs.query({active: true, currentWindow: true}, function () {
            chrome.tabs.sendMessage(tab.id, message, function (response) {
            });
        });
    };

    var processData = function (data) {
        var email = getEmail(data);
        return email !== '' ? email : false;
    };

    chrome.contextMenus.create({
        title: 'Look at e-mail history',
        contexts: ["link","selection"],
        onclick: function (info, tab) {
            var data;
            if(info.linkUrl) if (data = processData(info.linkUrl)) createIFrame(tab, data);
            if(info.selectionText) if (data = processData(info.selectionText)) createIFrame(tab, data);
        }
    });

    chrome.runtime.onConnect.addListener(function (port) {
        if (port.name != "mw-ext-port") return;
        port.onMessage.addListener(function (msg) {
            //if (msg.action == "mw_closeIframe")
            port.postMessage(msg);
        });
    });
})();