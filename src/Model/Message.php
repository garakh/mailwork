<?php
namespace PassworkTeam\Mailwork\Model;

class Message
{
    public $date;
    public $direction;
    public $subj;
    public $body;
    public $from;
    public $to;
    public function __construct($date,$direction,$subj,$body,$from,$to)
    {
        $this->date = $date instanceof DateTime ? $date->getTimestamp() : $date;
        $this->direction = $direction;
        $this->subj = $subj;
        $this->body = $body;
        $this->from = $from;
        $this->to = $to;
    }
}