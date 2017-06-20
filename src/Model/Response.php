<?php
namespace PassworkTeam\Mailwork\Model;
use Exception;

class Response
{
    public $response = true;
    public $error = false;
    public function __construct($model)
    {
        if($model instanceof AppException)
        {
            $this->response = false;
            $this->error = $model->getError();
            return;
        }
        if($model instanceof Exception)
        {
            $this->response = false;
            $this->error = 'Internal error';
            error_log($model->getMessage());
            return;
        }
        $this->response = $model;
    }
}