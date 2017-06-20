<?php

namespace PassworkTeam\Mailwork\Controller;

use PassworkTeam\Mailwork\Model\AppException;

class MetaMiddleware
{

    private $config;

    public function __construct($config)
    {
        $this->config = $config;
    }

    private function overrideOptions($custom)
    {
        if(!$custom)
            return;
        
        if(!$custom->custom)
            return;
        
        $this->config->set('mail-settings.email', $custom->{'mw-custom-email'});
        $this->config->set('mail-settings.imap-server', $custom->{'mw-custom-imap-server'});
        $this->config->set('mail-settings.smtp-server', $custom->{'mw-custom-smtp-server'});
        $this->config->set('mail-settings.imap-port', $custom->{'mw-custom-imap-port'});
        $this->config->set('mail-settings.smtp-port', $custom->{'mw-custom-smtp-port'});
        $this->config->set('mail-settings.username', $custom->{'mw-custom-imap-username'});
        $this->config->set('mail-settings.password', $custom->{'mw-custom-imap-password'});
        $this->config->set('mail-settings.copy-sent-to', $custom->{'mw-custom-imap-copyto'});
        $this->config->set('mail-settings.search-mailbox-in', explode(',', $custom->{'mw-custom-imap-inbox'}));
        $this->config->set('mail-settings.search-mailbox-out', explode(',', $custom->{'mw-custom-imap-outbox'}));
    }
    
    public function __invoke($request, $response, $next)
    {
        $jsonData = $request->getBody();
        $data = json_decode($jsonData);
        $token = $this->config->get('authorization')['secret-token'];
        
        if ($token && (!$data || !$data->_meta || $data->_meta->{'mw-token'} !== $token))
        {
            throw new AppException('unauthorized');
        }
        
        $this->overrideOptions($data->_meta);
        $response = $next($request, $response);
        return $response;
    }

}
