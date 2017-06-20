<?php

namespace PassworkTeam\Mailwork\Service;

use Ddeboer\Imap\Search\Date\After,
    Ddeboer\Imap\Search\Date\Before,
    Ddeboer\Imap\Search\Flag\Unseen,
    Ddeboer\Imap\Search\LogicalOperator\OrConditions,
    Ddeboer\Imap\Search\State\NewMessage,
    PassworkTeam\Mailwork\Model\AppException,
    PassworkTeam\Mailwork\Model\Message,
    PassworkTeam\Mailwork\Model\Data,
    Ddeboer\Imap\Server,
    Ddeboer\Imap\SearchExpression,
    Ddeboer\Imap\Search\Email\FromAddress,
    Ddeboer\Imap\Search\Email\To,
    Slim\Container as Container,
    Mail,
    PEAR,
    DateTime;

class MailService
{

    protected $server;
    protected $connection;
    protected $config;
    protected $cacheService;
    protected $modifier;

    public function __construct(Container $container)
    {
        $this->cacheService = $container->get('cacheService');
        $cfg = $container->get('config');
        $this->config = $cfg->get('mail-settings');
        $this->modifier = $cfg->get('search')['date-modifier'];
        $this->connectToServer();
    }

    private function connectToServer()
    {
        $config = $this->config;
        $serv = $config['imap-server'];
        if ($serv == null)
            throw new AppException('no-server-specified');
        $port = $config['imap-port'];
        $user = $config['username'];
        $pass = $config['password'];
        $flags = $config['flags'];
        $this->server = new Server(
                $serv, $port == null ? 993 : $port, $flags == null ? '/imap/ssl/validate-cert' : $flags
        );
        $this->connection = $this->server->authenticate($user, $pass);
    }

    public function findByEmail($email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL))
        {
            throw new AppException('email-invalid');
        }

        $cs = $this->cacheService;
        $key = md5($email . $this->config['username'] . $this->config['password']);
        $data = $cs->retrieve($key);
        $messages = $data['messages'];

        if (empty($messages))
        {
            $data['messages'] = $this->getMessages($email);
            $data['email'] = $this->config['email'];
            $cs->store($key, $data);
            $messages = $data['messages'];
        }
        return new Data($messages, $this->config['email']);
    }

    public function getMailboxesNames()
    {
        return $this->connection->getMailboxNames();
    }

    private function getMessages($email)
    {
        $searchFrom = new SearchExpression();
        $searchFrom->addCondition(new FromAddress($email));
        $searchTo = new SearchExpression();
        $searchTo->addCondition(new To($email));
        $mailboxesList = $this->connection->getMailboxes();

        $config = $this->config;
        $inboxNames = $config['search-mailbox-in'] ? $config['search-mailbox-in'] : array();
        $sentNames = $config['search-mailbox-out'] ? $config['search-mailbox-out'] : array();
        if (!in_array('INBOX', $inboxNames) && !in_array('inbox', $inboxNames))
            $inboxNames[] = "INBOX";

        if (empty($sentNames))
            $sentNames[] = "Sent";

        $mailboxesFrom = array();
        $mailboxesTo = array();

        foreach ($mailboxesList as $box)
        {
            $encoding = mb_detect_encoding($box->getDecodedName());
            $boxname = mb_strtolower($box->getDecodedName(), $encoding);
            foreach ($inboxNames as $name)
            {
                $name = mb_strtolower($name, mb_detect_encoding($name));
                if (mb_strpos($boxname, $name, 0, $encoding) !== false && !in_array($box, $mailboxesFrom))
                    $mailboxesFrom[] = $box;
            }
            foreach ($sentNames as $name)
            {
                $name = mb_strtolower($name, mb_detect_encoding($name));
                if (mb_strpos($boxname, $name, 0, $encoding) !== false && !in_array($box, $mailboxesTo))
                    $mailboxesTo[] = $box;
            }
        }

        $msgArr = Array();
        foreach ($mailboxesFrom as $box)
        {
            $this->getMessagesFromBox($msgArr, $box, $searchFrom, 'FromMe');
        }
        foreach ($mailboxesTo as $box)
        {
            $this->getMessagesFromBox($msgArr, $box, $searchTo, 'ToMe');
        }

        usort($msgArr, function ($a, $b)
        {
            if ($a->date == $b->date)
                return 0;
            return ($a->date > $b->date) ? 1 : -1;
        });

        return $msgArr;
    }

    private function getMessagesFromBox(&$msgArr, $box, $search, $direction)
    {
        if ($this->modifier)
        {
            $date = new DateTime('now');
            $date->modify($this->modifier);
            $search->addCondition(new After($date));
        }

        ini_set('max_execution_time', 300); //You can not change this setting with ini_set() when running in safe mode. The only workaround is to turn off safe mode or by changing the time limit in the php.ini.
        $msgs = $box->getMessages($search);

        foreach ($msgs as $im => $msg)
        {
            $toList = $msg->getTo();
            $toArr = Array();
            foreach ($toList as $to)
            {
                if ($to)
                    $toArr[] = $to->getAddress();
            }
            $body = strip_tags($msg->getBodyText());
            $body = iconv('UTF-8', 'UTF-8//IGNORE', $body);
            $msgArr[] = new Message(
                    $msg->getDate()->getTimestamp(), $direction, $msg->getSubject(), $body, $msg->getFrom()->getAddress(), $toArr[0]
            );
        }
    }

    public function sendEmail($text, $subject, $to)
    {
        $config = $this->config;
        $mailbox = Mail::factory('smtp', array(
                    'host' => $config['smtp-server'],
                    'port' => !empty($config['smtp-port']) ? $config['smtp-port'] : 587,
                    'auth' => TRUE,
                    'username' => $config['email'],
                    'password' => $config['password'],
                    'persist' => FALSE));
        $headers = array(
            'From' => $config['email'],
            'Return-Path' => $config['email'],
            'To' => $to,
            'Subject' => $subject
        );
        $toArr = Array();
        $toArr[] = $to;
        $result = $mailbox->send($toArr, $headers, $text);
        if (PEAR::isError($result))
        {
            error_log($result->getMessage());
            throw new AppException('smtp-error');
        };


        //IMAP save to sent
        $mailboxesList = $this->connection->getMailboxes();
        if (!empty($config['copy-sent-to']))
        {
            $sent = $config['copy-sent-to'];
            foreach ($mailboxesList as $box)
            {
                $encoding = mb_detect_encoding($box->getDecodedName());
                $boxname = mb_strtolower($box->getDecodedName(), $encoding);
                $sent = mb_strtolower($sent, mb_detect_encoding($sent));
                if (mb_strpos($boxname, $sent, 0, $encoding) !== false)
                {
                    $sentBox = $box;
                    break;
                }
            }
            $body = "From: " . $config['email'] . "\r\n" .
                    "To: " . $to . "\r\n" .
                    "Subject: " . $subject . "\r\n" .
                    "\r\n" . $text . "\r\n";
            if (!empty($sentBox))
                $sentBox->addMessage($body, "\\Seen");
        }
        $key = md5($to . $this->config['username'] . $this->config['password']);
        $this->cacheService->delete($key);
        return true;
    }

}
