(function () {
    var defaults = {
        'mw-url': 'https://mailwork.me',
        'mw-custom-imap-port': '993',
        'mw-custom-smtp-port': '587',
        'mw-token': 'publicserver'
    }
    var fields = ['mw-url', 'mw-token', 'mw-custom-email', 'mw-custom-imap-server', 'mw-custom-smtp-server',
        'mw-custom-imap-port', 'mw-custom-smtp-port', 'mw-custom-imap-username', 'mw-custom-imap-password', 'mw-custom-imap-inbox',
        'mw-custom-imap-outbox', 'mw-custom-imap-copyto'];
    function saveOptions() {

        var options = {};
        for (var i in fields) {
            var v = document.getElementById(fields[i]).value;
            if (!v) {
                v = defaults[fields[i]] ? defaults[fields[i]] : '';
            }
            options[fields[i]] = v;
        }

        options['custom-options-checkbox'] = document.getElementById('custom').checked;
        chrome.storage.sync.set(options);
        window.close();
        window.parent && window.parent.close();
    }

    function customChanged() {
        document.getElementById('custom-options').style.display = document.getElementById('custom').checked ? 'inline' : 'none';
    }

    function restoreOptions() {

        document.getElementById('save').addEventListener('click', saveOptions);
        document.getElementById('custom').addEventListener('change', customChanged);

        chrome.storage.sync.get(null, function (items) {
            for (var i in fields) {
                document.getElementById(fields[i]).value = items[fields[i]] ? items[fields[i]] :
                        (defaults[fields[i]] ? defaults[fields[i]] : '');
            }

            document.getElementById('custom').checked = items['custom-options-checkbox'];
            customChanged();
        });
    }

    document.addEventListener('DOMContentLoaded', restoreOptions);
}());