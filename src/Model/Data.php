<?php
namespace PassworkTeam\Mailwork\Model;

class Data
{
    public $messages;
    public $email;
    public function __construct($messages, $email)
    {
        $this->messages = $messages;
        $this->email = $email;
    }
}