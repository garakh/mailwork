### About Mailwork ###
Sell better with instant access to e-mail history from any web page.
Power up Trello, Jira, CRM/CMS and any web site or service with IMAP mailbox integration. Click any e-mail and instantly get the correspondence history in your browser.

### How it works ###
1. Click any e-mail address on any web page
2. Select Mailwork in a browser's context menu
3. Extension sends a query to Mailwork server with particular email
4. The query contains creds for your IMAP or Mailwork server can use predefined IMAP settings
5. Mailwork server connects to the IMAP and looks up for messages history with the e-mail
6. Mailwork prepares the found emails as a chat conversation and returns to the extension
7. You see a dialog with the e-mail's owner
8. You can write an instant message which will be sent via SMTP server

### How to install Mailwork server ###


```
#!sh

clone this repository

# install php dependencies
php composer.phar install

# install js dependencies
bower install

```

**Configure via gulp**

```

# install gulp dependencies
npm install

# answer the questions to prepare a config file
# src/Config/config.json will be created
gulp setup

```

**Manual configuraion**

Copy `src/Config/config.example.json` to `src/Config/config.json`

```
{
    "search": {
        "date-modifier": "-6 month"
    },
    "authorization": {
        "secret-token": "supersecrettoken"
    },
    "mail-settings": {
        "email": "username@gmail.com",
        "imap-server": "imap.gmail.com",
        "smtp-server": "smtp.gmail.com",
        "imap-port": 993,
        "smtp-port": 587,
        "username": "username",
        "password": "password",
        "copy-sent-to": "[Gmail]/Sent Mail",
        "search-mailbox-in": ["INBOX"],
        "search-mailbox-out": ["[Gmail]/Sent Mail"]
    },
    "cache-settings":
            {
                "path": "/../cache",
                "ttl": 300
            }
}
```

Mailwork server uses these options by default (if the extension doesn't override them) 


### Creating self-signed certificate ###

Your browser will display a lot of warnings if you don't use HTTPS on Mailwork server.
You can create a free self-signed SSL certificate and install it on your local computer.

```
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days X365 -nodes
openssl x509 -outform der -in cert.pem -out cert.crt
```

### GNU General Public License v 3.0 ###
