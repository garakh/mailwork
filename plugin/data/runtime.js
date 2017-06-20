;
(function () {
    var port = chrome.runtime.connect({name: 'mw-ext-port'});
    var defaults = {
        'mw-url': 'https://mailwork.me',
        'mw-custom-imap-port': '993',
        'mw-custom-smtp-port': '587',
        'mw-token': 'publicserver'
    };
    var fields = ['mw-url', 'mw-token', 'mw-custom-email', 'mw-custom-imap-server', 'mw-custom-smtp-server',
        'mw-custom-imap-port', 'mw-custom-smtp-port', 'mw-custom-imap-username', 'mw-custom-imap-password', 'mw-custom-imap-inbox',
        'mw-custom-imap-outbox', 'mw-custom-imap-copyto'];

    var options = {};
    window._mwPopupDisplayed = false;

    chrome.storage.sync.get(null, function (items) {
        for (var i in fields) {
            options[fields[i]] = items[fields[i]] ? items[fields[i]] :
                    (defaults[fields[i]] ? defaults[fields[i]] : '');
        }

        options['custom'] = items['custom-options-checkbox'];
    });

    port.onMessage.addListener(function (msg) {
        switch (msg.action) {
            case 'mw_closeIframe' :
            {
                document.getElementById('_mwframe').remove();
                window._mwPopupDisplayed = false;
                break;
            }
            case 'mw_optionsShow' :
            {
                if (chrome.runtime.openOptionsPage) {
                    chrome.runtime.openOptionsPage();
                } else {
                    window.open(chrome.runtime.getURL('data/options.html'));
                }
                break;
            }
            case 'mw_open_mailwork':
            {
                if (window._mwPopupDisplayed)
                    return;
                var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
                if (!location.ancestorOrigins.contains(extensionOrigin)) {
                    var iframe = document.createElement('iframe');
                    var meta = btoa(unescape(encodeURIComponent(JSON.stringify(options))));
                    meta = meta.replace(/\//g, '~');
                    iframe.src = options['mw-url'] + "/iframe/#!/init/" + meta + '/' + btoa(msg.data);
                    iframe.id = "_mwframe";
                    iframe.name = "target";
                    iframe.style.cssText = '' +
                            'position:fixed!important;' +
                            'top:0;left:0;' +
                            'display:block!important;' +
                            'width:100%!important; ' +
                            'height: calc(100% - 0.2rem)!important;' +
                            'z-index:9999999999;' +
                            'font-size: 10px;' +
                            'border: none; ' +
                            'padding: 0!important;' +
                            'background: none;' +
                            'background-color: rgba(0,0,0,0.5);';
                    document.body.appendChild(iframe);
                    window._mwPopupDisplayed = true;
                }
                break;
            }
        }
    });

    chrome.runtime.onMessage.addListener(function (msg) {
        if (msg.action == 'mw_open_mailwork') {
            port.postMessage(msg);
        }
    });

    window.addEventListener('message', function (e) {
        switch (e.data.action) {
            case 'mw_closeIframe' :
            case 'mw_optionsShow' :
            {
                port.postMessage(e.data);
                break;
            }
        }
    });
})();