<?php
namespace PassworkTeam\Mailwork\Model;
use Exception;

class AppException extends Exception
{
    /**
     * Код ошибки
     * @var string
     */
    private $errorCode = null;


    /**
     * Конструктор
     * @param string $errorMessage Сообщение об ошибке
     * @param string $error Код ошибки
     *
     */
    public function __construct($errorMessage, $error = null)
    {

        parent::__construct($errorMessage);
        $this->errorCode = $error;
    }

    /**
     * Получает код ошибки
     * @return type
     */
    public function getError()
    {
        return $this->errorCode ? $this->errorCode : $this->getMessage();
    }
}