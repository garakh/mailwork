<?php
namespace PassworkTeam\Mailwork\Service;
use PassworkTeam\Mailwork\Controller\ApiController as ApiController,
    PassworkTeam\Mailwork\Controller\IndexController as IndexController,
	PassworkTeam\Mailwork\Model\AppException,
	PassworkTeam\Mailwork\Model\Response as Response,
	Noodlehaus\Config as Config;


class Bootstrap
{

    private $app;

    public  function  __construct()
    {
        $config = [
            "settings"  => [
                "determineRouteBeforeAppMiddleware" => true,
                'displayErrorDetails' => true
            ]
        ];
        $app = new \Slim\App($config);
        $this->initContainer($app->getContainer());
        $this->app = $app;
    }

    private function initContainer($c)
    {
        $c['config'] = Config::load(__DIR__ . '/../Config/config.json');

        $c['errorHandler'] = function ($c) {
            return function ($request, $response, $exception) use ($c)
            {
                return $c['response']->withStatus(200) 
                    ->withJson(new Response($exception));
            };
        };
        $c['mailService'] = function () use($c)
        {
            return new MailService($c);
        };
        $c['cacheService'] = function () use($c)
        {
            return new CacheService($c);
        };
    }

    public function init()
    {
        $app = $this->app;
        (new ApiController())->init($app);
        (new IndexController())->init($app);
        $app->run();
    }
}

